'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

// Helper component for the organic corner fillets
function Fillet({ position, className = '' }: { position: 'tl' | 'tr' | 'bl' | 'br', className?: string }) {
  const paths = {
    tl: "M0 0H40C17.9086 0 0 17.9086 0 40V0Z",
    tr: "M40 0H0C22.0914 0 40 17.9086 40 40V0Z",
    bl: "M0 40H40C17.9086 40 0 22.0914 0 0V40Z",
    br: "M40 40H0C22.0914 40 40 22.0914 40 0V40Z"
  }
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`absolute w-[40px] h-[40px] text-[#FAF8F5] fill-current pointer-events-none ${className}`}
    >
      <path d={paths[position]} />
    </svg>
  )
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col items-center justify-center pt-8 pb-16 px-4 sm:px-8">
      {/* ── Main Floating Container ── */}
      <div 
        className={`relative w-full max-w-[1340px] mx-auto min-h-[85vh] bg-[#FAF8F5] rounded-[40px] p-6 sm:p-8 flex flex-col shadow-[0_32px_96px_rgba(0,0,0,0.06)] border border-black/[0.03] transition-all duration-1000 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* ── Top Navigation inside the container ── */}
        <header className="flex items-center justify-between z-50 mb-6 sm:mb-10 px-2">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <span className="font-[800] text-xl tracking-tight text-[#0B1220] leading-none">
              Scope<span className="text-[#3B82F6]">OS</span>
            </span>
          </Link>

          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full p-1 border border-black/[0.04]">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-xs font-bold text-[#0B1220]/60 hover:text-[#0B1220] hover:bg-white transition-colors duration-300 px-5 py-2 rounded-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Right */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-bold text-[#0B1220]/60 hover:text-[#0B1220] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/waitlist"
              className="text-sm font-bold px-6 py-3 rounded-full bg-[#0B1220] text-white hover:bg-[#0F172A] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 shadow-lg"
            >
              Join Waitlist
            </Link>
          </div>
        </header>

        {/* ── Sculpted Hero Area ── */}
        <div className="relative w-full flex-1 rounded-[32px] overflow-hidden bg-[#e5e5e5] min-h-[600px]">
          
          {/* Base Image / Video */}
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center"
            autoPlay 
            muted 
            loop 
            playsInline
            src="/assets/vid0.mp4"
          />
          {/* Video Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10" />

          {/* ── Top Left Panel (Headline) ── */}
          <div className="absolute top-0 left-0 bg-[#FAF8F5] rounded-br-[40px] pr-8 pb-8 sm:pr-12 sm:pb-12 z-10 max-w-[85%] lg:max-w-[65%]">
            <h1 
              className="font-[800] text-[#0B1220] leading-[1.02] tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}
            >
              Stop Losing Money<br />
              On Scope Creep &amp;<br />
              Unpaid Changes
            </h1>
            
            {/* Organic Fillets */}
            <Fillet position="tl" className="top-0 -right-[40px]" />
            <Fillet position="tl" className="-bottom-[40px] left-0" />
          </div>

          {/* ── Top Right Panel (Stat Cards) ── */}
          <div className="hidden lg:flex absolute top-0 right-0 bg-[#FAF8F5] rounded-bl-[40px] pl-10 pb-10 z-10 gap-5">
            {/* Dark Card */}
            <div className="w-[190px] bg-[#0F172A] text-white p-6 rounded-[28px] shadow-2xl border border-white/5 flex flex-col justify-between h-[220px]">
              <div>
                <div className="text-4xl font-[800] mb-2 tracking-tight">500+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-relaxed max-w-[120px]">
                  Agencies Protected
                </div>
              </div>
              <div className="text-[13px] font-medium text-white/60 leading-relaxed border-t border-white/10 pt-4">
                Helping agencies eliminate scope creep.
              </div>
            </div>

            {/* Light Card */}
            <div className="w-[190px] bg-white text-[#0B1220] p-6 rounded-[28px] shadow-xl border border-black/5 flex flex-col justify-between h-[220px]">
              <div>
                <div className="text-4xl font-[800] mb-2 tracking-tight">20–30%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#0B1220]/40 leading-relaxed max-w-[120px]">
                  Average Margin Recovered
                </div>
              </div>
              <div className="text-[13px] font-medium text-[#0B1220]/60 leading-relaxed border-t border-black/5 pt-4">
                Protecting profits on every single project.
              </div>
            </div>
            
            {/* Organic Fillets */}
            <Fillet position="tr" className="top-0 -left-[40px]" />
            <Fillet position="tr" className="-bottom-[40px] right-0" />
          </div>

          {/* ── Bottom Left Panel (CTA & Text) ── */}
          <div className="absolute bottom-0 left-0 bg-[#FAF8F5] rounded-tr-[40px] pr-8 pt-8 sm:pr-12 sm:pt-10 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
              <p className="text-[#0B1220]/60 text-[15px] sm:text-[17px] font-medium max-w-[260px] leading-relaxed">
                Protect project margins with AI-powered scope enforcement.
              </p>
              <Link
                href="/waitlist"
                className="bg-[#0B1220] text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-[#0F172A] hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap"
              >
                Join Waitlist
              </Link>
            </div>
            
            {/* Organic Fillets */}
            <Fillet position="bl" className="-top-[40px] left-0" />
            <Fillet position="bl" className="bottom-0 -right-[40px]" />
          </div>

          {/* ── Bottom Right Floating Elements (Over Video) ── */}
          <div className="hidden sm:flex absolute bottom-8 right-8 items-end gap-5 z-20">
            {/* Testimonial Bubble */}
            <div className="bg-[#0F172A]/80 backdrop-blur-2xl p-5 rounded-[28px] border border-white/10 flex items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner">
                AF
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex gap-1 mb-1.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="text-[13px] text-white font-medium max-w-[200px] leading-snug">
                  “Saved us from thousands in unpaid changes.”
                </div>
                <div className="text-[11px] text-white/50 mt-1 font-medium tracking-wide">— Agency Founder</div>
              </div>
            </div>

            {/* Bottom Floating Stat */}
            <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[28px] border border-white/40 shadow-2xl min-w-[170px]">
              <div className="text-3xl font-[800] text-[#0B1220] mb-1.5 tracking-tight">$2M+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#0B1220]/40 mb-2">
                Revenue Protected
              </div>
              <div className="text-[12px] font-medium text-[#0B1220]/60 max-w-[140px] leading-relaxed">
                Through AI scope enforcement.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
