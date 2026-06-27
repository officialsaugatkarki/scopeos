'use client';

import Header from '@/components/header'
import HowItWorks from '@/components/how-it-works'
import CtaSection from '@/components/cta-section'
import Footer from '@/components/footer'
import { FileText, Cpu, UserCheck } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <main className="w-full landing-page pt-32">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          How ScopeOS protects your margins.
        </h1>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
          A seamless workflow that eliminates ambiguity, automates tedious paperwork, and keeps your clients happy.
        </p>
      </div>

      <HowItWorks />

      {/* Additional Educational Workflow Section */}
      <section className="py-24 px-6 relative z-10 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-16">The Lifecycle of a Change Request</h2>
        
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <FileText className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">1. The Client Asks</h3>
              <p className="text-white/60">"Can we add a dark mode? It shouldn't take too long, right?"</p>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent" />
            <div className="w-full md:w-1/2">
              <p className="text-white/80 leading-relaxed">
                The client submits their request via their branded portal or by forwarding an email to your project's smart address.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-8 items-center flex-row-reverse">
            <div className="w-full md:w-1/2 p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <Cpu className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">2. AI Classifies</h3>
              <p className="text-white/60">ScopeOS checks the Master Services Agreement and project SOW.</p>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gradient-to-l from-emerald-500/50 to-transparent" />
            <div className="w-full md:w-1/2 text-right">
              <p className="text-white/80 leading-relaxed">
                The AI determines this is <strong>Out of Scope</strong>. It drafts a professional response explaining why, and generates a precise Change Request with time & material estimates.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <UserCheck className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">3. PM Approves</h3>
              <p className="text-white/60">One click to approve the draft.</p>
            </div>
            <div className="hidden md:block w-12 h-0.5 bg-gradient-to-r from-indigo-500/50 to-transparent" />
            <div className="w-full md:w-1/2">
              <p className="text-white/80 leading-relaxed">
                Your Project Manager reviews the AI's work, makes any necessary tweaks, and hits send. The client approves the $2,000 change order, and you just saved your profit margin.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <CtaSection />
      <Footer />
    </main>
  )
}
