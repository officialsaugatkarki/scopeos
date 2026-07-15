'use client'

import { Star } from 'lucide-react'

export default function SocialProof() {
  const tweets = [
    {
      name: 'Marcus Chen',
      handle: '@marcuschen',
      text: 'ScopeOS caught a $15K scope change we almost missed. Paid for itself in week one.',
      avatar: 'MC',
      color: '#3B82F6',
      stars: 5,
    },
    {
      name: 'Sarah Williams',
      handle: '@sarahwdev',
      text: 'Our clients love the portal. Changes go from "just one more thing" to approved proposals in hours.',
      avatar: 'SW',
      color: '#3B82F6',
      stars: 5,
    },
    {
      name: 'DevOps Agency',
      handle: '@devopsagency',
      text: 'Finally, an AI tool that doesn\'t write code but protects our margins. ScopeOS is exactly what agencies need.',
      avatar: 'DA',
      color: '#6FCF76',
      stars: 5,
    },
    {
      name: 'Julia Rodriguez',
      handle: '@juliacreates',
      text: 'We went from eating scope creep on 40% of projects to 5%. The change request automation is incredible.',
      avatar: 'JR',
      color: '#E84057',
      stars: 5,
    },
    {
      name: 'Alex Kim',
      handle: '@pixelhooks',
      text: 'Jira integration alone is worth it. Scope changes flow straight into our sprint planning automatically.',
      avatar: 'AK',
      color: '#8B5CF6',
      stars: 5,
    },
    {
      name: 'Rachel Torres',
      handle: '@alexdevteam',
      text: 'The clarifying questions feature saves our PMs hours each week. Clients appreciate the clarity too.',
      avatar: 'RT',
      color: '#F59E0B',
      stars: 5,
    },
  ]

  return (
    <section className="py-28 px-6 relative z-10 bg-[#F5F3EE] overflow-hidden">
      <div className="max-w-[1760px] mx-auto">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-[rgba(12,20,37,0.35)] text-xs font-semibold tracking-widest uppercase block mb-3">IN THE WILD</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0C1425] tracking-tight leading-[1.08] max-w-lg">
            Agencies won&apos;t stop talking about it
          </h2>
        </div>

        {/* Tweet Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tweets.map((tweet, i) => (
            <div
              key={i}
              className="bg-white border border-[rgba(12,20,37,0.06)] rounded-2xl p-6 transition-all duration-300 hover:border-[rgba(59,130,246,0.15)] hover:shadow-[0_2px_8px_rgba(12,20,37,0.04),0_8px_32px_rgba(12,20,37,0.04)] group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: tweet.color }}
                >
                  {tweet.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-[#0C1425] text-sm font-semibold">{tweet.name}</div>
                  <div className="text-[rgba(12,20,37,0.35)] text-xs">{tweet.handle}</div>
                </div>
              </div>
              <p className="text-[rgba(12,20,37,0.6)] text-sm leading-relaxed mb-4">
                {tweet.text}
              </p>
              <div className="flex items-center gap-0.5">
                {[...Array(tweet.stars)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-[#3B82F6] text-[#3B82F6]" />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
