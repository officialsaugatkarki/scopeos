'use client'

import { Check } from 'lucide-react'

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      description: 'Perfect for small agencies tracking 1-3 active projects.',
      features: ['Up to 3 Active Projects', 'Basic AI Analysis', 'Standard Client Portal', 'Email Support'],
      featured: false,
    },
    {
      name: 'Agency Pro',
      price: '$149',
      description: 'For growing agencies that need advanced AI protection.',
      features: ['Up to 15 Active Projects', 'Advanced AI Context', 'Custom Branding', 'Slack Integration', 'Priority Support'],
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Unlimited volume and full organizational control.',
      features: ['Unlimited Projects', 'Custom AI Training', 'SSO & Advanced Security', 'Dedicated Success Manager'],
      featured: false,
    }
  ]

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Stop losing thousands to scope creep. ScopeOS pays for itself with the first change request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-[2rem] relative transition-transform duration-300 ${plan.featured ? 'scale-105 z-10' : 'hover:-translate-y-1'}`}
              style={{
                background: plan.featured ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: plan.featured ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: plan.featured ? '0 24px 80px rgba(59, 130, 246, 0.15)' : '0 20px 40px rgba(0, 0, 0, 0.2)',
              }}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-white/50 text-sm mb-6 min-h-[40px]">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-white/40 text-sm">/mo</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.featured ? 'text-blue-400' : 'text-white/40'}`} />
                    <span className="text-white/80 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  plan.featured 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
