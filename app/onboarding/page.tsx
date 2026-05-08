'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSession, getCurrentUserId } from '@/lib/auth';
import { updateProfile } from '@/lib/database';
import { createProject } from '@/lib/database';
import { ChevronRight, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Agency Details', description: 'Tell us about your agency' },
  { id: 2, title: 'Project Setup', description: 'Create your first project' },
  { id: 3, title: 'Complete', description: 'You\'re all set!' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ agencyName: '', teamSize: '', projectName: '', projectDescription: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session.isAuthenticated) { router.push('/signup'); }
      else { const uid = await getCurrentUserId(); setUserId(uid); }
    };
    checkAuth();
  }, [router]);

  const handleNext = async () => {
    if (step === 1 && userId) {
      await updateProfile(userId, { agency_name: formData.agencyName, team_size: formData.teamSize });
    }
    if (step === 2 && userId && formData.projectName.trim()) {
      await createProject({ user_id: userId, name: formData.projectName, description: formData.projectDescription || '', client_name: '', client_email: '', status: 'active', start_date: new Date().toISOString().split('T')[0], end_date: null, budget: 0, spent: 0, scope_baseline: '' });
    }
    if (step === 3) {
      setIsLoading(true);
      if (userId) { await updateProfile(userId, { onboarding_completed: true }); }
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push('/dashboard');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const isStepValid = () => {
    if (step === 1) return formData.agencyName.trim() && formData.teamSize;
    if (step === 2) return formData.projectName.trim();
    return true;
  };

  const teamSizeOptions = [
    { value: '1-3', label: '1-3 people' },
    { value: '4-10', label: '4-10 people' },
    { value: '11-50', label: '11-50 people' },
    { value: '50+', label: '50+ people' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-[#050A18]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="glass-card-strong rounded-2xl border border-white/[0.06] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="ScopeGuard" width={48} height={48} className="rounded-lg" />
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step > s.id
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20'
                      : step === s.id
                        ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400'
                        : 'bg-white/[0.04] text-white/30 border border-white/[0.06]'
                  }`}>
                    {step > s.id ? <Check size={20} /> : s.id}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${step > s.id ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-white/[0.06]'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">{STEPS[step - 1].title}</h1>
              <p className="text-white/40">{STEPS[step - 1].description}</p>
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Agency Name</label>
                <Input type="text" placeholder="Your Agency Name" value={formData.agencyName} onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })} className="dark-input rounded-xl h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">Team Size</label>
                <div className="grid grid-cols-2 gap-3">
                  {teamSizeOptions.map((option) => (
                    <button key={option.value} onClick={() => setFormData({ ...formData, teamSize: option.value })}
                      className={`p-3 rounded-xl border transition-all text-sm font-medium ${
                        formData.teamSize === option.value
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/10'
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Project Name</label>
                <Input type="text" placeholder="e.g., Website Redesign" value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} className="dark-input rounded-xl h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Project Description (Optional)</label>
                <textarea placeholder="What is this project about?" value={formData.projectDescription} onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                  className="w-full p-3 rounded-xl dark-input min-h-[100px] text-sm" rows={4} />
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <Check className="text-blue-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You&apos;re All Set!</h2>
              <p className="text-white/40 mb-6">Welcome to ScopeGuard. Let&apos;s get to your dashboard and start protecting your margins.</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3 justify-between">
            {step > 1 && (
              <Button onClick={handleBack} variant="outline" className="px-6 h-11 rounded-xl border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
                Back
              </Button>
            )}
            <div className="flex-1"></div>
            <Button onClick={handleNext} disabled={!isStepValid() || isLoading} className="btn-gradient text-white px-6 h-11 rounded-xl border-0 flex items-center gap-2">
              {step === 3 ? (isLoading ? 'Finalizing...' : 'Go to Dashboard') : (<>Next <ChevronRight size={18} /></>)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
