'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, MessageSquare, BookOpen, Send } from 'lucide-react';

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 md:bottom-6 right-4 md:right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Open help">
        <HelpCircle size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-40 md:bottom-24 right-4 md:right-6 w-[calc(100vw-32px)] sm:w-80 rounded-xl shadow-2xl glass-card-strong border border-white/[0.06] z-40 slide-in-from-bottom-4">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="font-semibold text-white">How can we help?</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/[0.04] rounded transition-colors text-white/30 hover:text-white/60" aria-label="Close help widget">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-white/[0.06]">
            <input type="text" placeholder="Search help..."
              className="w-full px-3 py-2 text-sm dark-input rounded-lg" />
          </div>

          <div className="p-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.04]">
              <BookOpen size={16} className="text-blue-400" /> Documentation
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.04]">
              <MessageSquare size={16} className="text-blue-400" /> Contact Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.04]">
              <Send size={16} className="text-blue-400" /> Request Feature
            </Button>
          </div>

          <div className="p-4 border-t border-white/[0.06] bg-white/[0.01]">
            <p className="text-xs text-white/20 text-center">Average response time: 24 hours</p>
          </div>
        </div>
      )}
    </>
  );
}
