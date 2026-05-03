'use client';

import { useState, useEffect } from 'react';
import { subscribeToToasts, type Toast } from '@/lib/toast';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);

        return () => clearTimeout(timer);
      }
    });

    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-destructive" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" />;
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'error':
        return 'bg-destructive/5 border-destructive/30 text-destructive';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getStyles(
            toast.type
          )} pointer-events-auto animate-in slide-in-from-bottom-4 duration-300`}
          role="alert"
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          {toast.action && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                toast.action?.onClick();
                removeToast(toast.id);
              }}
              className="flex-shrink-0"
            >
              {toast.action.label}
            </Button>
          )}
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}
