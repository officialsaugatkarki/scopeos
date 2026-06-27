'use client';

import Header from '@/components/header'
import PricingSection from '@/components/pricing-section'
import CtaSection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function PricingPage() {
  const faqs = [
    {
      q: "How does the 'Active Projects' limit work?",
      a: "An active project is any project that is currently receiving or processing scope change requests. Once a project is completed and archived, it no longer counts towards your limit."
    },
    {
      q: "Can I bring my own OpenAI API key?",
      a: "Yes, Enterprise customers can use their own OpenAI keys to manage their own API costs and data privacy constraints."
    },
    {
      q: "What if a client refuses to use the portal?",
      a: "No problem. Clients can simply email a dedicated project email address (e.g., project-name@requests.youragency.com). ScopeOS will automatically ingest, analyze, and draft a response to their email."
    },
    {
      q: "Is there a setup fee?",
      a: "No setup fees on Starter or Agency Pro. Enterprise plans include a dedicated onboarding specialist and may have a one-time setup fee depending on custom integrations."
    }
  ]

  return (
    <main className="w-full landing-page pt-32">
      <Header />
      
      <PricingSection />

      {/* Pricing Specific FAQ */}
      <section className="py-24 px-6 relative z-10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {faqs.map((faq, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
              <p className="text-white/60 leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      
      <CtaSection />
      <Footer />
    </main>
  )
}
