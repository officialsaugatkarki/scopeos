'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
    <section id="pricing" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Choose the plan that works for your agency. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card
                className={`p-8 h-full flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-accent shadow-lg scale-100 md:scale-105'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <Badge className="w-fit mb-4 bg-accent text-accent-foreground">
                    Most Popular
                  </Badge>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-foreground/70 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-foreground/60 ml-2">
                    {plan.period}
                  </span>
                </div>

                {/* CTA */}
                <Button
                  className="w-full mb-8"
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <div className="space-y-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="text-center mt-12">
          <p className="text-foreground/70">
            All plans include a <span className="font-semibold">14-day free trial</span>. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
