'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  const plans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for growing agencies',
      features: [
        '3 active projects',
        '50 requests/month',
        'Email + Portal intake',
        'Basic integrations',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Growth',
      price: '$299',
      period: '/month',
      description: 'Most popular choice',
      features: [
        '10 active projects',
        '200 requests/month',
        'Everything in Starter',
        'Linear/Notion sync',
        'Priority support',
        'Advanced analytics',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Agency',
      price: '$599',
      period: '/month',
      description: 'Enterprise-scale protection',
      features: [
        '25 active projects',
        'Unlimited requests',
        'Everything in Growth',
        'Custom AI training',
        'Dedicated success manager',
        'API access',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <section id="pricing" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto text-balance">
            Choose the plan that works for your agency. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-5">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`rounded-2xl p-8 h-full flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? 'glass-card-strong border-blue-500/30 border glow-border relative md:scale-105'
                    : 'glass-card hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0 px-4 py-1 text-xs font-medium shadow-lg shadow-blue-500/20">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-white/40 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-white/40 ml-2">
                    {plan.period}
                  </span>
                </div>

                {/* CTA */}
                <Button
                  className={`w-full mb-8 rounded-xl h-11 font-medium ${
                    plan.popular
                      ? 'btn-gradient text-white border-0'
                      : 'bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08]'
                  }`}
                  size="lg"
                  onClick={() => {
                    if (plan.cta === 'Contact Sales') {
                      window.location.href = 'mailto:sales@scopeguard.ai?subject=Agency Plan Inquiry';
                    } else {
                      window.location.href = '/signup';
                    }
                  }}
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <div className="space-y-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-white/50 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="text-center mt-12">
          <p className="text-white/40">
            All plans include a <span className="font-semibold text-white/60">14-day free trial</span>. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
