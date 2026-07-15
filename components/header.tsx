'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 150)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ]

  // This header only appears when scrolled past the hero section
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-black/5 shadow-sm ${
        scrolled
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="w-full max-w-[1760px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <span className="font-black text-xl tracking-tight text-[#0B1220] leading-none">
            Scope<span className="text-[#3B82F6]">OS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-sm font-bold text-[#0B1220]/60 hover:text-[#0B1220] transition-colors duration-200 px-4 py-2 rounded-full hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-bold text-[#0B1220]/60 hover:text-[#0B1220] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/waitlist"
            className="text-sm font-bold px-6 py-3 rounded-full bg-[#0B1220] text-white hover:bg-[#0F172A] hover:scale-105 transition-all duration-300 shadow-md"
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative w-10 h-10 rounded-full flex items-center justify-center text-[#0B1220] hover:bg-black/5 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden absolute top-full mt-2 w-[90%] max-w-[300px] transition-all duration-400 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="rounded-2xl overflow-hidden bg-[#FAF8F5]/95 backdrop-blur-xl border border-black/5 shadow-2xl">
          <nav className="flex flex-col p-2">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-[#0B1220]/70 hover:text-[#0B1220] hover:bg-black/5 transition-colors py-3 px-4 rounded-xl text-sm font-bold"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-black/5">
              <Link
                href="/login"
                className="w-full text-center text-sm font-bold text-[#0B1220]/70 hover:text-[#0B1220] py-3 rounded-xl hover:bg-black/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/waitlist"
                className="w-full text-center text-sm font-bold text-white py-3.5 rounded-xl bg-[#0B1220] hover:bg-[#0F172A] transition-all"
                onClick={() => setIsOpen(false)}
              >
                Join Waitlist
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
