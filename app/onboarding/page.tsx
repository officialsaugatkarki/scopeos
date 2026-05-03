'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
  const [formData, setFormData] = useState({
    agencyName: '',
    teamSize: '',
    projectName: '',
    projectDescription: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session.isAuthenticated) {
        router.push('/signup');
      } else {
        const uid = await getCurrentUserId();
        setUserId(uid);
      }
    };
    checkAuth();
  }, [router]);

  const handleNext = async () => {
    if (step === 1 && userId) {
      // Save agency details to profile
      await updateProfile(userId, {
        agency_name: formData.agencyName,
        team_size: formData.teamSize,
      });
    }

    if (step === 2 && userId && formData.projectName.trim()) {
      // Create first project
      await createProject({
        user_id: userId,
        name: formData.projectName,
        description: formData.projectDescription || '',
        client_name: '',
        client_email: '',
        status: 'active',
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
        budget: 0,
        spent: 0,
        scope_baseline: '',
      });
    }

    if (step === 3) {
      setIsLoading(true);
      if (userId) {
        await updateProfile(userId, {
          onboarding_completed: true,
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push('/dashboard');
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.agencyName.trim() && formData.teamSize;
    }
    if (step === 2) {
      return formData.projectName.trim();
    }
    return true;
  };

  const teamSizeOptions = [
    { value: '1-3', label: '1-3 people' },
    { value: '4-10', label: '4-10 people' },
    { value: '11-50', label: '11-50 people' },
    { value: '50+', label: '50+ people' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl backdrop-blur-sm border-accent/20 shadow-2xl">
        <div className="p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              {STEPS.map((s, idx) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step > s.id
                        ? 'bg-primary text-white'
                        : step === s.id
                          ? 'bg-primary/20 border-2 border-primary text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s.id ? <Check size={20} /> : s.id}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                        step > s.id ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">{STEPS[step - 1].title}</h1>
              <p className="text-muted-foreground">{STEPS[step - 1].description}</p>
            </div>
          </div>

          {/* Step 1: Agency Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Agency Name
                </label>
                <Input
                  type="text"
                  placeholder="Your Agency Name"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Team Size
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {teamSizeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, teamSize: option.value })}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        formData.teamSize === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-foreground hover:border-primary/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Website Redesign"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="h-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Description (Optional)
                </label>
                <textarea
                  placeholder="What is this project about?"
                  value={formData.projectDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, projectDescription: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-primary" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">You&apos;re All Set!</h2>
              <p className="text-muted-foreground mb-6">
                Welcome to ScopeGuard. Let&apos;s get to your dashboard and start protecting your
                margins.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3 justify-between">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="px-6 py-2 h-10"
              >
                Back
              </Button>
            )}
            <div className="flex-1"></div>
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 h-10 flex items-center gap-2"
            >
              {step === 3 ? (
                isLoading ? 'Finalizing...' : 'Go to Dashboard'
              ) : (
                <>
                  Next <ChevronRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
