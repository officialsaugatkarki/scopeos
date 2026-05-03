'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles } from 'lucide-react';

export interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export function SuccessModal({
  open,
  onOpenChange,
  title,
  message,
  actionLabel,
  onAction,
  autoClose = true,
  autoCloseDuration = 3000,
}: SuccessModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onOpenChange(false);
          setIsClosing(false);
        }, 300);
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [open, autoClose, autoCloseDuration, onOpenChange]);

  const handleAction = () => {
    onAction?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <DialogHeader>
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative mb-4">
              {/* Sparkles animation */}
              <div className="absolute inset-0 animate-pulse">
                <Sparkles className="w-12 h-12 text-yellow-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              {/* Check circle */}
              <div className="checkmark-draw">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
            <DialogTitle className="text-2xl mt-4">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="text-center px-4 py-2">
          <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
        </div>

        {actionLabel && onAction && (
          <div className="flex gap-2 justify-center pt-4">
            <Button
              onClick={handleAction}
              className="bg-primary hover:bg-primary/90"
            >
              {actionLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
