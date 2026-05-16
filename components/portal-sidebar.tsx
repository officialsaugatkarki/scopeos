'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePortal } from '@/components/portal-context';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  DollarSign,
  FolderOpen,
  Upload,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from 'lucide-react';

interface PortalSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function PortalSidebar({ mobileOpen = false, onMobileClose }: PortalSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { project, token } = usePortal();

  const basePath = `/portal/p/${token}`;

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: basePath },
    { label: 'AI Chat', icon: Zap, href: `${basePath}/chat` },
    { label: 'Team Chat', icon: Users, href: `${basePath}/messages` },
    { label: 'Requests', icon: FileText, href: `${basePath}/requests` },
    { label: 'Changes', icon: DollarSign, href: `${basePath}/changes` },
    { label: 'Project', icon: FolderOpen, href: `${basePath}/project` },
    { label: 'Files', icon: Upload, href: `${basePath}/files` },
    { label: 'Settings', icon: Settings, href: `${basePath}/settings` },
  ];

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname.startsWith(href);
  };

  const handleNav = (href: string) => {
    router.push(href);
    onMobileClose?.();
  };

  const sidebarContent = (
    <>
      {/* Logo + Project */}
      <div className={`h-14 flex-shrink-0 flex items-center border-b border-white/[0.04] ${collapsed ? 'px-3 justify-center' : 'px-4'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-white/90 text-sm truncate">{project?.name || 'Portal'}</p>
              <p className="text-[10px] text-white/30 truncate">Client Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation — scrollable if items overflow */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom collapse toggle (desktop only) */}
      <div className="flex-shrink-0 p-3 border-t border-white/[0.04] hidden md:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/20 hover:text-white/40 hover:bg-white/[0.04] transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — fixed height, flex column, internal scroll on nav only */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-full bg-[#0A0F1C] border-r border-white/[0.04] transition-all duration-300 overflow-hidden ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0A0F1C] border-r border-white/[0.04] z-[60] md:hidden flex flex-col animate-in slide-in-from-left duration-300">
            <div className="absolute top-3 right-3 z-10">
              <button onClick={onMobileClose} className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors">
                <X size={18} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
