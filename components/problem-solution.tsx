'use client'

import { Search, MessageSquare, GitBranch, ArrowRight } from 'lucide-react'

export default function ProblemSolution() {

  return (
    <section className="py-28 px-6 relative z-10 bg-[#F5F3EE]">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Label */}
        <div className="text-center mb-4">
          <span className="lp-badge">HOW IT WORKS</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0C1425] text-center mb-6 tracking-tight leading-[1.08]">
          Stop scope creep.<br />
          <span className="text-[#3B82F6]">Start protecting revenue.</span>
        </h2>
        <p className="text-center text-[rgba(12,20,37,0.5)] text-lg max-w-2xl mx-auto mb-20 leading-relaxed">
          Every client request is analyzed by AI before development begins. ScopeOS detects changes, asks clarifying questions, and ensures requirements are clear.
        </p>

        {/* Steps */}
        <div className="space-y-0">
          {/* Step 1 */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="lp-step-circle shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-5 h-5" />
              </div>
              <div className="w-px flex-1 bg-[rgba(12,20,37,0.06)] my-3" />
            </div>
            <div className="flex-1 pb-12">
              <h3 className="text-xl font-bold text-[#0C1425] mb-3">Client requests are automatically analyzed</h3>
              <p className="text-[rgba(12,20,37,0.5)] text-sm mb-5 leading-relaxed max-w-lg">
                When a client submits a change request — via email, Slack, or the portal — ScopeOS immediately analyzes scope, impact, and risk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Scope Detection', desc: 'Identifies whether the request is new work, a change, or within the original scope.' },
                  { name: 'Impact Analysis', desc: 'Estimates timeline, cost, and complexity changes before any work begins.' },
                  { name: 'Risk Scoring', desc: 'Flags requests that could lead to scope creep or margin erosion.' },
                ].map((tool, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-[rgba(12,20,37,0.06)] shadow-[0_1px_3px_rgba(12,20,37,0.03)] hover:shadow-[0_2px_8px_rgba(12,20,37,0.06)] transition-shadow duration-300">
                    <div className="font-bold text-[#3B82F6] text-sm mb-2">{tool.name}</div>
                    <p className="text-[rgba(12,20,37,0.45)] text-xs leading-relaxed">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="lp-step-circle shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="w-px flex-1 bg-[rgba(12,20,37,0.06)] my-3" />
            </div>
            <div className="flex-1 pb-12">
              <h3 className="text-xl font-bold text-[#0C1425] mb-3">AI asks the right clarifying questions</h3>
              <p className="text-[rgba(12,20,37,0.5)] text-sm leading-relaxed max-w-lg">
                Before your team responds, ScopeOS generates targeted questions to surface hidden requirements and prevent misunderstandings — ensuring nothing is left ambiguous.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="lp-step-circle shrink-0 group-hover:scale-110 transition-transform duration-300">
                <GitBranch className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 pb-4">
              <h3 className="text-xl font-bold text-[#0C1425] mb-3">Change requests are generated automatically</h3>
              <p className="text-[rgba(12,20,37,0.5)] text-sm leading-relaxed max-w-lg mb-6">
                ScopeOS creates a formal change request with pricing, timeline updates, and client approval workflows — so you never do free work again.
              </p>
              <a
                href="/how-it-works"
                className="inline-flex items-center gap-2 text-[#3B82F6] text-sm font-semibold hover:gap-3 transition-all duration-300"
              >
                See the full process <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
