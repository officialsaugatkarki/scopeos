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
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0A0F1C]/95 backdrop-blur-xl border-t border-white/[0.04] z-50 md:hidden">
      <div className="flex h-full items-center justify-around px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                active ? 'text-blue-400' : 'text-white/30'
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={onMorePress}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            isMoreActive ? 'text-blue-400' : 'text-white/30'
          }`}
        >
          <MoreHorizontal size={22} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
