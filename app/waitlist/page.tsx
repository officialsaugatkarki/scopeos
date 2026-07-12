'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CheckCircle2, Users, Activity, Sparkles, AlertCircle, Search, Trophy, Clock, Copy, Gift } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';
import Header from '@/components/header';

function WaitlistPageInner() {

type Tab = 'apply' | 'status';

interface StatusData {
  position: number;
  batch: number;
  referral_code: string;
  referral_count: number;
}

  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>('apply');

  // Apply form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: 'US',
    phoneNumber: '',
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Status check state
  const [statusEmail, setStatusEmail] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [statusError, setStatusError] = useState('');
  const [statusCopied, setStatusCopied] = useState(false);

  // On mount: read ?ref= from URL and load cached status data
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }

    const saved = localStorage.getItem('scopeos_waitlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStatusData(parsed);
      } catch {}
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.phoneNumber) newErrors.phone = 'Required';
    if (!formData.country) newErrors.country = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const selectedCountry = COUNTRIES.find(c => c.code === formData.phoneCode);
      const phonePrefix = selectedCountry ? selectedCountry.dial_code : '+1';

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: `${phonePrefix} ${formData.phoneNumber}`,
        country: formData.country,
        ...(referralCode.trim() ? { referred_by: referralCode.trim().toUpperCase() } : {})
      };

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        // Persist email in localStorage so verify + success pages survive refresh
        localStorage.setItem('waitlist_email', formData.email);
        router.push('/waitlist/verify');
      } else {
        setErrors({ submit: data.error || 'Failed to apply' });
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!statusEmail.trim()) {
      setStatusError('Please enter your email');
      return;
    }
    setStatusLoading(true);
    setStatusError('');
    setStatusData(null);

    try {
      const res = await fetch(`/api/waitlist?email=${encodeURIComponent(statusEmail.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setStatusError(json.error || 'No entry found for this email');
      } else {
        setStatusData(json.data);
        // Cache it locally
        localStorage.setItem('scopeos_waitlist', JSON.stringify(json.data));
        localStorage.setItem('waitlist_email', statusEmail.trim());
      }
    } catch {
      setStatusError('Network error. Please try again.');
    } finally {
      setStatusLoading(false);
    }
  };

  const referralLink = typeof window !== 'undefined' && statusData
    ? `${window.location.origin}/waitlist?ref=${statusData.referral_code}`
    : '';

  const handleCopyStatus = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setStatusCopied(true);
    setTimeout(() => setStatusCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#060E20] relative overflow-hidden text-white flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Header />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24 relative z-10 flex flex-col lg:flex-row items-start gap-16 xl:gap-24">

        {/* Left Column */}
        <div className="flex-1 w-full">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Early Access Program
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Join the ScopeOS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Waitlist</span>
            </h1>

            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
              We&apos;re onboarding development agencies and freelancers in carefully selected batches to build the future of AI-powered project operations.
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl mb-6 w-fit animate-fade-up delay-100">
            <button
              onClick={() => setTab('apply')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'apply' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              Apply for Access
            </button>
            <button
              onClick={() => setTab('status')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'status' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
            >
              Check My Status
            </button>
          </div>

          {/* Apply Form */}
          {tab === 'apply' && (
            <div className="glass-card rounded-[2rem] p-6 md:p-10 animate-fade-up delay-200">
              {errors.submit && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Full Name</label>
                    <Input
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500"
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Email</label>
                    <Input
                      type="email"
                      placeholder="jane@acmestudio.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500"
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Phone Number</label>
                    <div className="flex gap-2">
                      <Select value={formData.phoneCode} onValueChange={v => setFormData({ ...formData, phoneCode: v })}>
                        <SelectTrigger className="w-[120px] h-12 bg-white/5 border-white/10 text-white rounded-xl shrink-0">
                          <SelectValue placeholder="Code" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(c => (
                            <SelectItem key={`phone-${c.code}`} value={c.code}>
                              {c.code} {c.dial_code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={formData.phoneNumber}
                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500 w-full"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80">Country</label>
                    <Select value={formData.country} onValueChange={v => setFormData({ ...formData, country: v })}>
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl w-full">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => (
                          <SelectItem key={`country-${c.name}`} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  {errors.country && <p className="text-xs text-red-400">{errors.country}</p>}
                  </div>

                  {/* Referral Code - auto-filled from URL, editable */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                      <Gift className="w-3.5 h-3.5 text-blue-400" />
                      Referral Code
                      <span className="text-white/30 text-xs font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. A1B2C3D4"
                        value={referralCode}
                        onChange={e => setReferralCode(e.target.value.toUpperCase())}
                        className={`h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500 font-mono tracking-widest pr-10 ${
                          referralCode ? 'border-blue-500/40 bg-blue-500/5' : ''
                        }`}
                      />
                      {referralCode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Gift className="w-4 h-4 text-blue-400" />
                        </div>
                      )}
                    </div>
                    {referralCode && (
                      <p className="text-xs text-blue-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Referral code applied — you&apos;ll start with a better position!
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl bg-white text-black hover:bg-white/90 font-semibold text-base mt-4 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Apply for Early Access'}
                  {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </div>
          )}

          {/* Status Check */}
          {tab === 'status' && (
            <div className="glass-card rounded-[2rem] p-6 md:p-10 animate-fade-up delay-200 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Check Your Waitlist Status</h2>
                <p className="text-white/50 text-sm">Enter the email you applied with to see your position and referral link.</p>
              </div>

              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="jane@acmestudio.com"
                  value={statusEmail}
                  onChange={e => setStatusEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCheckStatus()}
                  className="h-12 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500"
                />
                <Button
                  onClick={handleCheckStatus}
                  disabled={statusLoading}
                  className="h-12 px-6 bg-white text-black hover:bg-white/90 rounded-xl font-semibold shrink-0"
                >
                  {statusLoading ? '...' : <><Search className="w-4 h-4 mr-2" /> Check</>}
                </Button>
              </div>

              {statusError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {statusError}
                </div>
              )}

              {statusData && (
                <div className="space-y-5 animate-fade-up">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10"><Trophy className="w-10 h-10" /></div>
                      <p className="text-white/50 text-xs font-medium mb-1">Position</p>
                      <p className="text-2xl font-bold text-white">#{statusData.position?.toLocaleString()}</p>
                    </div>
                    <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10"><Clock className="w-10 h-10" /></div>
                      <p className="text-white/50 text-xs font-medium mb-1">Batch</p>
                      <p className="text-2xl font-bold text-white">Batch {statusData.batch}</p>
                    </div>
                    <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10"><Users className="w-10 h-10" /></div>
                      <p className="text-white/50 text-xs font-medium mb-1">Referrals</p>
                      <p className="text-2xl font-bold text-emerald-400">{statusData.referral_count}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white/70 mb-2">Your Referral Link</p>
                    <div className="flex items-center gap-2 p-2 bg-black/40 border border-white/10 rounded-xl">
                      <div className="flex-1 overflow-hidden px-3 text-white/70 text-sm truncate font-mono">
                        {referralLink}
                      </div>
                      <Button
                        onClick={handleCopyStatus}
                        className={`shrink-0 h-9 ${statusCopied ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-white text-black hover:bg-white/90'}`}
                      >
                        {statusCopied ? <><CheckCircle2 className="w-4 h-4 mr-1" /> Copied</> : <><Copy className="w-4 h-4 mr-1" /> Copy</>}
                      </Button>
                    </div>
                    <p className="text-xs text-white/40 mt-2">Share this link — for every verified referral you move up the list.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full lg:sticky lg:top-32 animate-fade-up delay-300">
          <div className="relative w-full aspect-square max-w-[500px] mx-auto lg:mx-0">
            <div className="absolute inset-0 animate-float">
              <Image
                src="/assets/data.svg"
                alt="ScopeOS Ecosystem"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]"
              />
            </div>
            <div className="absolute top-[10%] -left-8 md:-left-12 glass-card p-4 rounded-2xl flex items-center gap-4 animate-float-gentle delay-100 shadow-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">35+</p>
                <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Active Beta Users</p>
              </div>
            </div>
            <div className="absolute bottom-[5%] -right-12 md:-right-20 glass-card p-4 rounded-2xl flex items-center gap-4 animate-float-gentle delay-300 shadow-xl border border-white/10">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">100+</p>
                <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Verified Waitlist</p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">AI-Powered</h4>
              <p className="text-sm text-white/50 leading-relaxed">Automated scope analysis and decision making.</p>
            </div>
            <div className="space-y-2">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">Agency Built</h4>
              <p className="text-sm text-white/50 leading-relaxed">Designed from real agency feedback and workflows.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#060E20] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WaitlistPageInner />
    </Suspense>
  );
}
