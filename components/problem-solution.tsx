'use client'

import { AlertCircle, Zap, ShieldCheck } from 'lucide-react'

export default function ProblemSolution() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 md:p-12 lg:gap-20 items-center">
          
          {/* The Problem */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercase">
              <AlertCircle className="w-3.5 h-3.5" />
              The Problem
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-[1.2]">
              Agencies lose 20% of their margin to unbilled scope creep.
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              When clients ask for "one small change" over email or Slack, it rarely gets billed. It damages your margin, delays the project, and frustrates your team.
            </p>
          </div>

          {/* The Solution */}
          <div 
            className="p-8 md:p-10 rounded-[2rem] relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(59,130,246,0.08) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <ShieldCheck className="w-32 h-32 text-blue-400" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-6">
                <Zap className="w-3.5 h-3.5" />
                The Solution
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Automate scope protection with AI.
              </h3>
              <p className="text-white/70 leading-relaxed mb-8">
                ScopeOS sits between you and your clients. It automatically analyzes incoming requests against the original contract, flags out-of-scope work, and drafts change orders instantly.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white/80 font-medium text-sm">Protect your profit margins</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white/80 font-medium text-sm">Remove emotion from client pushback</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                    <CheckIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-white/80 font-medium text-sm">Turn unbilled requests into revenue</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
