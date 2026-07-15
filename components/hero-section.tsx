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
    const t = setTimeout(() => setVisible(true), 50)
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
    <section className="relative w-full h-screen min-h-[800px] flex flex-col overflow-hidden bg-white">
      {/* ── Top Header Area (Seamless with panels) ── */}
      <header className="relative w-full bg-[#FAF8F5] px-6 lg:px-12 py-6 flex items-center justify-between z-30">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="font-[800] text-xl lg:text-2xl tracking-tight text-[#0B1220] leading-none">
            Scope<span className="text-[#3B82F6]">OS</span>
          </span>
        </Link>

        {/* Desktop Nav Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full p-1 border border-black/[0.04]">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-sm font-bold text-[#0B1220]/60 hover:text-[#0B1220] hover:bg-white transition-colors duration-300 px-6 py-2.5 rounded-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Right */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-bold text-[#0B1220]/60 hover:text-[#0B1220] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/waitlist"
            className="text-sm font-bold px-6 py-3 lg:px-7 lg:py-3.5 rounded-full bg-[#0B1220] text-white hover:bg-[#0F172A] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 shadow-md"
          >
            Join Waitlist
          </Link>
        </div>
      </header>

      {/* ── Sculpted Hero Area (Fills remaining height) ── */}
      <div className={`relative w-full flex-1 bg-[#e5e5e5] transition-opacity duration-1000 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Base Image / Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center lg:inset-auto lg:top-1/2 lg:left-1/2 lg:w-[110svh] lg:h-[110svw] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rotate-90 lg:scale-110"
            autoPlay 
            muted 
            loop 
            playsInline
            src="/assets/vid0.mp4"
          />
          {/* Video Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-transparent" />
        </div>

        {/* ── Top Left Panel (Headline) ── */}
        <div className="absolute top-0 left-0 bg-[#FAF8F5] rounded-br-[40px] pr-8 pb-8 lg:pr-16 lg:pb-16 z-10 w-full md:w-auto md:max-w-[80%] lg:max-w-[70%]">
          <h1 
            className="font-[800] text-[#0B1220] leading-[1.05] tracking-tight pl-6 lg:pl-12 text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] text-balance"
          >
            Stop Losing Money<br />
            On Scope Creep &amp;<br />
            Unpaid Changes
          </h1>
          
          {/* Organic Fillets */}
          <Fillet position="tl" className="hidden md:block top-0 -right-[40px]" />
          <Fillet position="tl" className="hidden md:block -bottom-[40px] left-0" />
        </div>

        {/* ── Top Right Panel (Stat Cards) ── */}
        <div className="hidden xl:flex absolute top-0 right-0 bg-[#FAF8F5] rounded-bl-[40px] pl-16 pb-16 pr-12 z-10 gap-6">
          {/* Dark Card */}
          <div className="w-[220px] bg-[#0F172A] text-white p-7 rounded-[28px] shadow-2xl border border-white/5 flex flex-col justify-between h-[240px]">
            <div>
              <div className="text-5xl font-[800] mb-2 tracking-tight">500+</div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-white/50 leading-relaxed max-w-[140px]">
                Agencies Protected
              </div>
            </div>
            <div className="text-[14px] font-medium text-white/60 leading-relaxed border-t border-white/10 pt-4">
              Helping agencies eliminate scope creep.
            </div>
          </div>

          {/* Light Card */}
          <div className="w-[220px] bg-white text-[#0B1220] p-7 rounded-[28px] shadow-xl border border-black/5 flex flex-col justify-between h-[240px]">
            <div>
              <div className="text-5xl font-[800] mb-2 tracking-tight">20–30%</div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-[#0B1220]/40 leading-relaxed max-w-[140px]">
                Average Margin Recovered
              </div>
            </div>
            <div className="text-[14px] font-medium text-[#0B1220]/60 leading-relaxed border-t border-black/5 pt-4">
              Protecting profits on every single project.
            </div>
          </div>
          
          {/* Organic Fillets */}
          <Fillet position="tr" className="top-0 -left-[40px]" />
          <Fillet position="tr" className="-bottom-[40px] right-0" />
        </div>

        {/* ── Bottom Left Panel (CTA & Text) ── */}
        <div className="absolute bottom-0 left-0 bg-[#FAF8F5] rounded-tr-[40px] pr-8 pt-8 lg:pr-16 lg:pt-12 z-10 w-full md:w-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-6 lg:gap-8 pl-6 lg:pl-12 pb-6 lg:pb-12">
            <p className="text-[#0B1220]/60 text-[16px] lg:text-[18px] font-medium max-w-full md:max-w-[300px] leading-relaxed text-balance">
              Protect project margins with AI-powered scope enforcement.
            </p>
            <Link
              href="/waitlist"
              className="bg-[#0B1220] text-white px-8 lg:px-10 py-4 rounded-full text-base font-bold hover:bg-[#0F172A] hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl whitespace-nowrap text-center"
            >
              Join Waitlist
            </Link>
          </div>
          
          {/* Organic Fillets */}
          <Fillet position="bl" className="hidden md:block -top-[40px] left-0" />
          <Fillet position="bl" className="hidden md:block bottom-0 -right-[40px]" />
        </div>

        {/* ── Bottom Right Floating Elements (Over Video) ── */}
        <div className="hidden lg:flex absolute bottom-12 right-12 items-end gap-6 z-20">
          {/* Testimonial Bubble */}
          <div className="bg-[#0F172A]/80 backdrop-blur-2xl p-6 rounded-[32px] border border-white/10 flex items-center gap-5 shadow-2xl">
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-[15px] font-bold shadow-inner">
              AF
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex gap-1 mb-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <div className="text-[15px] text-white font-medium max-w-[240px] leading-snug">
                “Saved us from thousands in unpaid changes.”
              </div>
              <div className="text-[12px] text-white/50 mt-1.5 font-medium tracking-wide">— Agency Founder</div>
            </div>
          </div>

          {/* Bottom Floating Stat */}
          <div className="bg-white/90 backdrop-blur-2xl p-7 rounded-[32px] border border-white/40 shadow-2xl min-w-[200px]">
            <div className="text-4xl font-[800] text-[#0B1220] mb-2 tracking-tight">$2M+</div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#0B1220]/40 mb-2">
              Revenue Protected
            </div>
            <div className="text-[13px] font-medium text-[#0B1220]/60 max-w-[160px] leading-relaxed">
              Through AI scope enforcement.
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
