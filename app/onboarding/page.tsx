'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSession, getCurrentUserId } from '@/lib/auth';
import { updateProfile } from '@/lib/database';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [agencyName, setAgencyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session.isAuthenticated) {
        router.push('/signup');
        return;
      }
      const uid = await getCurrentUserId();
      setUserId(uid);
      setChecking(false);
    };
    checkAuth();
  }, [router]);

  const handleContinue = async () => {
    if (!userId) return;
    setIsLoading(true);

    await updateProfile(userId, {
      agency_name: agencyName.trim() || 'My Agency',
      onboarding_completed: true,
    });

    router.push('/dashboard');
  };

  if (checking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[#050A18]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="glass-card-strong rounded-2xl border border-white/[0.06] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="ScopeOS" width={48} height={48} className="rounded-lg" />
          </div>

          {/* Welcome */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to ScopeOS</h1>
            <p className="text-white/40">Let&apos;s get you set up in seconds</p>
          </div>

          {/* Agency Name (optional) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Agency / Company Name <span className="text-white/30">(optional)</span>
            </label>
            <Input
              type="text"
              placeholder="Your Agency Name"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="dark-input rounded-xl h-12 text-base"
              autoFocus
            />
          </div>

          {/* What's next info */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-6">
            <p className="text-xs font-medium text-white/50 mb-3">YOU&apos;LL BE ABLE TO</p>
            <div className="space-y-2.5">
              {[
                'Create projects with one click',
                'Auto-generate client portals',
                'Let AI handle scope analysis',
                'Track everything in one dashboard',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                  <span className="text-sm text-white/40">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full btn-gradient text-white border-0 rounded-xl h-12 text-base font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Setting up...'
            ) : (
              <>
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
