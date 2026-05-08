'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasCookieConsent = localStorage.getItem('cookie-consent');
    if (!hasCookieConsent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleManage = () => {
    console.log('Open cookie preferences');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0F1C]/95 backdrop-blur-xl border-t border-white/[0.04] p-4 z-50 flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm text-white/60">
          We use cookies to enhance your experience. By continuing, you agree to our{' '}
          <a href="#" className="underline text-blue-400 hover:text-blue-300">Privacy Policy</a>.
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={handleManage}
          className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
          Manage
        </Button>
        <Button size="sm" className="btn-gradient text-white border-0" onClick={handleAccept}>
          Accept
        </Button>
        <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/[0.04] rounded text-white/30 hover:text-white/60" aria-label="Close cookie banner">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
