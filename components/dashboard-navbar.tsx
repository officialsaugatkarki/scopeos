'use client';

import { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left - Title & Search */}
      <div className="flex items-center gap-6 flex-1">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <div className="hidden md:flex relative flex-1 max-w-xs">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 h-9 bg-primary/5 border-transparent focus:border-primary"
          />
        </div>
      </div>

      {/* Right - Notifications & Profile */}
      <div className="flex items-center gap-4">
        <NotificationCenter />

        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
          <User size={16} />
        </div>

        <div className="text-sm">
          <p className="font-medium text-foreground">{user?.name || 'User'}</p>
          <p className="text-muted-foreground text-xs">{user?.email || 'user@agency.com'}</p>
        </div>
      </div>
    </div>
  );
}
