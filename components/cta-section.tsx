'use client'

import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div
          className="rounded-[2.5rem] p-6 md:p-12 md:p-20 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(59,130,246,0.1) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          }}
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight relative z-10 leading-[1.1]">
            Ready to stop working<br className="hidden md:block" /> for free?
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto relative z-10">
            Join 50+ dev agencies using ScopeOS to prevent scope creep, protect revenue, and build client trust.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="/signup"
              className="bg-white text-black px-8 py-4 rounded-full font-bold text-[15px] transition-all hover:bg-gray-100 hover:shadow-xl w-full sm:w-auto"
            >
              Start Your Free Trial
            </a>
            <a
              href="mailto:demo@scopeos.ai"
              className="flex items-center justify-center gap-2 bg-black/40 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-[15px] border border-white/20 transition-all hover:bg-black/60 w-full sm:w-auto"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
