'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/header';

export default function WaitlistVerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  
  const [emailVerified, setEmailVerified] = useState(false);
  
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app we'd fetch this from session or server
    const storedEmail = localStorage.getItem('waitlist_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push('/waitlist');
    }
  }, [router]);

  const handleVerifyEmail = async () => {
    if (emailOtp.length < 6) return;
    setVerifyingEmail(true);
    setError('');
    
    try {
      const res = await fetch('/api/waitlist/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: emailOtp })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setEmailVerified(true);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleComplete = async () => {
    if (!emailVerified) return;
    setSubmitting(true);
    router.push('/waitlist/success');
  };

  return (
    <main className="min-h-screen bg-[#060E20] relative overflow-hidden text-white flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Header />

      <div className="flex-1 w-full max-w-2xl mx-auto px-4 pt-32 pb-24 relative z-10 flex flex-col items-center justify-center">
        
        <div className="text-center animate-fade-up mb-12">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Verify Your Email</h1>
          <p className="text-white/60 max-w-md mx-auto">
            To ensure the quality of our early access program, we require all waitlist members to verify their email address.
          </p>
        </div>

        {error && (
          <div className="mb-8 w-full max-w-md p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="w-full max-w-md space-y-6 animate-fade-up delay-100">
          
          {/* Email Verification Card */}
          <div className={`glass-card p-6 rounded-2xl transition-all duration-300 ${emailVerified ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${emailVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/60'}`}>
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Verification</h3>
                  <p className="text-xs text-white/50">{email || 'Loading...'}</p>
                </div>
              </div>
              {emailVerified && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
            </div>

            {!emailVerified ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Input 
                    placeholder="Enter 6-digit code" 
                    value={emailOtp}
                    onChange={e => setEmailOtp(e.target.value.trim())}
                    maxLength={6}
                    className="bg-white/5 border-white/10 text-center tracking-widest text-lg font-mono"
                  />
                  <Button 
                    onClick={handleVerifyEmail} 
                    disabled={emailOtp.length < 6 || verifyingEmail}
                    className="bg-white text-black hover:bg-white/90 px-6"
                  >
                    {verifyingEmail ? '...' : 'Verify'}
                  </Button>
                </div>
                <p className="text-xs text-white/40 text-center mt-1">
                  Don't see it? Make sure to check your spam or promotions folder.
                </p>
              </div>
            ) : (
              <div className="text-sm text-emerald-400/80 font-medium bg-emerald-500/10 px-4 py-2 rounded-lg text-center">
                Email address verified successfully.
              </div>
            )}
          </div>

          <Button 
            onClick={handleComplete}
            disabled={!emailVerified || submitting}
            className={`w-full h-14 rounded-xl font-semibold text-base transition-all duration-500 ${
              emailVerified 
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.4)]' 
                : 'bg-white/5 text-white/30 border border-white/5'
            }`}
          >
            {submitting ? 'Confirming Status...' : 'Join Waitlist'}
            {emailVerified && !submitting && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>

        </div>
      </div>
    </main>
  );
}
