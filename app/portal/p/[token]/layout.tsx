'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { PortalProvider, usePortal } from '@/components/portal-context';
import { PortalSidebar } from '@/components/portal-sidebar';
import { PortalBottomNav } from '@/components/portal-bottom-nav';
import { PortalHeader } from '@/components/portal-header';
import { Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PortalShell({ children }: { children: React.ReactNode }) {
  const { isLoading, error, project } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#050A18] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
          <div>
            <p className="text-white/60 font-medium">Loading your portal...</p>
            <p className="text-white/30 text-sm mt-1">Setting up your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="fixed inset-0 bg-[#050A18] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Portal Not Found</h1>
          <p className="text-white/40 mb-6">
            {error || 'This portal link is invalid or has been disabled. Please contact your agency for a valid link.'}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-background overflow-hidden text-foreground">
      {/* Sidebar — fixed height, never scrolls with page */}
      <PortalSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main area — fills remaining width, internal scroll */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Header — fixed at top of main area, never scrolls */}
        <PortalHeader onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Scrollable content area */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pb-20 md:pb-4">
          <div className="p-4 md:p-6 max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — fixed to viewport bottom */}
      <PortalBottomNav onMorePress={() => setMobileMenuOpen(true)} />
    </div>
  );
}

export default function PortalTokenLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const token = params?.token as string;

  return (
    <PortalProvider token={token}>
      <PortalShell>{children}</PortalShell>
    </PortalProvider>
  );
}
