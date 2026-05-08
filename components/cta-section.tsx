'use client'

import { Button } from '@/components/ui/button'
import { Lock, Zap, Target } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full bg-blue-500/[0.06] blur-[100px]" />
      </div>
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Stop the Bleeding.
          <br />
          <span className="gradient-text-blue">Start Protecting Margins.</span>
        </h2>
        <p className="text-lg text-white/40 max-w-2xl mx-auto mb-10">
          Join 50+ dev agencies preventing scope creep and protecting their margins with ScopeGuard AI.
        </p>
        <Button size="lg" className="btn-gradient text-white font-semibold mb-10 px-10 rounded-full border-0 h-12 text-base">
          Start Free Trial
        </Button>
        <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm text-white/40">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-blue-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>10-minute setup</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-blue-400" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
