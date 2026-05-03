'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            SG
          </div>
          <span className="font-semibold text-foreground">ScopeGuard</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground/70 hover:text-foreground transition">
            Product
          </a>
          <a href="#pricing" className="text-foreground/70 hover:text-foreground transition">
            Pricing
          </a>
          <a href="#" className="text-foreground/70 hover:text-foreground transition">
            Docs
          </a>
          <a href="#" className="text-foreground/70 hover:text-foreground transition">
            Blog
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/portal'}>
            Client Portal
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/login'}>
            Log in
          </Button>
          <Button size="sm" onClick={() => window.location.href = '/signup'}>
            Start Free Trial
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 bg-white">
          <nav className="flex flex-col px-4 py-4 space-y-3">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition py-2">
              Product
            </a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition py-2">
              Pricing
            </a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition py-2">
              Docs
            </a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition py-2">
              Blog
            </a>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="ghost" size="sm" className="w-full">
                Log in
              </Button>
              <Button size="sm" className="w-full">
                Start Free Trial
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
