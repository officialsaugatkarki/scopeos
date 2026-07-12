'use client'

import { Mail, Shield, FileText, Sparkles, Zap, BarChart2, ArrowRight, Play } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Mail,
      title: 'AI Market Research',
      description: 'Get comprehensive market insights powered by advanced AI models that analyze trends in real time.',
    },
    {
      icon: Shield,
      title: 'Competitor Analysis',
      description: 'Deep dive into competitor strategies, strengths, and weaknesses to stay ahead of the curve.',
    },
    {
      icon: Zap,
      title: 'Trend Detection',
      description: 'Identify emerging trends before they become tomorrow\'s headlines and capitalize early.',
    },
    {
      icon: FileText,
      title: 'Smart Reports',
      description: 'Beautiful, shareable reports that tell the story behind the data, automatically generated.',
    },
  ]

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 relative z-10"
    >
      <div className="max-w-6xl mx-auto">

        {/* Main Feature Block */}
        <div
          className={`relative rounded-[2rem] overflow-hidden p-8 md:p-14 mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div className="grid md:grid-cols-2 gap-6 md:p-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="text-[11px] font-bold tracking-widest text-blue-400 uppercase mb-5">
                AI-POWERED RESEARCH
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Everything you need to outsmart your competition
              </h2>
              <p className="text-white/60 text-[17px] mb-8 leading-relaxed max-w-md">
                From market analysis to trend predictions, ScopeOS helps you find opportunities faster and make confident decisions.
              </p>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[14px] transition-all border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25"
              >
                Explore Features
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right: Glassy UI Preview */}
            <div className="relative h-[320px] md:h-[380px] w-full rounded-2xl overflow-hidden">
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(59,130,246,0.08) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Mock chart card */}
                <div className="absolute top-6 left-6 p-4 rounded-2xl w-52"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="text-[10px] font-semibold text-white/40 mb-1">Market Potential</div>
                  <div className="text-2xl font-bold text-white flex items-center gap-2">
                    $78.4B <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">+25.6%</span>
                  </div>
                  <svg className="w-full h-10 mt-2" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0,40 C20,30 30,10 50,20 C70,30 80,5 100,0" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Badge top-right */}
                <div className="absolute top-8 right-6 p-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">AI Reports</div>
                    <div className="text-[10px] text-white/40">Instant insights</div>
                  </div>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl hover:scale-105 transition-transform border border-white/20">
                    <Play className="w-6 h-6 text-white ml-1 fill-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              >
                <div
                  className="p-7 h-full rounded-[1.5rem] relative group overflow-hidden cursor-default hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-5 bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2.5 text-[15px] tracking-tight">{feature.title}</h3>
                  <p className="text-white/50 text-[13px] leading-relaxed">{feature.description}</p>
                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
