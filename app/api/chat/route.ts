import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildSystemPrompt, parseAIResponse, messagesToChatFormat } from '@/lib/ai-system-prompt';
import type { Project, Request as UnifiedRequest, PortalMessage, AgencyPricing } from '@/lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, portalToken, message } = body;

    if (!portalToken || !message) {
      return NextResponse.json({ error: 'Missing portalToken or message' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Validate portal token → get project
    const { data: project, error: projError } = await supabase
      .from('projects')
      .select('*')
      .eq('portal_token', portalToken)
      .eq('portal_enabled', true)
      .single();

    if (projError || !project) {
      return NextResponse.json({ error: 'Invalid or disabled portal' }, { status: 403 });
    }

    const typedProject = project as Project;

    // 2. Fetch agency profile + pricing
    const { data: profile } = await supabase
      .from('profiles')
      .select('agency_name, default_hourly_rate, currency')
      .eq('id', typedProject.user_id)
      .single();

    const { data: pricing } = await supabase
      .from('agency_pricing')
      .select('*')
      .eq('user_id', typedProject.user_id)
      .single();

    const typedPricing = (pricing as AgencyPricing) || null;

    // If no agency_pricing exists, build one from profile defaults
    const effectivePricing: AgencyPricing | null = typedPricing || (profile?.default_hourly_rate ? {
      id: '',
      user_id: typedProject.user_id,
      hourly_rate: profile.default_hourly_rate,
      currency: profile.currency || 'USD',
      min_hours: 1,
      overage_multiplier: 1.5,
      notes: '',
      created_at: '',
      updated_at: '',
    } : null);

    // 3. Fetch chat history (last 50 messages)
    const { data: messages } = await supabase
      .from('portal_messages')
      .select('*')
      .eq('project_id', typedProject.id)
      .order('created_at', { ascending: true })
      .limit(50);

    const chatHistory = (messages || []) as PortalMessage[];

    // 4. Fetch recent scope requests for context
    const { data: recentRequests } = await supabase
      .from('requests')
      .select('*')
      .eq('project_id', typedProject.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // 5. Build system prompt
    const systemPrompt = buildSystemPrompt({
      project: typedProject,
      agencyName: profile?.agency_name || '',
      pricing: effectivePricing,
      recentRequests: (recentRequests || []) as any[], // Typing works with old ScopeRequest, so we pass as any for now
    });

    // 6. Save client message (non-blocking — table may not exist yet)
    try {
      await supabase.from('portal_messages').insert({
        project_id: typedProject.id,
        role: 'client',
        content: message,
        metadata: {},
      });
    } catch (e) {
      console.warn('Could not save client message (portal_messages table may not exist):', e);
    }

    // 7. Build conversation for Gemini (filter out system messages — Gemini only supports user/model)
    const geminiContents = messagesToChatFormat(chatHistory)
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }],
      }));
    // Add the new user message
    geminiContents.push({ role: 'user' as const, parts: [{ text: message }] });

    // 8. Call Google Gemini
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      // Fallback: simulate AI response when no API key is set
      const fallbackResponse = generateFallbackResponse(message, typedProject, effectivePricing);

      try {
        await supabase.from('portal_messages').insert({
          project_id: typedProject.id,
          role: 'assistant',
          content: fallbackResponse.content,
          metadata: fallbackResponse.metadata,
        });
      } catch (e) {
        console.warn('Could not save fallback message:', e);
      }

      return NextResponse.json({
        message: fallbackResponse.content,
        metadata: fallbackResponse.metadata,
      });
    }

    const geminiModel = 'gemini-2.0-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;

    const geminiBody: Record<string, unknown> = {
      contents: geminiContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    // Add system instruction (supported in v1beta)
    geminiBody.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errText);
      // Surface actual error for debugging
      let errorDetail = 'AI service error';
      try {
        const errJson = JSON.parse(errText);
        errorDetail = errJson.error?.message || errorDetail;
      } catch {
        errorDetail = errText.substring(0, 200) || errorDetail;
      }
      return NextResponse.json({ error: errorDetail }, { status: 502 });
    }

    const aiData = await geminiResponse.json();
    const rawResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not process that request.';

    // 9. Parse response for scope decision
    const { cleanContent, decision } = parseAIResponse(rawResponse);

    // 10. Create unified request record for the client message
    let metadata: Record<string, unknown> = {};

    if (decision) {
      metadata = { ...decision };
    }

    const { data: requestRecord } = await supabase
      .from('requests')
      .insert({
        project_id: typedProject.id,
        client_id: typedProject.client_email,
        message: message,
        ai_decision: decision?.decision || 'needs-info',
        confidence_score: decision ? 0.9 : 0, // Fallback if no exact confidence from decision
        reasoning: decision?.reasoning || '',
        estimated_impact: decision?.estimatedHours ? `${decision.estimatedHours} hrs` : (decision?.cost || ''),
        status: decision?.decision === 'out-of-scope' ? 'out-of-scope' : 'analyzed',
      })
      .select()
      .single();

    if (requestRecord) {
      metadata.requestId = requestRecord.id;
    }

    // 11. Save AI response (non-blocking)
    try {
      await supabase.from('portal_messages').insert({
        project_id: typedProject.id,
        role: 'assistant',
        content: cleanContent,
        metadata,
      });
    } catch (e) {
      console.warn('Could not save assistant message:', e);
    }

    return NextResponse.json({
      message: cleanContent,
      metadata,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * Fallback AI response when no Gemini API key is configured.
 * Provides a smart rule-based response.
 */
function generateFallbackResponse(
  message: string,
  project: Project,
  pricing: AgencyPricing | null
) {
  const msg = message.toLowerCase();
  const rate = pricing?.hourly_rate || 150;
  const currency = pricing?.currency || 'USD';

  // Detect greetings
  if (msg.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return {
      content: `Hi ${project.client_name}! 👋 Welcome to your **${project.name}** portal.\n\nI'm your ScopeOS AI assistant. You can tell me what you need, and I'll analyze whether it falls within our current project scope.\n\nWhat can I help you with today?`,
      metadata: {},
    };
  }

  // Detect out-of-scope keywords
  if (msg.match(/(new feature|add|additional|extra|also want|can you also|redesign|rebuild|migrate|integration)/)) {
    const hours = Math.ceil(Math.random() * 8 + 4);
    const cost = hours * rate;

    return {
      content: `I've analyzed your request, and this appears to be **outside the current project scope**.\n\n### 📋 Change Request\n\n**Request:** ${message}\n\n**Why it's out of scope:** This involves additional work beyond the original project agreement.\n\n### 💰 Cost Estimate\n\n| Item | Details |\n|------|--------|\n| Estimated hours | ${hours} hrs |\n| Rate | $${rate}/hr |\n| **Total** | **$${cost.toLocaleString()} ${currency}** |\n\nWould you like to proceed with this as a paid change request? Just reply **"Yes, approve"** to confirm.`,
      metadata: {
        decision: 'out-of-scope',
        estimatedHours: hours,
        cost: `$${cost.toLocaleString()}`,
        reasoning: 'Request involves work beyond original project scope',
        title: message.substring(0, 60),
      },
    };
  }

  // Detect scope questions
  if (msg.match(/(bug|fix|broken|not working|error|issue|problem|crash)/)) {
    return {
      content: `Thanks for reporting this. Bug fixes and issues with existing functionality are **within scope** ✅\n\n### ✅ Task Added\n\n**Issue:** ${message}\n\nI've logged this and sent it to the team for prioritization. You'll receive updates as work progresses.\n\nIs there anything else you need help with?`,
      metadata: {
        decision: 'in-scope',
        estimatedHours: 2,
        cost: '$0',
        reasoning: 'Bug fix falls within standard project maintenance scope',
        title: message.substring(0, 60),
      },
    };
  }

  // Detect clarification needed
  if (msg.length < 20 || msg.match(/(change|update|modify|adjust)/)) {
    return {
      content: `I'd like to help with that! Before I can analyze the scope, could you give me a bit more detail?\n\n**Please clarify:**\n1. What specifically needs to be changed?\n2. Which part of the project does this affect?\n3. What's the expected outcome?\n\nThis will help me give you an accurate scope assessment and cost estimate.`,
      metadata: {
        decision: 'needs-info',
        estimatedHours: 0,
        cost: '$0',
        reasoning: 'Need more details to determine scope',
        title: message.substring(0, 60),
      },
    };
  }

  // Default: in-scope general work
  return {
    content: `Got it! I've reviewed your request and this looks like it's **within the current project scope** ✅\n\n### ✅ Task Logged\n\n**Request:** ${message}\n\nThis has been sent to the team and will be included in the current sprint. No additional cost.\n\nAnything else you'd like to discuss?`,
    metadata: {
      decision: 'in-scope',
      estimatedHours: 3,
      cost: '$0',
      reasoning: 'Request falls within agreed project deliverables',
      title: message.substring(0, 60),
    },
  };
}
