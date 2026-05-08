'use client';

import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getAuthData } from '@/lib/auth';
import NotificationCenter from '@/components/notification-center';

interface DashboardNavbarProps {
  title?: string;
}

export function DashboardNavbar({ title = 'Dashboard' }: DashboardNavbarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuthData();
    setUser(auth.user);
  }, []);

  return (
    <div className="h-16 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-6 flex-1">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        <div className="hidden md:flex relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <Input type="text" placeholder="Search..." className="pl-10 h-9 dark-input rounded-lg text-sm" />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <NotificationCenter />
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <User size={16} />
        </div>
        <div className="text-sm hidden sm:block">
          <p className="font-medium text-white/80">{user?.name || 'User'}</p>
          <p className="text-white/30 text-xs">{user?.email || 'user@agency.com'}</p>
        </div>
      </div>
    </div>
  );
}
