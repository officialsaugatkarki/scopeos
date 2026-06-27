'use client'

import { useEffect, useState } from 'react'
import { Command } from 'lucide-react'

export default function HeroSection() {
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
  <section className="relative w-full h-[100svh] min-h-[850px] flex flex-col items-center justify-center overflow-hidden">
    {/* ── Background Video ── */}
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
          object-center

          lg:inset-auto
          lg:top-1/2
          lg:left-1/2
          lg:w-[110svh]
          lg:h-[110svw]
          lg:-translate-x-1/2
          lg:-translate-y-1/2
          lg:-rotate-90
        "
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/assets/vid0.mp4" type="video/mp4" />
      </video>
    </div>

      {/* ── Subtle Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* ── Hero Content ── */}
      <div className="relative z-10 w-full h-full max-w-5xl mx-auto px-6">
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center px-6">
          {/* Main heading — Handwritten Font */}
          <h1
            className={`text-white leading-[1.15] tracking-wide max-w-4xl mx-auto mb-6 text-balance transition-all duration-1000 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{
              fontFamily: 'var(--font-caveat), cursive',
              fontSize: 'clamp(2.8rem, 5vw, 4.4rem)',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
              fontWeight: 400,
            }}
          >
            Life is beautiful,<br className="hidden sm:block" />
                Don’t waste it on unpaid changes.
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-12 text-center px-6">
          {/* Subheading */}
          <p
            className={`text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-balance transition-all duration-1000 delay-200 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              color: 'rgba(255, 255, 255, 0.95)',
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.4)',
              fontWeight: 400,
            }}
          >
            The AI decision layer that protects
            <br className="hidden sm:block" />
            every client request before development begins.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            } mb-12`}
          >
            <a
              href="/signup"
              className="bg-white text-black px-8 py-3.5 rounded-full font-medium text-[15px] transition-all hover:bg-gray-100 hover:shadow-lg w-full sm:w-auto"
            >
              Start Free Trial
            </a>
            <a
              href="mailto:demo@scopeos.ai"
              className="flex items-center justify-center gap-2 bg-black/40 backdrop-blur-md text-white px-8 py-3.5 rounded-full font-medium text-[15px] border border-white/20 transition-all hover:bg-black/60 w-full sm:w-auto"
            >
              Book a Demo
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </a>
          </div>
        </div>
        
      </div>
    </section>
  )
}
