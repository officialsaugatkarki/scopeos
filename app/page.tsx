'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import SocialProofBar from '@/components/social-proof-bar'
import FeaturesSection from '@/components/features-section'
import HowItWorks from '@/components/how-it-works'
import Testimonials from '@/components/testimonials'
import PricingSection from '@/components/pricing-section'
import CtaSection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await getSession();
      if (auth.isAuthenticated) {
        router.push('/dashboard');
      } else {
        setIsReady(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isReady) {
    return null;
  }

  return (
    <main className="w-full">
      <Header />
      <HeroSection />
      <SocialProofBar />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
