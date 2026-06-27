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
      {/* Desktop Sidebar */}
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <DashboardNavbar />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
