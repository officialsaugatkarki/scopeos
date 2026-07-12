'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Trophy, Sparkles, Clock, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/header';

interface WaitlistData {
  position: number;
  batch: number;
  referral_code: string;
  referral_count: number;
}

export default function WaitlistSuccessPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<WaitlistData | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from localStorage first (survives refresh)
    const cached = localStorage.getItem('scopeos_waitlist');
    const email = localStorage.getItem('waitlist_email');

    if (!email) {
      // No email at all — redirect to waitlist
      router.push('/waitlist');
      return;
    }

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setData(parsed);
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        setReferralLink(`${appUrl}/waitlist?ref=${parsed.referral_code}`);
        setLoading(false);
        return;
      } catch {}
    }

    // No cache — fetch from API
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/waitlist?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
          setReferralLink(`${appUrl}/waitlist?ref=${json.data.referral_code}`);
          // Cache it for future visits
          localStorage.setItem('scopeos_waitlist', JSON.stringify(json.data));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [router]);

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060E20] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#060E20] relative overflow-hidden text-white flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Header />

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 pt-32 pb-24 relative z-10 flex flex-col items-center justify-center text-center">

        <div className="animate-scale-in mb-8">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3 h-3" />
            Verified &amp; Approved
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            You&apos;re officially on the waitlist.
          </h1>
          <p className="text-white/60 max-w-lg mx-auto text-lg">
            We are onboarding users in controlled batches. Keep an eye on your inbox for your exclusive invitation.
          </p>
        </div>

        {data && (
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-up delay-100">
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Trophy className="w-16 h-16" /></div>
              <p className="text-white/50 text-sm font-medium mb-1">Your Position</p>
              <p className="text-4xl font-bold text-white">#{data.position?.toLocaleString()}</p>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-16 h-16" /></div>
              <p className="text-white/50 text-sm font-medium mb-1">Estimated Batch</p>
              <p className="text-4xl font-bold text-white">Batch {data.batch}</p>
            </div>

            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-16 h-16" /></div>
              <p className="text-white/50 text-sm font-medium mb-1">Referrals</p>
              <p className="text-4xl font-bold text-emerald-400">{data.referral_count}</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-xl mx-auto glass-card p-8 rounded-3xl border border-white/10 animate-fade-up delay-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Move up the waitlist</h2>
          </div>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Invite colleagues and friends using your unique link. For every verified referral, you&apos;ll skip ahead in line.
          </p>

          {referralLink ? (
            <>
              <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/10 rounded-xl mb-3">
                <div className="flex-1 overflow-hidden px-3 text-white/70 text-sm truncate text-left font-mono">
                  {referralLink}
                </div>
                <Button
                  onClick={handleCopy}
                  className={`shrink-0 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>
              <p className="text-xs text-white/40 text-center">
                Bookmark this page or visit <strong className="text-white/60">/waitlist → Check My Status</strong> anytime to see your link.
              </p>
            </>
          ) : (
            <div className="text-white/40 text-sm text-center py-4">
              Loading your referral link...
            </div>
          )}

          <div className="flex items-center justify-between text-sm px-2 mt-6 pt-5 border-t border-white/10">
            <span className="text-white/50">Successful Referrals:</span>
            <span className="font-bold text-blue-400 flex items-center gap-1">
              <Users className="w-4 h-4" /> {data?.referral_count ?? 0} Friends
            </span>
          </div>
        </div>

        <div className="mt-8 animate-fade-up delay-300">
          <Button
            onClick={() => router.push('/waitlist?tab=status')}
            variant="ghost"
            className="text-white/40 hover:text-white text-sm"
          >
            View my status again later <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

      </div>
    </main>
  );
}
