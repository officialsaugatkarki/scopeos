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
      <div className={`h-16 flex-shrink-0 flex items-center border-b border-[#E2E8F4] ${collapsed ? 'px-3 justify-center' : 'px-4'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0 w-full px-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1A56DB] flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white font-bold text-xs">SG</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-[#0D1526] text-sm truncate leading-tight">{project?.name || 'Client Portal'}</p>
              <p className="text-[10px] text-[#64748B] truncate uppercase tracking-widest font-semibold mt-0.5">Secure Workspace</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation — scrollable if items overflow */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-5 px-3 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                active
                  ? 'bg-blue-50 text-[#2563EB] shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E3058] hover:bg-slate-50'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className={`flex-shrink-0 transition-colors ${active ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#1E3058]'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom collapse toggle (desktop only) */}
      <div className="flex-shrink-0 p-3 border-t border-[#E2E8F4] hidden md:block bg-slate-50/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-[#1E3058] hover:bg-slate-100 transition-all"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 h-full bg-white border-r border-[#E2E8F4] transition-all duration-300 overflow-hidden z-50 ${
          collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-[#0D1526]/40 backdrop-blur-sm z-[60] md:hidden"
            onClick={onMobileClose}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-white border-r border-[#E2E8F4] z-[60] md:hidden flex flex-col shadow-xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-3 right-3 z-10">
              <button onClick={onMobileClose} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E3058] hover:bg-slate-100 transition-colors">
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
