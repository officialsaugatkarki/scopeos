'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Logo } from 'lucide-react';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-b border-border">
        <div className="container flex items-center justify-between h-16 px-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Logo className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">ScopeGuard</span>
          </div>

          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            size="sm"
          >
            Log in as PM
          </Button>
        </div>
      </header>

      <main className="container py-8 px-4">{children}</main>
    </div>
  );
}
