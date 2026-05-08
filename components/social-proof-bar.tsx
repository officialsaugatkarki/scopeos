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
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/[0.04]">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs sm:text-sm text-white/30 mb-8 tracking-widest uppercase">
          Trusted by top brands around the world
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
          {agencies.map((agency) => (
            <div key={agency.name} className="flex items-center gap-2 text-white/25 hover:text-white/40 transition-colors">
              <span className="text-lg">{agency.icon}</span>
              <span className="font-semibold text-sm sm:text-base tracking-wide">{agency.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
