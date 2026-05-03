'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Plug,
  Users,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

interface DashboardSidebarProps {
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function DashboardSidebar({ isCollapsed = false, onCollapsedChange }: DashboardSidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
    { icon: Inbox, label: 'Requests', href: '/dashboard/requests' },
    { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: MessageSquare, label: 'Status Updates', href: '/dashboard/status-updates' },
    { icon: Mail, label: 'Emails', href: '/dashboard/emails' },
    { icon: Users, label: 'Team', href: '/dashboard/team' },
    { icon: Plug, label: 'Integrations', href: '/dashboard/integrations' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-6 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
          SG
        </div>
        {!collapsed && <span className="font-bold text-lg text-foreground">ScopeGuard</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors ${
                collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-border p-4 space-y-2 ${collapsed ? '' : ''}`}>
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
