'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hasAccount, setHasAccount] = useState<boolean | null>(null)

  useEffect(() => {
    // Check scroll
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Check if user has an account
    const storedHasAccount = localStorage.getItem('hasAccount') === 'true'
    setHasAccount(storedHasAccount)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0B1224]/80 backdrop-blur-md py-4' : 'py-6'}`}>
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Image src="/assets/logo.png" alt="ScopeOS" width={32} height={32} className="rounded-lg object-contain" />
          <span className="font-semibold text-white text-[16px] tracking-tight">
            ScopeOS
          </span>
        </Link>

        {/* Center: Text Links */}
        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-[13px] transition-all duration-300 font-medium text-white/70 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Smart Auth Buttons */}
        <div className="hidden md:flex items-center gap-6 shrink-0 min-w-[120px] justify-end">
          {hasAccount === null ? null : hasAccount ? (
            <Link
              href="/login"
              className="text-[13px] font-medium px-6 py-2.5 rounded-full transition-all duration-300 bg-white text-black hover:bg-gray-100 shadow-lg"
            >
              Login
            </Link>
          ) : (
            <Link
              href="/signup"
              className="text-[13px] font-medium px-6 py-2.5 rounded-full transition-all duration-300 bg-white text-black hover:bg-gray-100 shadow-lg"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className="md:hidden absolute top-20 left-4 right-4 rounded-2xl overflow-hidden p-4"
          style={{
            background: 'rgba(13, 21, 38, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
          }}
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-colors py-3 px-4 rounded-xl text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-white/10">
              {hasAccount === null ? null : hasAccount ? (
                <Link
                  href="/login"
                  className="w-full text-center text-sm font-medium text-black py-3 rounded-xl bg-white hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="w-full text-center text-sm font-medium text-black py-3 rounded-xl bg-white hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
