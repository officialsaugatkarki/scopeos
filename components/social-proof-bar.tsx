export default function SocialProofBar() {
  const agencies = [
    { name: 'DevShop', icon: '✦' },
    { name: 'TechFlow', icon: '◈' },
    { name: 'BuildLabs', icon: '◆' },
    { name: 'AgencyPro', icon: '✧' },
    { name: 'CodeCraft', icon: '◇' },
    { name: 'StackWorks', icon: '⬡' },
    { name: 'NexaDev', icon: '◎' },
  ]

  return (
    <section className="lp-section-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F4]">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#94A3B8] mb-8">
          Trusted by leading development agencies
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14">
          {agencies.map((agency) => (
            <div
              key={agency.name}
              className="flex items-center gap-2 transition-all duration-200 select-none group cursor-default"
              style={{ color: '#C2D0E6' }}
            >
              <span className="text-sm group-hover:text-[#2563EB] transition-colors">{agency.icon}</span>
              <span
                className="font-bold text-sm tracking-widest uppercase group-hover:text-[#1E3058] transition-colors"
                style={{ letterSpacing: '0.12em' }}
              >
                {agency.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
