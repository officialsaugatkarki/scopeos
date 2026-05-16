'use client';

import { usePathname } from 'next/navigation';
import { usePortal } from '@/components/portal-context';
import { Menu, Zap } from 'lucide-react';

interface PortalHeaderProps {
  onMenuToggle?: () => void;
}

const pageNames: Record<string, string> = {
  '': 'Dashboard',
  '/chat': 'AI Chat',
  '/messages': 'Team Chat',
  '/requests': 'Requests',
  '/changes': 'Change Requests',
  '/project': 'Project Details',
  '/files': 'Files',
  '/settings': 'Settings',
};

export function PortalHeader({ onMenuToggle }: PortalHeaderProps) {
  const pathname = usePathname();
  const { project, token } = usePortal();

  const basePath = `/portal/p/${token}`;
  const subPath = pathname.replace(basePath, '') || '';
  const pageTitle = pageNames[subPath] || 'Portal';

  return (
    <div className="h-14 flex-shrink-0 bg-[#0A0F1C]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-4 md:px-6 z-30">
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors md:hidden flex-shrink-0"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-white truncate">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {project?.status === 'active' ? 'Active' : project?.status === 'paused' ? 'Paused' : 'Completed'}
        </span>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Zap size={14} />
        </div>
        <div className="text-sm hidden sm:block">
          <p className="font-medium text-white/80 text-xs">{project?.client_name || 'Client'}</p>
          <p className="text-white/30 text-[10px]">{project?.client_email || ''}</p>
        </div>
      </div>
    </div>
  );
}
