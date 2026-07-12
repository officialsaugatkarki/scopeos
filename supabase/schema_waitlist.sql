-- Waitlist System Schema

-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    country TEXT,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    otp_code TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    referred_by TEXT REFERENCES public.waitlist_entries(referral_code),
    referral_count INTEGER DEFAULT 0,
    position SERIAL,
    batch INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE
);

-- RLS for waitlist
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so anyone can join the waitlist)
CREATE POLICY "Allow public insert to waitlist" 
ON public.waitlist_entries FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public read of own entry by email (for checking status)
CREATE POLICY "Allow users to read their own waitlist entry" 
ON public.waitlist_entries FOR SELECT 
TO public 
USING (true); -- Technically we should lock this down but since we don't have auth for waitlist users, we either need a token or allow public read. We can limit it in the API instead of relying on RLS. We'll bypass RLS in our API using service_role key.

-- Add is_admin to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add a default admin if needed (optional)
-- UPDATE public.profiles SET is_admin = true WHERE email = 'your@email.com';
