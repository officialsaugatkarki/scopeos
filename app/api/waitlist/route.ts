import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

// Helper function to send email via EmailJS REST API
// Called server-side only — private key is never exposed to the browser
async function sendEmailJSOtp(email: string, otp: string) {
  // Make it bulletproof: check both standard and NEXT_PUBLIC_ variants in case Vercel was misconfigured
  const serviceId   = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId  = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey   = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey  = process.env.EMAILJS_PRIVATE_KEY || process.env.NEXT_PUBLIC_EMAILJS_PRIVATE_KEY;

  // Fail fast with a clear description of which variable is missing
  const missing = [
    !serviceId  && 'EMAILJS_SERVICE_ID',
    !templateId && 'EMAILJS_TEMPLATE_ID',
    !publicKey  && 'EMAILJS_PUBLIC_KEY',
    !privateKey && 'EMAILJS_PRIVATE_KEY',
  ].filter(Boolean);

  if (missing.length > 0) {
    const msg = `EmailJS configuration error: missing environment variable(s): ${missing.join(', ')}. Add them to Vercel → Settings → Environment Variables and redeploy.`;
    console.error('[EmailJS]', msg);
    throw new Error(msg);
  }

  const payload = {
    service_id:  serviceId,
    template_id: templateId,
    user_id:     publicKey,      // EmailJS Public Key
    accessToken: privateKey,     // EmailJS Private Key — required for Strict Mode, stays on server
    template_params: {
      to_email: email,
      email:    email,
      code:     otp,
      otp:      otp,
      otp_code: otp,
      message:  otp
    }
  };

  console.log('[EmailJS] Sending OTP to:', email, '| Service:', serviceId, '| Template:', templateId);

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[EmailJS] REST API error response:', text);
    throw new Error(`EmailJS failed (HTTP ${res.status}): ${text}`);
  }

  console.log('[EmailJS] OTP sent successfully to:', email);
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

        await sendEmailJSOtp(email, newOtp);
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

    // Send OTP via EmailJS
    await sendEmailJSOtp(email, newOtp);

    return NextResponse.json({ success: true, data: newEntry }, { status: 200 });

  } catch (error: any) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
