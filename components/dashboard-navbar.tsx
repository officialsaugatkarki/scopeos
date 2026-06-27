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
    <div
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-40"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-6 flex-1">
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        <div className="hidden md:flex relative flex-1 max-w-sm ml-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder="Search projects, requests..."
            className="pl-10 h-10 bg-white/5 border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-white/10 text-white placeholder:text-white/40 transition-all rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <NotificationCenter />
        
        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm text-white leading-none mb-1 group-hover:text-blue-400 transition-colors">
              {user?.name || 'User'}
            </p>
            <p className="text-white/50 text-xs leading-none">
              {user?.email || 'user@agency.com'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-sm group-hover:bg-white/10 transition-all">
            <User size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
