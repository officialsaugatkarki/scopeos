import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';
import { getResendClient } from '@/lib/resend';
import { generateOtpTemplate } from '@/lib/email';

/**
 * sendOtpEmail
 * Sends an OTP verification email via Resend.
 * Server-side only — never call from client components.
 */
async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // 1. Validate environment (getResendClient() also validates RESEND_API_KEY)
  if (!process.env.EMAIL_FROM) {
    throw new Error('[sendOtpEmail] Missing EMAIL_FROM. Add it to Vercel → Settings → Environment Variables.');
  }
  if (!email || !email.includes('@')) {
    throw new Error('[sendOtpEmail] Invalid recipient email address.');
  }

  // 2. Send via Resend SDK (lazy client — safe at build time)
  const { data, error } = await getResendClient().emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your ScopeOS account',
    html: generateOtpTemplate(otp),
  });

  // 3. Handle Resend API errors
  if (error) {
    console.error('[sendOtpEmail] Resend API error:', JSON.stringify(error));
    throw new Error(`Email delivery failed: ${error.message}`);
  }

  // 4. Dev-only success log — never runs in production
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[sendOtpEmail] ✓ Sent to: ${email} | Message ID: ${data?.id}`);
  }
}

// Helper to generate a 6-digit random code
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function GET(req: NextRequest) {
  const db = getSupabaseAdmin();
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { data, error } = await db
      .from('waitlist_entries')
      .select('position, batch, referral_code, referral_count')
      .eq('email', email.trim())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('Waitlist GET error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Use service role client to bypass RLS
  const db = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { name, email, phone, country, referred_by } = body;

    if (!name || !email || !phone || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOtp = generateOTP();

    // Uniqueness Check using service role to bypass RLS
    const { data: existingUsers } = await db
      .from('waitlist_entries')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone}`);

    if (existingUsers && existingUsers.length > 0) {
      const existing = existingUsers[0];

      // If same user, unverified — resend a fresh OTP
      if (existing.email === email && existing.phone === phone && !existing.email_verified) {
        const { error: updateError } = await db
          .from('waitlist_entries')
          .update({ otp_code: newOtp })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Update OTP error:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }

        await sendOtpEmail(email, newOtp);
        return NextResponse.json({ success: true, data: existing }, { status: 200 });
      }

      if (existing.email_verified) {
        return NextResponse.json({ error: 'You are already on the waitlist!' }, { status: 400 });
      }
      return NextResponse.json({ error: 'This email or phone number is already registered.' }, { status: 400 });
    }

    // Generate a unique 8-character referral code
    const unique_code = crypto.randomBytes(4).toString('hex').toUpperCase();

    // If a referral code was provided, validate it exists
    let validReferredBy: string | null = null;
    if (referred_by) {
      const { data: referrer } = await db
        .from('waitlist_entries')
        .select('referral_code')
        .eq('referral_code', referred_by.trim().toUpperCase())
        .single();
      // Only set if the referral code is valid
      if (referrer) {
        validReferredBy = referrer.referral_code;
      }
    }

    // Insert new entry with the OTP code
    const { data: newEntry, error: insertError } = await db
      .from('waitlist_entries')
      .insert({
        name,
        email,
        phone,
        country,
        referral_code: unique_code,
        otp_code: newOtp,
        ...(validReferredBy ? { referred_by: validReferredBy } : {})
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to join waitlist. ' + insertError.message }, { status: 500 });
    }

    // Send OTP via Resend
    await sendOtpEmail(email, newOtp);

    return NextResponse.json({ success: true, data: newEntry }, { status: 200 });

  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
