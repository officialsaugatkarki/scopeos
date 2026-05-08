'use client'

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
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-balance tracking-tight">
            Loved by Dev Agencies
          </h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto text-balance">
            See how leading agencies are protecting their margins with ScopeGuard AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="glass-card rounded-2xl p-8 h-full hover:border-white/10 transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white/70 mb-6 leading-relaxed text-sm">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center text-sm font-semibold text-blue-400">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-white/40">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
