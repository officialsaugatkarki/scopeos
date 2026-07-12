import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  // Use service role client to bypass RLS
  const db = getSupabaseAdmin();

  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    const trimmedCode = code.trim();

    // Fetch user with admin client to bypass RLS
    const { data: user, error: fetchError } = await db
      .from('waitlist_entries')
      .select('*')
      .eq('email', email.trim())
      .single();

    if (fetchError || !user) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: 'No waitlist entry found for this email' }, { status: 404 });
    }

    if (user.email_verified) {
      return NextResponse.json({ error: 'Email is already verified' }, { status: 400 });
    }

    // Debug log (visible in your dev server terminal)
    console.log(`[Verify] DB otp_code: "${user.otp_code}" | Entered: "${trimmedCode}"`);

    if (!user.otp_code) {
      return NextResponse.json({
        error: 'No verification code found. Please go back and apply again to get a new code.'
      }, { status: 400 });
    }

    if (user.otp_code !== trimmedCode) {
      return NextResponse.json({ error: 'Invalid verification code. Please double-check and try again.' }, { status: 400 });
    }

    // Mark as verified and clear the OTP code
    const { data: updatedEntry, error: updateError } = await db
      .from('waitlist_entries')
      .update({
        email_verified: true,
        otp_code: null
      })
      .eq('email', email.trim())
      .select()
      .single();

    if (updateError || !updatedEntry) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to verify. Please try again.' }, { status: 500 });
    }

    // Increment referrer's count if applicable
    if (updatedEntry.referred_by) {
      const { data: referrer } = await db
        .from('waitlist_entries')
        .select('id, referral_count')
        .eq('referral_code', updatedEntry.referred_by)
        .single();

      if (referrer) {
        await db
          .from('waitlist_entries')
          .update({ referral_count: referrer.referral_count + 1 })
          .eq('id', referrer.id);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Waitlist Verify API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
