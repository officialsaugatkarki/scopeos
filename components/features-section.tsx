'use client'

import { Card } from '@/components/ui/card'
import { Mail, Shield, FileText, Sparkles } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function FeaturesSection() {
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

  const features = [
    {
      icon: Mail,
      title: 'Smart Intake',
      description: 'Clients submit requests via email or portal. AI asks clarifying questions automatically.',
    },
    {
      icon: Shield,
      title: 'Scope Guardian',
      description: 'Compares every request against your baseline. Flags in-scope vs out-of-scope instantly.',
    },
    {
      icon: FileText,
      title: 'Auto Documentation',
      description: 'Generates change requests and status updates. Your PM just reviews and sends.',
    },
  ]

  return (
    <section id="features" ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/[0.08] text-sm text-white/60 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Key Features</span>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance tracking-tight">
            Do less planning.
            <br />
            Get more done.
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto text-balance">
            Everything you need to protect your scope and maximize profitability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="glass-card rounded-2xl p-8 h-full hover:border-blue-500/20 transition-all duration-300 glow-border-hover group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:glow-blue-sm transition-all">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
