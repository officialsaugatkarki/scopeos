'use client'

export default function PricingComparison() {
  const competitors = [
    { name: 'ScopeOS', price: 0, color: '#3B82F6', label: '$0 / yr', highlight: true },
    { name: 'Lovable', price: 1200, color: '#E84057', label: '$1,200 / yr' },
    { name: 'Cursor Pro', price: 1920, color: '#E84057', label: '$1,920 / yr' },
    { name: 'Devin', price: 2400, color: '#E84057', label: '$2,400 / yr' },
    { name: 'Factory AI', price: 3600, color: '#E84057', label: '$3,600 / yr' },
    { name: 'Custom Agent', price: 6000, color: '#E84057', label: '$6,000 / yr' },
  ]

  const maxPrice = 6000

  return (
    <section className="py-24 px-6 relative z-10 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-[#6FCF76] relative">
            <div className="absolute inset-0 bg-[#6FCF76] rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-[rgba(12,20,37,0.4)] text-xs font-semibold tracking-widest uppercase">
            Agencies saving thousands per year
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-[#0C1425] tracking-tight mb-3">
          Why pay for what&apos;s free?
        </h2>
        <p className="text-[rgba(12,20,37,0.45)] text-base mb-10 max-w-lg">
          Every competitor charges thousands per year for AI coding agents. ScopeOS gives you a free cloud sandbox, a free coding agent, and a live preview — $0.
        </p>

        {/* Chart */}
        <div className="space-y-3">
          {competitors.map((item, i) => {
            const widthPct = item.price === 0 ? 8 : Math.max((item.price / maxPrice) * 100, 4)
            return (
              <div key={i} className="flex items-center gap-4 group">
                {/* Label */}
                <div className="w-32 flex items-center gap-2.5 shrink-0">
                  {item.highlight && (
                    <div className="w-5 h-5 rounded-md bg-[#0C1425] flex items-center justify-center shadow-[0_2px_8px_rgba(12,20,37,0.15)]">
                      <span className="text-[#3B82F6] text-[9px] font-bold">S</span>
                    </div>
                  )}
                  <span className={`text-sm font-medium transition-colors ${
                    item.highlight ? 'text-[#0C1425]' : 'text-[rgba(12,20,37,0.4)]'
                  }`}>
                    {item.name}
                  </span>
                </div>

                {/* Bar */}
                <div className="flex-1 relative">
                  <div className="h-6 rounded-lg bg-[rgba(12,20,37,0.03)] overflow-hidden border border-[rgba(12,20,37,0.04)]">
                    <div
                      className="h-full rounded-lg transition-all duration-700 ease-out"
                      style={{
                        width: `${widthPct}%`,
                        backgroundColor: item.color,
                        boxShadow: item.highlight ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Price */}
                <span className={`text-xs font-mono w-24 text-right shrink-0 ${
                  item.highlight ? 'text-[#3B82F6] font-bold' : 'text-[rgba(12,20,37,0.3)]'
                }`}>
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Axis */}
        <div className="flex items-center justify-between mt-5 pl-28 md:pl-36">
          <div className="flex-1 relative h-px bg-[rgba(12,20,37,0.06)]" />
          <div className="flex items-center gap-8 md:gap-12 text-[rgba(12,20,37,0.2)] text-[10px] font-mono absolute left-28 md:left-36 right-0">
            <span>$0</span>
            <span>$2,000</span>
            <span>$4,000</span>
            <span>$6,000</span>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-8 pt-6 border-t border-[rgba(12,20,37,0.06)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#0C1425] flex items-center justify-center">
            <span className="text-[#3B82F6] text-[10px] font-bold">S</span>
          </div>
          <div>
            <p className="text-[#0C1425] text-sm font-semibold">ScopeOS is free forever</p>
            <p className="text-[rgba(12,20,37,0.4)] text-xs">No credit card. No usage limits. No catch.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
