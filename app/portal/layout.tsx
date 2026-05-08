'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PortalLayout({ children }: { children: React.ReactNode; }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#050A18]">
      <header className="sticky top-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
            <Image src="/logo.png" alt="ScopeGuard" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-white/90 hidden sm:inline text-sm">ScopeGuard</span>
          </div>
          <Button onClick={() => router.push('/login')} variant="outline" size="sm"
            className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
            Log in as PM
          </Button>
        </div>
      </header>
      <main className="container py-8 px-4">{children}</main>
    </div>
  );
}