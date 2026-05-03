'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface FormErrorProps {
  message: string;
  fieldName?: string;
}

export function FormError({ message, fieldName }: FormErrorProps) {
  return (
    <div className="flex gap-2 text-sm text-destructive mt-1">
      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

interface ApiErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ApiError({ message = 'Something went wrong. Please try again.', onRetry }: ApiErrorProps) {
  return (
    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center justify-between gap-4">
      <div className="flex gap-3">
        <AlertCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
        <p className="text-sm text-destructive">{message}</p>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          Retry
        </Button>
      )}
    </div>
  );
}

export function NetworkError() {
  return (
    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
      <WifiOff size={20} className="text-amber-600 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-amber-900">Lost connection</p>
        <p className="text-xs text-amber-800">Retrying automatically...</p>
      </div>
    </div>
  );
}

export function ValidationError({ errors }: { errors: Record<string, string> }) {
  return (
    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 space-y-2">
      {Object.entries(errors).map(([field, message]) => (
        <div key={field} className="flex gap-2 text-sm text-destructive">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      ))}
    </div>
  );
}

export function OfflineMode() {
  return (
    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center gap-3">
      <Wifi size={20} className="text-blue-600 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-blue-900">You&apos;re offline</p>
        <p className="text-xs text-blue-800">Some features may be limited</p>
      </div>
    </div>
  );
}
