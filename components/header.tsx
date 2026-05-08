'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center pt-4 px-4">
      <div className="w-full max-w-5xl">
        {/* Floating Glass Pill Navigation */}
        <div className="flex items-center justify-between px-6 py-3 rounded-full glass-card-strong border border-white/[0.06]">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              SG
            </div>
            <span className="font-semibold text-white/90 text-sm">ScopeGuard</span>
          </div>

          {/* Desktop Navigation — Centered */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] rounded-full px-1.5 py-1">
            <a href="#features" className="text-white/60 hover:text-white text-sm px-4 py-1.5 rounded-full hover:bg-white/[0.06] transition-all">
              Product
            </a>
            <a href="#pricing" className="text-white/60 hover:text-white text-sm px-4 py-1.5 rounded-full hover:bg-white/[0.06] transition-all">
              Pricing
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm px-4 py-1.5 rounded-full hover:bg-white/[0.06] transition-all">
              Docs
            </a>
            <a href="#" className="text-white/60 hover:text-white text-sm px-4 py-1.5 rounded-full hover:bg-white/[0.06] transition-all">
              Blog
            </a>
          </nav>

          {/* Right — Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/[0.06] text-sm"
              onClick={() => window.location.href = '/portal'}
            >
              Client Portal
            </Button>
            <Button
              size="sm"
              className="btn-gradient text-white text-sm px-5 rounded-full border-0"
              onClick={() => window.location.href = '/login'}
            >
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 rounded-2xl glass-card-strong border border-white/[0.06] overflow-hidden">
            <nav className="flex flex-col px-4 py-4 space-y-1">
              <a href="#features" className="text-white/60 hover:text-white transition py-2.5 px-3 rounded-lg hover:bg-white/[0.04] text-sm">
                Product
              </a>
              <a href="#pricing" className="text-white/60 hover:text-white transition py-2.5 px-3 rounded-lg hover:bg-white/[0.04] text-sm">
                Pricing
              </a>
              <a href="#" className="text-white/60 hover:text-white transition py-2.5 px-3 rounded-lg hover:bg-white/[0.04] text-sm">
                Docs
              </a>
              <a href="#" className="text-white/60 hover:text-white transition py-2.5 px-3 rounded-lg hover:bg-white/[0.04] text-sm">
                Blog
              </a>
              <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
                <Button variant="ghost" size="sm" className="w-full text-white/60 hover:text-white hover:bg-white/[0.06]">
                  Client Portal
                </Button>
                <Button size="sm" className="w-full btn-gradient text-white rounded-full border-0">
                  Login
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
