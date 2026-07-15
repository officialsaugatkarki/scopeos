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
    <section className="relative w-full h-screen min-h-[700px] flex flex-col overflow-hidden bg-[#FAF8F5]">
      {/* ── Top Header Area (Seamless with panels) ── */}
      <header className="relative w-full bg-[#FAF8F5] px-6 lg:px-10 py-5 flex items-center justify-between z-30">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className="font-semibold text-lg lg:text-xl tracking-tight text-[#0B1220] leading-none">
            Scope<span className="text-[#3B82F6]">OS</span>
          </span>
        </Link>

        {/* Desktop Nav Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full p-1 border border-black/[0.04]">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-xs font-medium text-[#0B1220]/60 hover:text-[#0B1220] hover:bg-white transition-colors duration-300 px-5 py-2 rounded-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Right */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-[#0B1220]/60 hover:text-[#0B1220] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/waitlist"
            className="text-sm font-medium px-5 py-2.5 rounded-full bg-[#0B1220] text-white hover:bg-[#0F172A] hover:scale-[1.02] hover:shadow-xl transition-all duration-300 shadow-sm"
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
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent" />
        </div>

        {/* ── Top Left Panel (Headline) ── */}
        <div className="absolute top-0 left-0 bg-[#FAF8F5] rounded-br-[40px] pr-6 pb-6 lg:pr-10 lg:pb-10 z-10 w-full md:w-auto md:max-w-[75%] lg:max-w-[60%]">
          <h1 
            className="font-semibold text-[#0B1220] leading-[1.08] tracking-tight pl-6 lg:pl-10 text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem] xl:text-[5rem] text-balance"
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
        <div className="hidden xl:flex absolute top-0 right-0 bg-[#FAF8F5] rounded-bl-[40px] pl-10 pb-10 pr-10 z-10 gap-4">
          {/* Dark Card */}
          <div className="w-[170px] bg-[#0F172A] text-white p-5 rounded-[24px] shadow-xl border border-white/5 flex flex-col justify-between h-[190px]">
            <div>
              <div className="text-3xl font-semibold mb-2 tracking-tight">500+</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/50 leading-relaxed">
                Agencies<br/>Protected
              </div>
            </div>
            <div className="text-[12px] font-normal text-white/60 leading-relaxed border-t border-white/10 pt-3">
              Helping agencies eliminate scope creep.
            </div>
          </div>

          {/* Light Card */}
          <div className="w-[170px] bg-white text-[#0B1220] p-5 rounded-[24px] shadow-lg border border-black/5 flex flex-col justify-between h-[190px]">
            <div>
              <div className="text-3xl font-semibold mb-2 tracking-tight">20–30%</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-[#0B1220]/40 leading-relaxed">
                Margin<br/>Recovered
              </div>
            </div>
            <div className="text-[12px] font-normal text-[#0B1220]/60 leading-relaxed border-t border-black/5 pt-3">
              Protecting profits on every single project.
            </div>
          </div>
          
          {/* Organic Fillets */}
          <Fillet position="tr" className="top-0 -left-[40px]" />
          <Fillet position="tr" className="-bottom-[40px] right-0" />
        </div>

        {/* ── Bottom Left Panel (CTA & Text) ── */}
        <div className="absolute bottom-0 left-0 bg-[#FAF8F5] rounded-tr-[40px] pr-6 pt-6 lg:pr-10 lg:pt-8 z-10 w-full md:w-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-5 lg:gap-6 pl-6 lg:pl-10 pb-6 lg:pb-10">
            <p className="font-mono text-[#0B1220]/60 text-[11px] lg:text-[13px] max-w-[250px] leading-relaxed text-balance uppercase tracking-wide">
              Protect project margins with AI-powered scope enforcement.
            </p>
            <Link
              href="/waitlist"
              className="bg-[#0B1220] text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-[#0F172A] hover:scale-[1.02] transition-all duration-300 shadow-md whitespace-nowrap text-center"
            >
              Join Waitlist
            </Link>
          </div>
          
          {/* Organic Fillets */}
          <Fillet position="bl" className="hidden md:block -top-[40px] left-0" />
          <Fillet position="bl" className="hidden md:block bottom-0 -right-[40px]" />
        </div>

        {/* ── Bottom Right Floating Elements (Over Video) ── */}
        <div className="hidden lg:flex absolute bottom-10 right-10 items-end gap-4 z-20">
          {/* Testimonial Bubble */}
          <div className="bg-[#0F172A]/80 backdrop-blur-2xl p-5 rounded-[24px] border border-white/10 flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center text-white text-[12px] font-semibold shadow-inner">
              AF
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
              </div>
              <div className="text-[13px] text-white font-medium max-w-[200px] leading-snug">
                “Saved us from thousands in unpaid changes.”
              </div>
              <div className="font-mono text-[10px] text-white/50 mt-1 uppercase tracking-wider">— Agency Founder</div>
            </div>
          </div>

          {/* Bottom Floating Stat */}
          <div className="bg-white/90 backdrop-blur-2xl p-5 rounded-[24px] border border-white/40 shadow-xl min-w-[160px]">
            <div className="text-3xl font-semibold text-[#0B1220] mb-1 tracking-tight">$2M+</div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-[#0B1220]/40 mb-2">
              Revenue Protected
            </div>
            <div className="text-[11px] font-normal text-[#0B1220]/60 max-w-[140px] leading-relaxed">
              Through AI scope enforcement.
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
