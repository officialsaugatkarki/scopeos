'use client'

import { useRef, useEffect, useState } from 'react'
import { Upload, Share2, Cpu, CheckSquare } from 'lucide-react'

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const steps = [
    {
      icon: Upload,
      number: '01',
      title: 'Upload Scope Doc',
      description: 'Define your baseline scope, deliverables, and hourly rates. ScopeOS AI reads and understands everything.',
    },
    {
      icon: Share2,
      number: '02',
      title: 'Share Client Portal',
      description: 'Give clients a beautiful, branded portal to submit requests, view decisions, and approve change orders.',
    },
    {
      icon: Cpu,
      number: '03',
      title: 'AI Analyzes Requests',
      description: 'Every message is instantly analyzed. AI compares it to your scope, sets a confidence score, and drafts a response.',
    },
    {
      icon: CheckSquare,
      number: '04',
      title: 'Approve & Send',
      description: 'Your PM reviews the AI draft in one click. Approve, edit, or escalate. Clients get professional, consistent answers.',
    },
  ]

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-28 px-4 sm:px-6 lg:px-8 relative z-10 bg-[#F5F3EE]"
    >
      <div className="max-w-[1760px] mx-auto">

        {/* Section Header */}
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-[#3B82F6]"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            How it works
          </div>
          <h2
            className="font-black text-[#0C1425] text-balance mb-5"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}
          >
            Up and running{' '}
            <span className="lp-gradient-text-blue">in 10 minutes</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-balance text-[rgba(12,20,37,0.5)]">
            Four simple steps to eliminate scope creep and protect your margins permanently.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 relative mb-20">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px pointer-events-none"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.3) 20%, rgba(59,130,246,0.3) 80%, transparent)',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.8s ease 0.6s',
            }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className={`flex flex-col items-center text-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-white border border-[rgba(12,20,37,0.06)] shadow-[0_4px_12px_rgba(12,20,37,0.04)]"
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                      transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 120 + 100}ms`,
                    }}
                  >
                    <Icon className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <span className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-[#3B82F6] px-1.5 py-0.5 rounded-full">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-bold text-[#0C1425] text-[15px] mb-2 tracking-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[rgba(12,20,37,0.5)]">{step.description}</p>
              </div>
            )
          })}
        </div>

        {/* Client Portal Preview — Light Card */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="text-center text-xs font-bold tracking-widest uppercase mb-8 text-[rgba(12,20,37,0.3)]">
            Client Experience
          </p>

          <div className="rounded-[2rem] overflow-hidden bg-[#0C1425] border border-[rgba(245,243,238,0.08)] shadow-[0_24px_80px_rgba(12,20,37,0.25)]">
            {/* Portal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-[rgba(245,243,238,0.06)]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">SO</span>
                </div>
                <span className="text-[rgba(245,243,238,0.8)] text-sm font-semibold">Client Portal — Acme Corp</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[rgba(245,243,238,0.4)] text-xs font-medium">Active</span>
              </div>
            </div>

            {/* Chat area */}
            <div className="p-6 space-y-4">
              {/* Client message */}
              <div className="flex justify-end">
                <div className="max-w-sm rounded-2xl rounded-br-sm px-4 py-3 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)]">
                  <p className="text-[rgba(245,243,238,0.9)] text-sm">Can we add a dark mode to the app? Also want push notifications.</p>
                  <p className="text-[rgba(59,130,246,0.4)] text-xs mt-1">2 min ago</p>
                </div>
              </div>

              {/* AI response */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="max-w-sm rounded-2xl rounded-bl-sm px-4 py-3 bg-[rgba(245,243,238,0.03)] border border-[rgba(245,243,238,0.06)]">
                  <p className="text-[rgba(245,243,238,0.9)] text-sm mb-3">
                    I analyzed your request against your project scope. Here's what I found:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">✓ In Scope</span>
                      <span className="text-[rgba(245,243,238,0.5)] text-xs">Push notifications (Phase 2 spec §3.4)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">⚡ Change Request</span>
                      <span className="text-[rgba(245,243,238,0.5)] text-xs">Dark mode — not in original scope</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[rgba(245,243,238,0.06)]">
                    <p className="text-[rgba(245,243,238,0.35)] text-xs">Change request draft ready • Est. 18hrs • $2,700</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm mt-6 font-medium text-[rgba(12,20,37,0.3)]">
            ↑ Client portal — clear scope decisions, zero ambiguity
          </p>
        </div>
      </div>
    </section>
  )
}
