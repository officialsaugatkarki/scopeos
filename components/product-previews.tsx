'use client'

import { ArrowRight } from 'lucide-react'

export default function ProductPreviews() {
  return (
    <section className="py-28 px-6 relative z-10 bg-[#F5F3EE]">
      <div className="max-w-[1760px] mx-auto">
        <PortalSection />
        <IntegrationsSection />
        <AnalyticsSection />
      </div>
    </section>
  )
}

function PortalSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-36">
      {/* Left: Content */}
      <div>
        <span className="lp-badge mb-6 inline-flex">CLIENT PORTAL</span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0C1425] mb-5 tracking-tight leading-[1.08]">
          A portal your clients<br />actually enjoy using
        </h2>
        <p className="text-[rgba(12,20,37,0.5)] text-lg mb-8 leading-relaxed max-w-md">
          Clean, branded, and built for clarity. Clients submit requests, review proposals, and approve changes — all in one place.
        </p>

        <div className="flex flex-wrap gap-2.5 mb-10">
          {['Request Submission', 'Change Approvals', 'Real-time Updates', 'File Sharing'].map((feature) => (
            <div key={feature} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[rgba(12,20,37,0.06)] text-[rgba(12,20,37,0.55)] text-xs font-medium shadow-[0_1px_3px_rgba(12,20,37,0.03)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              {feature}
            </div>
          ))}
        </div>

        <a
          href="/waitlist"
          className="inline-flex items-center gap-2 text-[#3B82F6] text-sm font-semibold hover:gap-3 transition-all duration-300"
        >
          Get early access <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Right: Portal Mockup */}
      <div className="bg-[#0C1425] border border-[rgba(245,243,238,0.08)] rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(12,20,37,0.25)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(245,243,238,0.06)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
          </div>
          <span className="text-[rgba(245,243,238,0.25)] text-xs ml-2 font-mono">scopeos.com/portal</span>
        </div>
        <div className="p-5 space-y-3">
          {[
            { status: 'New', title: 'Add user authentication', desc: 'OAuth2 + session management', color: '#6FCF76', bg: 'rgba(111,207,118,0.1)' },
            { status: 'In Review', title: 'Update dashboard layout', desc: 'Redesign analytics widgets', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
            { status: 'Approved', title: 'Integrate Stripe payments', desc: 'Subscription billing flow', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(245,243,238,0.03)] border border-[rgba(245,243,238,0.06)] hover:border-[rgba(245,243,238,0.1)] transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div>
                  <span className="text-[rgba(245,243,238,0.8)] text-sm font-medium block">{item.title}</span>
                  <span className="text-[rgba(245,243,238,0.3)] text-xs">{item.desc}</span>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0" style={{ backgroundColor: item.bg, color: item.color }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IntegrationsSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center mb-36">
      {/* Left: Integrations Mockup */}
      <div className="order-2 lg:order-1 bg-[#0C1425] border border-[rgba(245,243,238,0.08)] rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(12,20,37,0.25)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(245,243,238,0.06)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
          </div>
          <span className="text-[rgba(245,243,238,0.25)] text-xs ml-2 font-mono">Integrations</span>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Jira', icon: '🔷', status: 'Connected', active: true },
              { name: 'Linear', icon: '🟣', status: 'Connected', active: true },
              { name: 'Slack', icon: '💬', status: 'Connected', active: true },
              { name: 'Notion', icon: '📝', status: 'Connect', active: false },
              { name: 'GitHub', icon: '🐙', status: 'Connected', active: true },
              { name: 'Figma', icon: '🎨', status: 'Connect', active: false },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border transition-all duration-300 ${
                item.active
                  ? 'bg-[rgba(59,130,246,0.06)] border-[rgba(59,130,246,0.15)] hover:border-[rgba(59,130,246,0.3)]'
                  : 'bg-[rgba(245,243,238,0.02)] border-[rgba(245,243,238,0.05)] hover:border-[rgba(245,243,238,0.1)]'
              }`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="font-semibold text-[#F5F3EE] text-sm">{item.name}</span>
                </div>
                <div className={`text-xs font-medium ${item.active ? 'text-[#6FCF76]' : 'text-[rgba(245,243,238,0.3)]'}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="order-1 lg:order-2">
        <span className="lp-badge mb-6 inline-flex">INTEGRATIONS</span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0C1425] mb-5 tracking-tight leading-[1.08]">
          Works with your<br />
          <span className="text-[#3B82F6]">existing stack</span>
        </h2>
        <p className="text-[rgba(12,20,37,0.5)] text-lg mb-8 leading-relaxed max-w-md">
          Connect ScopeOS to Jira, Linear, Notion, and Slack. Scope changes flow directly into your project management tools.
        </p>

        <a
          href="/waitlist"
          className="inline-flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all hover:bg-[#60A5FA] hover:shadow-[0_8px_24px_rgba(59,130,246,0.25)] shadow-[0_1px_3px_rgba(12,20,37,0.06),0_4px_12px_rgba(59,130,246,0.15)]"
        >
          Get started
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

function AnalyticsSection() {
  return (
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Left: Content */}
      <div>
        <span className="lp-badge mb-6 inline-flex">ANALYTICS</span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#0C1425] mb-5 tracking-tight leading-[1.08]">
          Know your margins<br />before they erode
        </h2>
        <p className="text-[rgba(12,20,37,0.5)] text-lg mb-8 leading-relaxed max-w-md">
          Track scope changes, revenue impact, and project health across all your clients — in real time.
        </p>

        <div className="flex flex-wrap gap-2.5 mb-10">
          {['Revenue Protection', 'Scope Tracking', 'Client Health', 'Team Performance'].map((feature) => (
            <div key={feature} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[rgba(12,20,37,0.06)] text-[rgba(12,20,37,0.55)] text-xs font-medium shadow-[0_1px_3px_rgba(12,20,37,0.03)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Analytics Mockup */}
      <div className="bg-[#0C1425] border border-[rgba(245,243,238,0.08)] rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(12,20,37,0.25)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(245,243,238,0.06)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(245,243,238,0.1)]" />
          </div>
          <span className="text-[rgba(245,243,238,0.25)] text-xs ml-2 font-mono">Dashboard</span>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#3B82F6]">$24,500</span>
            <span className="text-[rgba(245,243,238,0.4)] text-sm pb-1.5">protected this month</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Scope Changes', value: '18', change: '+3', positive: true },
              { label: 'Changes Approved', value: '83%', change: '15/18', positive: true },
              { label: 'Revenue Impact', value: '$8.2K', change: '+12%', positive: true },
            ].map((stat, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[rgba(245,243,238,0.03)] border border-[rgba(245,243,238,0.06)]">
                <div className="text-[rgba(245,243,238,0.4)] text-[11px] font-medium mb-1.5">{stat.label}</div>
                <div className="text-[#F5F3EE] text-xl font-bold mb-1">{stat.value}</div>
                <div className="text-[#6FCF76] text-xs font-medium">{stat.change}</div>
              </div>
            ))}
          </div>
          {/* Mini chart line */}
          <div className="h-16 rounded-xl bg-[rgba(245,243,238,0.02)] border border-[rgba(245,243,238,0.04)] flex items-end px-3 pb-2 gap-1">
            {[40, 55, 45, 65, 50, 70, 60, 80, 75, 85, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-[#3B82F6]/30 transition-all duration-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
