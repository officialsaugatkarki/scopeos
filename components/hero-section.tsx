'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, FileText, Sparkles } from 'lucide-react'
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
    <section ref={ref} className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Starburst Light Effect */}
      <div className="absolute inset-0 light-burst" />
      
      {/* Radial gradient overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(59,130,246,0.15) 0%, rgba(34,211,238,0.05) 30%, transparent 60%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Text */}
        <div className="text-center mb-12">
          {/* Floating Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/[0.08] text-sm text-white/70 mb-8 animate-float">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Scope protection using AI</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-[1.1] tracking-tight">
            Stop Losing Money
            <br />
            <span className="gradient-text">on Scope Creep</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/50 max-w-3xl mx-auto mb-10 text-balance leading-relaxed">
            AI-powered scope protection for dev agencies. Turn client chaos into clear, billable tasks—automatically.
          </p>
          
          {/* CTA — Email Input Style */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <div className="relative flex-1 w-full">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-full dark-input text-sm"
              />
            </div>
            <Button
              size="lg"
              className="btn-gradient text-white font-semibold px-8 rounded-full border-0 whitespace-nowrap"
            >
              Start Free Trial
            </Button>
          </div>
        </div>

        {/* Dashboard Mockup — Dark Glass */}
        <div className={`mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-2xl overflow-hidden glass-card-strong border border-white/[0.06] glow-border">
            {/* Mockup Header */}
            <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
                  SG
                </div>
                <span className="text-white/60 text-sm font-medium">ScopeGuard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            {/* Mockup Content */}
            <div className="p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Active Requests', value: '42', color: 'from-blue-500/20 to-blue-600/5' },
                  { label: 'In Review', value: '21', color: 'from-cyan-500/20 to-cyan-600/5' },
                  { label: 'Completed', value: '68', color: 'from-emerald-500/20 to-emerald-600/5' },
                ].map((stat) => (
                  <div key={stat.label} className={`rounded-xl bg-gradient-to-br ${stat.color} border border-white/[0.06] p-4`}>
                    <p className="text-white/40 text-xs mb-1">{stat.label}</p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                    <p className="text-blue-400 text-xs mt-1">View detail →</p>
                  </div>
                ))}
              </div>

              {/* Chart & Activity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart Placeholder */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                  <p className="text-white/60 text-sm font-medium mb-4">Tracking History</p>
                  <div className="flex items-end gap-2 h-28">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500/60 to-blue-400/30" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                {/* Activity Placeholder */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
                  <p className="text-white/60 text-sm font-medium mb-4">Recent Activities</p>
                  <div className="space-y-3">
                    {[
                      { text: 'New request from Acme Corp', time: '2 min ago' },
                      { text: 'Scope analysis completed', time: '1 hour ago' },
                      { text: 'Change request approved', time: '3 hours ago' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                        <p className="text-white/50 text-xs">{item.text}</p>
                        <p className="text-white/30 text-xs">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
