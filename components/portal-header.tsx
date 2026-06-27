'use client';

import { usePathname } from 'next/navigation';
import { usePortal } from '@/components/portal-context';
import { Menu, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F4] flex items-center justify-between px-4 md:px-6 z-30 sticky top-0">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-[#94A3B8] hover:text-[#1E3058] hover:bg-slate-100 transition-colors md:hidden flex-shrink-0"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold text-[#0D1526] truncate tracking-tight">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Badge className={`hidden sm:flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
          project?.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
          project?.status === 'paused' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
          'bg-slate-50 text-[#64748B] border border-slate-200'
        }`}>
          {project?.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {project?.status === 'active' ? 'Active' : project?.status === 'paused' ? 'Paused' : 'Completed'}
        </Badge>
        
        <div className="h-8 w-px bg-[#E2E8F4] hidden sm:block mx-1" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm text-[#0D1526] leading-none mb-1">{project?.client_name || 'Client'}</p>
            <p className="text-[#64748B] text-xs leading-none">{project?.client_email || ''}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-sm">
            <span className="font-bold text-xs">{project?.client_name?.charAt(0) || 'C'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
