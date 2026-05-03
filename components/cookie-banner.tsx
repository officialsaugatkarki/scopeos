'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasCookieConsent = localStorage.getItem('cookie-consent');
    if (!hasCookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleManage = () => {
    // Open cookie preferences modal
    console.log('Open cookie preferences');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm text-foreground">
          We use cookies to enhance your experience. By continuing, you agree to our{' '}
          <a href="#" className="underline text-primary hover:text-primary/80">
            Privacy Policy
          </a>
          .
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={handleManage}>
          Manage
        </Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleAccept}>
          Accept
        </Button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-muted rounded"
          aria-label="Close cookie banner"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
