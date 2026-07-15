'use client'

import { Star, ChevronRight, TrendingUp, Shield, MessageSquare, GitBranch } from 'lucide-react'

export default function Testimonials() {
  return (
    <section className="py-28 px-6 relative z-10 bg-[#0C1425]">
      {/* Subtle electric blue radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1760px] mx-auto relative z-10">
        
        {/* Large Testimonial Quote */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-1.5 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-[#3B82F6] text-[#3B82F6]" />
            ))}
          </div>
          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F3EE] tracking-tight leading-[1.15] mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            &ldquo;We recovered $47K in the first month from scope creep we used to eat.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center text-[#3B82F6] text-sm font-bold">
              MC
            </div>
            <div className="text-left">
              <p className="text-[rgba(245,243,238,0.8)] text-sm font-semibold">Marcus Chen</p>
              <p className="text-[rgba(245,243,238,0.35)] text-xs">CTO at Pixel &amp; Frame Agency</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-[rgba(245,243,238,0.03)] border border-[rgba(245,243,238,0.06)] rounded-2xl p-8 md:p-10 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#6FCF76] relative">
                <div className="absolute inset-0 bg-[#6FCF76] rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-[rgba(245,243,238,0.4)] text-xs font-semibold tracking-widest uppercase">Live Metrics</span>
            </div>
            <span className="text-[rgba(245,243,238,0.25)] text-xs font-semibold tracking-widest uppercase">This Month</span>
          </div>

          {/* Number */}
          <div className="flex items-end gap-3 mb-10">
            <span className="text-5xl md:text-6xl font-bold text-[#3B82F6]">$2.4M</span>
            <span className="text-[rgba(245,243,238,0.4)] text-sm pb-2 leading-snug">revenue protected<br />across all agencies</span>
          </div>

          {/* Stats List */}
          <div className="space-y-4">
            {[
              { label: 'Scope Changes Detected', value: '12,847', width: '100%', icon: Shield },
              { label: 'Clarifying Questions Sent', value: '8,231', width: '64%', icon: MessageSquare },
              { label: 'Change Requests Generated', value: '6,104', width: '48%', icon: GitBranch },
              { label: 'Projects on Track', value: '89%', width: '89%', icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <stat.icon className="w-4 h-4 text-[rgba(245,243,238,0.2)] shrink-0" />
                <span className="text-[rgba(245,243,238,0.6)] text-sm w-48 shrink-0">{stat.label}</span>
                <div className="flex-1 h-2 bg-[rgba(245,243,238,0.06)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full transition-all duration-1000 ease-out" style={{ width: stat.width }} />
                </div>
                <span className="text-[rgba(245,243,238,0.5)] text-xs w-20 text-right font-mono">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[rgba(245,243,238,0.06)]">
            <a href="#" className="text-[rgba(245,243,238,0.3)] text-xs hover:text-[#3B82F6] transition-colors flex items-center gap-1.5 group">
              View all agencies <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
