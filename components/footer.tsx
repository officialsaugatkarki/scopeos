'use client'

import Link from 'next/link'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqItems = [
  {
    question: 'How does ScopeOS detect scope changes?',
    answer: 'ScopeOS analyzes every client request against the original project scope using AI. It identifies when a request exceeds the agreed-upon requirements and flags it as a potential scope change.',
  },
  {
    question: 'Does it integrate with our existing tools?',
    answer: 'Yes. ScopeOS connects to Jira, Linear, Notion, and Slack. Change requests flow directly into your project management tools automatically.',
  },
  {
    question: 'What happens when a scope change is detected?',
    answer: 'ScopeOS generates a clarifying question, creates a formal change request with pricing, and sends it to the client for approval — all before any work begins.',
  },
  {
    question: 'Can clients see the portal?',
    answer: 'Yes. Each client gets a clean, branded portal where they submit requests, review change proposals, and approve work.',
  },
  {
    question: 'How much does it cost?',
    answer: 'ScopeOS is free. We believe every agency deserves to protect their margins without additional overhead.',
  },
  {
    question: 'Is our client data secure?',
    answer: 'Absolutely. We use enterprise-grade encryption and never train on your data. Your client relationships stay yours.',
  },
]

export default function Footer() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10">
      {/* FAQ Section — White background */}
      <div className="py-28 px-6 bg-white">
        <div className="max-w-[1760px] mx-auto">
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-16 items-start">
            {/* Left: Heading */}
            <div>
              <span className="text-[rgba(12,20,37,0.35)] text-xs font-semibold tracking-widest uppercase block mb-3">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0C1425] tracking-tight leading-[1.1]">
                Questions,<br />answered
              </h2>
              <p className="text-[rgba(12,20,37,0.45)] text-sm mt-4 leading-relaxed max-w-xs">
                Everything you need to know about ScopeOS. Can&apos;t find the answer here?{' '}
                <a href="mailto:support@scopeos.ai" className="text-[#3B82F6] font-semibold hover:underline">Contact us</a>.
              </p>
            </div>

            {/* Right: Accordion */}
            <div className="space-y-0">
              {faqItems.map((item, i) => (
                <div key={i} className="border-b border-[rgba(12,20,37,0.06)]">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[rgba(12,20,37,0.2)] text-sm font-mono w-6">{String(i + 1).padStart(2, '0')}</span>
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        openFaq === i ? 'text-[#3B82F6]' : 'text-[rgba(12,20,37,0.7)] group-hover:text-[#0C1425]'
                      }`}>
                        {item.question}
                      </span>
                    </span>
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                      openFaq === i
                        ? 'bg-[rgba(59,130,246,0.1)] text-[#3B82F6]'
                        : 'bg-[rgba(12,20,37,0.03)] text-[rgba(12,20,37,0.25)] group-hover:bg-[rgba(12,20,37,0.06)]'
                    }`}>
                      {openFaq === i ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'
                  }`}>
                    <p className="text-[rgba(12,20,37,0.45)] text-sm leading-relaxed pl-9">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom — Navy background */}
      <div className="bg-[#0C1425] pt-20 pb-8 px-6">
        <div className="max-w-[1760px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-5 group">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center shadow-[0_2px_8px_rgba(59,130,246,0.2)]">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-[#F5F3EE] text-lg tracking-tight">ScopeOS</span>
              </Link>
              <p className="text-[rgba(245,243,238,0.4)] text-sm max-w-xs leading-relaxed mb-6">
                AI-powered scope management for development agencies. Protect your margins, prevent scope creep, and build client trust.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6FCF76] relative">
                  <div className="absolute inset-0 bg-[#6FCF76] rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-[rgba(245,243,238,0.4)] text-xs">All systems operational</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[#F5F3EE] text-sm mb-5">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Features</Link></li>
                <li><Link href="/how-it-works" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">How It Works</Link></li>
                <li><Link href="/pricing" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Pricing</Link></li>
                <li><Link href="/blog" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#F5F3EE] text-sm mb-5">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Blog</Link></li>
                <li><a href="mailto:support@scopeos.ai" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#F5F3EE] text-sm mb-5">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Privacy</Link></li>
                <li><Link href="/terms" className="text-[rgba(245,243,238,0.4)] hover:text-[#F5F3EE] text-sm transition-colors duration-200">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[rgba(245,243,238,0.06)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[rgba(245,243,238,0.25)] text-sm">
              © {year} ScopeOS. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://twitter.com/scopeos" target="_blank" rel="noopener noreferrer" className="text-[rgba(245,243,238,0.3)] hover:text-[#3B82F6] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="https://github.com/scopeos" target="_blank" rel="noopener noreferrer" className="text-[rgba(245,243,238,0.3)] hover:text-[#3B82F6] transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
