'use client'

import { Star } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Scope creep was killing us. ScopeOS AI turned our biggest vulnerability into our biggest competitive strength.",
      author: 'Sarah Jenkins',
      role: 'CEO, PixelForge Agency',
      stats: 'Recovered $40k/mo',
      color: 'blue'
    },
    {
      quote: "We caught $12K in out-of-scope work in the first month. ScopeOS paid for itself 40x over.",
      author: 'David Chen',
      role: 'Operations Director, DevStudio',
      stats: '15% margin increase',
      color: 'emerald'
    },
    {
      quote: "Clients actually prefer the AI portal. It removes the emotion from scope conversations. It's just facts.",
      author: 'Elena Rodriguez',
      role: 'Head of Delivery, Nova Web',
      stats: '98% client retention',
      color: 'indigo'
    }
  ]

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Loved by the best agencies
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            See how leading development agencies are protecting their margins with ScopeOS.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-[2rem] flex flex-col h-full relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className={`w-4 h-4 fill-${t.color}-400 text-${t.color}-400 opacity-90`} />
                ))}
              </div>
              
              <blockquote className="text-[15px] leading-relaxed text-white/90 mb-8 flex-1">
                "{t.quote}"
              </blockquote>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <div className="font-bold text-white text-[13px]">{t.author}</div>
                  <div className="text-white/50 text-[11px]">{t.role}</div>
                </div>
                <div className={`text-[11px] font-bold text-${t.color}-400 bg-${t.color}-500/10 px-2 py-1 rounded-md border border-${t.color}-500/20`}>
                  {t.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
