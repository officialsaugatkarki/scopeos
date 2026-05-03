'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, FileText } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function HeroSection() {
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
    <section ref={ref} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Stop Losing Money on Scope Creep
          </h1>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto mb-8 text-balance leading-relaxed">
            AI-powered scope protection for dev agencies. Turn client chaos into clear, billable tasks—automatically.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/5"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className={`mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-border/20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Client Request Analysis</h3>
                  <p className="text-sm text-foreground/60">AI Scope Guardian</p>
                </div>
                <div className="text-sm font-medium text-accent">Real-time Analysis</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Request */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-foreground mb-4">📨 Client Request</div>
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-foreground mb-3">
                    "Can you add a new dashboard page that shows analytics, integrates with our CRM, and generates weekly reports automatically?"
                  </p>
                  <div className="text-xs text-foreground/60 flex items-center gap-2">
                    <span className="w-2 h-2 bg-foreground/30 rounded-full"></span>
                    Sarah Chen • DevShop Co.
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="space-y-4">
                <div className="text-sm font-semibold text-foreground mb-4">🤖 AI Analysis</div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Out of Scope</p>
                      <p className="text-xs text-destructive/80 mt-1">CRM integration & auto-reports</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-700">In Scope</p>
                      <p className="text-xs text-green-600 mt-1">Analytics dashboard page</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Request Preview */}
              <div className="md:col-span-2 space-y-4">
                <div className="text-sm font-semibold text-foreground mb-4">📄 Auto-Generated Change Request</div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-primary text-sm">Scope Expansion: CRM Integration & Reporting</p>
                      <p className="text-xs text-foreground/60 mt-1">Additional 40 hours • $6,000 one-time</p>
                    </div>
                    <FileText className="w-5 h-5 text-primary/60 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-foreground/70 line-clamp-2">
                    CRM integration and automated weekly reporting require additional development effort outside the original scope...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
