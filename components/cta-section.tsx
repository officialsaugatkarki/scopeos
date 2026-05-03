'use client'

import { Button } from '@/components/ui/button'
import { useRef, useEffect, useState } from 'react'
import { Lock, Zap, Target } from 'lucide-react'

export default function CtaSection() {
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

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          className={`text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Stop the Bleeding. Start Protecting Margins.
        </h2>

        <p
          className={`text-lg text-foreground/70 max-w-2xl mx-auto mb-8 text-balance transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Join 50+ dev agencies that are preventing scope creep and protecting their margins with ScopeGuard AI.
        </p>

        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold mb-8">
            Start Free Trial
          </Button>
        </div>

        {/* Trust Badges */}
        <div className={`flex flex-col sm:flex-row gap-6 justify-center text-sm text-foreground/70 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span>10-minute setup</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
