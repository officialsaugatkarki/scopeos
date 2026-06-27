'use client';

import { usePathname, useRouter } from 'next/navigation';
import { usePortal } from '@/components/portal-context';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  DollarSign,
  MoreHorizontal,
} from 'lucide-react';

interface PortalBottomNavProps {
  onMorePress?: () => void;
}

export function PortalBottomNav({ onMorePress }: PortalBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { token } = usePortal();

  const basePath = `/portal/p/${token}`;

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', href: basePath },
    { icon: MessageSquare, label: 'Chat', href: `${basePath}/chat` },
    { icon: FileText, label: 'Requests', href: `${basePath}/requests` },
    { icon: DollarSign, label: 'Changes', href: `${basePath}/changes` },
  ];

  const isActive = (href: string) => {
    if (href === basePath) return pathname === basePath;
    return pathname.startsWith(href);
  };

  const isMoreActive = ['/project', '/files', '/settings', '/messages'].some(p => pathname.startsWith(`${basePath}${p}`));

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-[#E2E8F4] z-50 md:hidden shadow-[0_-4px_24px_rgba(13,21,38,0.04)]">
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
                active ? 'text-[#2563EB]' : 'text-[#94A3B8] hover:text-[#0D1526]'
              }`}
            >
              <div className={`p-1 rounded-full transition-all ${active ? 'bg-blue-50' : ''}`}>
                <Icon size={20} className={active ? 'scale-110 transition-transform' : ''} />
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-[#2563EB]' : ''}`}>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onMorePress}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${
            isMoreActive ? 'text-[#2563EB]' : 'text-[#94A3B8] hover:text-[#0D1526]'
          }`}
        >
          <div className={`p-1 rounded-full transition-all ${isMoreActive ? 'bg-blue-50' : ''}`}>
             <MoreHorizontal size={20} className={isMoreActive ? 'scale-110 transition-transform' : ''} />
          </div>
          <span className={`text-[10px] font-semibold ${isMoreActive ? 'text-[#2563EB]' : ''}`}>More</span>
        </button>
      </div>
    </nav>
  );
}
