'use client'

import { LayoutDashboard, Users } from 'lucide-react'

export default function ProductPreviews() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            One platform. Two perspectives.
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            A powerful operational dashboard for your agency, and a beautiful, transparent portal for your clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Agency Dashboard Preview */}
          <div className="flex flex-col">
            <div 
              className="rounded-t-[2rem] p-8 flex-1 border border-b-0 border-white/10"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6">
                <LayoutDashboard className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Agency Dashboard</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                Your command center. Connect contracts, train the AI on your workflow, and review drafted change requests before they reach the client.
              </p>
            </div>
            {/* Mock Image/UI */}
            <div 
              className="h-64 rounded-b-[2rem] border border-white/10 overflow-hidden relative"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {/* Mock sidebar */}
              <div className="absolute top-0 left-0 bottom-0 w-24 border-r border-white/10 p-4 space-y-3">
                <div className="w-full h-2 rounded bg-white/10" />
                <div className="w-3/4 h-2 rounded bg-white/10" />
                <div className="w-full h-2 rounded bg-white/10" />
              </div>
              {/* Mock content */}
              <div className="absolute top-0 left-24 right-0 bottom-0 p-6">
                <div className="w-32 h-4 rounded bg-white/20 mb-6" />
                <div className="w-full h-24 rounded-xl border border-white/10 bg-white/5 mb-4" />
                <div className="w-full h-12 rounded-xl border border-white/10 bg-white/5" />
              </div>
            </div>
          </div>

          {/* Client Portal Preview */}
          <div className="flex flex-col">
            <div 
              className="rounded-t-[2rem] p-8 flex-1 border border-b-0 border-white/10"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Client Portal</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                A branded, professional experience for your clients. They submit requests, the AI instantly clarifies the scope, and they approve change orders securely.
              </p>
            </div>
            {/* Mock Image/UI */}
            <div 
              className="h-64 rounded-b-[2rem] border border-white/10 overflow-hidden relative"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              {/* Mock chat bubble */}
              <div className="absolute top-8 right-6 w-48 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30" />
              <div className="absolute top-24 left-6 w-56 h-20 rounded-xl bg-white/10 border border-white/10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
