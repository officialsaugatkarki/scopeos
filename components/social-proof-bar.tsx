export default function SocialProofBar() {
  const agencies = ['DevShop Co', 'TechFlow Studios', 'BuildLabs', 'AgencyPro', 'CodeCraft']

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-border/20">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm sm:text-base text-foreground/70 mb-6">
          <span className="font-semibold">Trusted by 50+ dev agencies protecting $2M+ in margins</span>
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
          {agencies.map((agency) => (
            <div key={agency} className="text-foreground/50 font-medium text-sm sm:text-base">
              {agency}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
