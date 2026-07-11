'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, CheckSquare, BarChart, Settings, Mail, LogOut, Zap } from 'lucide-react';
import { getSession, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard',             label: 'Overview',        icon: LayoutDashboard },
  { href: '/dashboard/projects',    label: 'Projects',        icon: FileText },
  { href: '/dashboard/requests',    label: 'Change Requests', icon: CheckSquare },
  { href: '/dashboard/analytics',   label: 'Analytics',       icon: BarChart },
  { href: '/dashboard/emails',      label: 'Emails (Debug)',  icon: Mail },
  { href: '/dashboard/settings',    label: 'Settings',        icon: Settings },
];

// Plan display names and project limits
const PLAN_META: Record<string, { label: string; maxProjects: number }> = {
  free:       { label: 'Free Plan',       maxProjects: 3   },
  pro:        { label: 'Pro Plan',        maxProjects: 999 },
  enterprise: { label: 'Enterprise Plan', maxProjects: 999 },
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const [planLabel,   setPlanLabel]   = useState('Free Plan');
  const [maxProjects, setMaxProjects] = useState(3);
  const [usedProjects, setUsedProjects] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // 1. Get live session — never stale
      const auth = await getSession();
      if (!auth.user?.id) return;
      const uid = auth.user.id;
      setUserId(uid);

      // 2. Read real plan from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_plan')
        .eq('id', uid)
        .single();

      const slug = profile?.current_plan || 'free';
      const meta = PLAN_META[slug] ?? PLAN_META.free;
      setPlanLabel(meta.label);
      setMaxProjects(meta.maxProjects);

      // 3. Count projects owned by this user
      const { count } = await supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', uid);

      setUsedProjects(count ?? 0);
    };

    load();
  // Re-run whenever the path changes so counts stay fresh
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const pct = maxProjects >= 999 ? 0 : Math.min(100, (usedProjects / maxProjects) * 100);

  return (
    <div className="w-64 border-r border-white/10 flex flex-col sticky top-0 h-screen" style={{ background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="/assets/logo.png" alt="ScopeOS" width={28} height={28} className="rounded-md" />
          <span className="font-bold text-white text-lg tracking-tight">ScopeOS</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-blue-400' : 'text-white/40'} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 shrink-0">
        {/* Plan badge — real data from Supabase */}
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-blue-400">{planLabel}</span>
          </div>
          {maxProjects >= 999 ? (
            <p className="text-[10px] text-white/60">Unlimited projects</p>
          ) : (
            <>
              <p className="text-[10px] text-white/60 mb-2">
                Using {usedProjects} of {maxProjects} projects
              </p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
