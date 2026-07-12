'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { getSession, initAuth } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await getSession();
      if (!auth.isAuthenticated) {
        router.push('/login');
      } else {
        // Initialize the cached auth state for components that use getAuthData()
        await initAuth();
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden text-foreground" style={{ background: 'transparent' }}>
      <div className="hidden md:flex shrink-0">
        <DashboardSidebar />
      </div>
      <div className="flex-1 flex min-w-0 flex-col overflow-hidden relative">
        <DashboardNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8 w-full max-w-full">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
