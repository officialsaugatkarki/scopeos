'use client'

import { Card } from '@/components/ui/card'
import { Mail, Shield, FileText } from 'lucide-react'
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
    <section id="features" ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Powerful Features Built for Your Agency
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            Everything you need to protect your scope and maximize profitability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <Card className="p-8 h-full hover:shadow-lg hover:border-accent/30 transition-all duration-300 bg-white">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
