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
    <section id="pricing" className="py-24 relative bg-[#F5F3EE]">
      <div className="max-w-[1760px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0C1425] mb-6 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-[rgba(12,20,37,0.5)] text-lg max-w-2xl mx-auto leading-relaxed">
            Stop losing thousands to scope creep. ScopeOS pays for itself with the first change request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-[1760px] mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-[2rem] relative transition-all duration-300 bg-white border border-[rgba(12,20,37,0.06)] shadow-[0_1px_3px_rgba(12,20,37,0.04)] ${
                plan.featured 
                  ? 'scale-105 z-10 ring-2 ring-[#3B82F6] shadow-[0_8px_32px_rgba(59,130,246,0.12)]' 
                  : 'hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(12,20,37,0.06)]'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold text-[#0C1425] mb-2">{plan.name}</h3>
              <p className="text-[rgba(12,20,37,0.5)] text-sm mb-6 min-h-[40px]">{plan.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-[#0C1425]">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-[rgba(12,20,37,0.3)] text-sm">/mo</span>}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.featured ? 'text-[#3B82F6]' : 'text-[rgba(12,20,37,0.2)]'}`} />
                    <span className="text-[rgba(12,20,37,0.7)] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  plan.featured 
                    ? 'bg-[#3B82F6] text-white hover:bg-[#60A5FA] shadow-[0_4px_12px_rgba(59,130,246,0.2)]' 
                    : 'bg-[#0C1425] text-[#F5F3EE] hover:bg-[#182844]'
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
