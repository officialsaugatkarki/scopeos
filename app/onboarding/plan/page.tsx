'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { initializeUserAccountData } from '@/lib/mock-data';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0/mo',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 projects',
      'AI scope analysis',
      'Basic client portal',
      'Email support',
      'Monthly analytics',
    ],
    cta: 'Select Free Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$0/mo',
    description: 'For growing agencies',
    features: [
      'Unlimited projects',
      'Advanced AI analysis',
      'Team collaboration',
      'Premium integrations',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
    ],
    cta: 'Select Pro (Free Beta)',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$0/mo',
    description: 'For large teams',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Advanced security',
    ],
    cta: 'Select Enterprise (Free Beta)',
  },
];

export default function PlanPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      const auth = await getSession();

      if (auth.user?.id) {
        // 1. Persist plan to DB via the update_user_plan() RPC
        //    This updates both user_subscriptions AND profiles in one call.
        const { data: rpcSuccess, error: rpcError } = await supabase.rpc('update_user_plan', {
          p_user_id:  auth.user.id,
          p_plan_slug: planId,
        });

        // If the RPC failed (e.g. not created yet) OR returned false (e.g. pricing_plans not seeded),
        // we must fallback to updating the profile directly so the UI unlocks the plan.
        if (rpcError || rpcSuccess === false) {
          console.error('RPC failed or returned false. Using fallback update.');
          await supabase
            .from('profiles')
            .update({ current_plan: planId, plan_selected_at: new Date().toISOString() })
            .eq('id', auth.user.id);
        }

        // 2. Update local cache for immediate UI feedback
        initializeUserAccountData({ ...auth.user, plan: planId });
      }

      // 3. Always write to localStorage (used by onboarding gate)
      localStorage.setItem('scopeos_selected_plan', planId);
    } catch (err) {
      console.error('Plan selection error (non-fatal):', err);
      localStorage.setItem('scopeos_selected_plan', planId);
    } finally {
      // Always navigate — auth succeeded before this page was reached
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #0B1224 0%, #0F1A33 30%, #0A1128 60%, #060E20 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-blue-500/[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 flex flex-col px-4 py-8 sm:py-12 relative z-10 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12 sm:mb-16">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Image src="/assets/logo.png" alt="ScopeOS" width={36} height={36} className="rounded-xl shadow-sm" />
            <span className="font-bold text-xl text-white tracking-tight">ScopeOS</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">Choose Your Plan</h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">Select a plan that fits your agency's needs. You can always upgrade later.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-blue-500 scale-105'
                  : 'ring-1 ring-white/10 hover:ring-white/20'
              } ${plan.popular ? 'md:scale-105' : ''}`}
              onClick={() => handleSelectPlan(plan.id)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold py-2 text-center uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className={`p-6 sm:p-8 ${plan.popular ? 'pt-16 sm:pt-24' : ''}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                  </div>
                  <p className="text-blue-400 text-sm font-medium mb-8">No credit card required</p>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.id);
                  }}
                  disabled={isLoading && selectedPlan === plan.id}
                  className={`w-full py-2.5 rounded-xl font-semibold mb-8 transition-all ${
                    selectedPlan === plan.id
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? 'Loading...' : plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-white/50 text-sm">Welcome to ScopeOS Beta! All plans are currently 100% free with no credit card required.</p>
        </div>
      </div>
    </div>
  );
}
