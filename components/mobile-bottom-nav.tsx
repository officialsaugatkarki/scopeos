'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Inbox, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut,
  Zap
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getSession, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  { icon: Inbox, label: 'Requests', href: '/dashboard/requests' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
];

const menuNavItems = [
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

const PLAN_META: Record<string, { label: string }> = {
  free: { label: 'Free Plan' },
  pro: { label: 'Pro Plan' },
  enterprise: { label: 'Enterprise Plan' },
};

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [planLabel, setPlanLabel] = useState('Free Plan');
  
  useEffect(() => {
    // Close the sheet when navigation occurs
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const loadData = async () => {
      const auth = await getSession();
      if (!auth.user?.id) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_plan')
        .eq('id', auth.user.id)
        .single();
        
      const slug = profile?.current_plan || 'free';
      setPlanLabel(PLAN_META[slug]?.label ?? 'Free Plan');
    };
    loadData();
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const isRouteActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0F1C]/95 backdrop-blur-xl border-t border-white/[0.04] md:hidden z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="flex h-full items-center justify-around px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                  isActive ? 'text-blue-400' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Icon size={22} className={isActive ? 'fill-blue-500/20' : ''} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-white/40 hover:text-white/70">
                <Menu size={22} />
                <span className="text-[10px] font-medium">Menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-[#0D1526] border-t border-white/10 rounded-t-2xl p-0 h-[80vh] flex flex-col text-white">
              <SheetHeader className="p-4 border-b border-white/10 text-left">
                <SheetTitle className="text-white text-lg font-bold">Menu</SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {menuNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'text-blue-400' : 'text-white/40'} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">{planLabel}</span>
                  </div>
                  <Link href="/dashboard/settings" className="text-xs text-blue-400 hover:underline">
                    Upgrade
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
