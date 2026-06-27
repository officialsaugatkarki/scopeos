'use client';

import Header from '@/components/header'
import FeaturesSection from '@/components/features-section'
import CtaSection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function FeaturesPage() {
  return (
    <main className="w-full landing-page pt-32">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Powerful features for modern agencies.
        </h1>
        <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
          From AI-driven scope detection to automated change request drafting, everything you need to protect your margins is right here.
        </p>
      </div>

      <FeaturesSection />
      
      <CtaSection />
      <Footer />
    </main>
  )
}
