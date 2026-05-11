'use client';

import { useParams, useRouter } from 'next/navigation';
import { getProjectByToken, getPortalMessages } from '@/lib/database';
import type { Project, PortalMessage } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bot,
  User,
  Loader2,
  DollarSign,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export default function TokenPortalPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const proj = await getProjectByToken(token);
      if (proj) {
        setProject(proj);
        const msgs = await getPortalMessages(proj.id);
        setMessages(msgs);
      }
      setIsLoading(false);
    };
    loadData();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending || !project) return;

    const userMessage = input.trim();
    setInput('');
    setIsSending(true);

    // Optimistically add client message
    const tempClientMsg: PortalMessage = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      role: 'client',
      content: userMessage,
      metadata: {},
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempClientMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          portalToken: token,
          message: userMessage,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Chat API error:', res.status, errBody);
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const data = await res.json();

      const assistantMsg: PortalMessage = {
        id: `resp-${Date.now()}`,
        project_id: project.id,
        role: 'assistant',
        content: data.message,
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: PortalMessage = {
        id: `err-${Date.now()}`,
        project_id: project.id,
        role: 'assistant',
        content: `Sorry, something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        metadata: {},
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          <p className="text-white/40">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Portal Not Found</h1>
        <p className="text-white/40 mb-6">
          This portal link is invalid or has been disabled.
        </p>
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl"
        >
          Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06] flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-white truncate">{project.name}</h1>
          <p className="text-xs text-white/40">AI-Powered Project Portal</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Active
          </span>
        </div>
      </div>

      {/* ── MESSAGES AREA ── */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4 min-h-0">
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Hi {project.client_name}! 👋
            </h2>
            <p className="text-white/40 max-w-md mb-8">
              Tell me what you need for <span className="text-white font-medium">{project.name}</span>.
              I&apos;ll analyze scope and handle everything automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
              {[
                { label: 'Report a bug', icon: '🐛' },
                { label: 'Request a feature', icon: '✨' },
                { label: 'Ask a question', icon: '❓' },
              ].map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => {
                    setInput(suggestion.label);
                    inputRef.current?.focus();
                  }}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all text-sm text-white/60 hover:text-white/80 text-left"
                >
                  <span className="text-lg mr-2">{suggestion.icon}</span>
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'client' ? (
              /* ── CLIENT MESSAGE ── */
              <div className="flex justify-end">
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="bg-blue-500/20 border border-blue-500/20 rounded-2xl rounded-br-md px-4 py-3">
                    <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
              </div>
            ) : (
              /* ── AI MESSAGE ── */
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="text-sm text-white/80 whitespace-pre-wrap prose-sm">
                        <MessageContent content={msg.content} />
                      </div>
                    </div>

                    {/* ── DECISION CARD ── */}
                    {msg.metadata?.decision && (
                      <DecisionCard metadata={msg.metadata} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400/60"
                      style={{
                        animation: `glow-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                  <span className="text-xs text-white/30 ml-2">Analyzing scope...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT BAR ── */}
      <div className="flex-shrink-0 pt-4 border-t border-white/[0.06]">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you need..."
              rows={1}
              className="w-full resize-none dark-input rounded-xl px-4 py-3 pr-12 text-sm leading-relaxed min-h-[48px] max-h-[150px]"
              disabled={isSending}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="btn-gradient text-white border-0 rounded-xl h-[48px] w-[48px] p-0 flex items-center justify-center disabled:opacity-40"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          Powered by ScopeOS AI • Messages are analyzed for scope decisions
        </p>
      </div>
    </div>
  );
}

/* ─── MESSAGE CONTENT RENDERER ─── */
function MessageContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return (
            <h4 key={i} className="text-sm font-semibold text-white mt-3 mb-1">
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={i} className="text-base font-semibold text-white mt-3 mb-1">
              {line.replace('## ', '')}
            </h3>
          );
        }

        // Table rows
        if (line.startsWith('|')) {
          const cells = line
            .split('|')
            .filter(Boolean)
            .map((c) => c.trim());
          if (cells.every((c) => c.match(/^[-:]+$/))) return null; // separator row
          return (
            <div key={i} className="flex items-center gap-4 text-xs py-1">
              {cells.map((cell, j) => (
                <span key={j} className={j === 0 ? 'text-white/40 w-32' : 'text-white font-medium'}>
                  <InlineFormat text={cell} />
                </span>
              ))}
            </div>
          );
        }

        // Empty lines
        if (!line.trim()) {
          return <div key={i} className="h-2" />;
        }

        // Regular text with inline formatting
        return (
          <p key={i} className="text-sm text-white/80 leading-relaxed">
            <InlineFormat text={line} />
          </p>
        );
      })}
    </>
  );
}

/* ─── INLINE FORMAT ─── */
function InlineFormat({ text }: { text: string }) {
  // Handle **bold**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─── DECISION CARD ─── */
function DecisionCard({
  metadata,
}: {
  metadata: PortalMessage['metadata'];
}) {
  if (!metadata.decision) return null;

  if (metadata.decision === 'in-scope') {
    return (
      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">IN SCOPE — Task Added</span>
        </div>
        {metadata.title && (
          <p className="text-xs text-white/50 ml-6">{metadata.title}</p>
        )}
      </div>
    );
  }

  if (metadata.decision === 'out-of-scope') {
    return (
      <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-red-400">OUT OF SCOPE — Change Request</span>
        </div>
        {metadata.title && (
          <p className="text-xs text-white/50 ml-6">{metadata.title}</p>
        )}
        <div className="flex items-center gap-3 ml-6">
          {metadata.cost && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">{metadata.cost}</span>
            </div>
          )}
          {metadata.estimatedHours && (
            <span className="text-xs text-white/30">{metadata.estimatedHours} hrs estimated</span>
          )}
        </div>
        <button className="ml-6 flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors mt-1">
          <ArrowRight className="w-3 h-3" /> Approve Change Request
        </button>
      </div>
    );
  }

  if (metadata.decision === 'needs-info') {
    return (
      <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">NEEDS CLARIFICATION</span>
        </div>
        <p className="text-xs text-white/40 ml-6 mt-1">
          Please provide more details above to continue
        </p>
      </div>
    );
  }

  return null;
}
