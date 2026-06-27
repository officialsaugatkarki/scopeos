'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import ProblemSolution from '@/components/problem-solution'
import ProductPreviews from '@/components/product-previews'
import Testimonials from '@/components/testimonials'
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
    <main className="w-full landing-page">
      <Header />
      <HeroSection />
      
      {/* High-level Overview */}
      <ProblemSolution />
      <ProductPreviews />
      
      {/* Social Proof & CTA */}
      <Testimonials />
      <CtaSection />
      
      <Footer />
    </main>
  )
}
