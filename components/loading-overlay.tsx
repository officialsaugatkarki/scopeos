'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  fullScreen = false,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 bg-black/50 backdrop-blur-sm rounded-lg',
        fullScreen && 'fixed inset-0 z-50',
        !fullScreen && 'absolute inset-0'
      )}
    >
      <Loader2 className="w-6 h-6 text-white animate-spin" />
      <p className="text-white font-medium">{message}</p>
    </div>
  );
}
