'use client'

import { Card } from '@/components/ui/card'
import { useRef, useEffect, useState } from 'react'
import { Star } from 'lucide-react'

export default function Testimonials() {
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

  const testimonials = [
    {
      quote: 'We caught $12K in out-of-scope work in the first month. Paid for itself 40x over.',
      author: 'Sarah Chen',
      role: 'Head of Delivery',
      company: 'DevShop Co',
      initials: 'SC',
    },
    {
      quote: 'Finally, a tool that speaks our language. Our clients love the clarity and we love the margins.',
      author: 'Marcus Johnson',
      role: 'Founder',
      company: 'TechFlow Studios',
      initials: 'MJ',
    },
    {
      quote: 'Scope creep was killing us. ScopeGuard AI turned our biggest vulnerability into our biggest strength.',
      author: 'Elena Rodriguez',
      role: 'Operations Manager',
      company: 'BuildLabs',
      initials: 'ER',
    },
  ]

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Loved by Dev Agencies
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-balance">
            See how leading agencies are protecting their margins with ScopeGuard AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Card className="p-8 h-full bg-white hover:shadow-lg transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
