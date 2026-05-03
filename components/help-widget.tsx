'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X, MessageSquare, BookOpen, Send } from 'lucide-react';

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
        aria-label="Open help"
      >
        <HelpCircle size={24} />
      </button>

      {/* Help Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 rounded-lg shadow-2xl bg-background border border-border z-40 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground">How can we help?</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="Close help widget"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <input
              type="text"
              placeholder="Search help..."
              className="w-full px-3 py-2 text-sm border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Quick Links */}
          <div className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <BookOpen size={16} />
              Documentation
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <MessageSquare size={16} />
              Contact Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
              <Send size={16} />
              Request Feature
            </Button>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground text-center">Average response time: 24 hours</p>
          </div>
        </div>
      )}
    </>
  );
}
