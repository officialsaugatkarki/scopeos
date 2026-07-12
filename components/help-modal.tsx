'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GLOBAL_SHORTCUTS, REQUEST_SHORTCUTS } from '@/lib/keyboard-shortcuts';
import { HelpCircle, Keyboard, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpModal({ isOpen, onOpenChange }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState('shortcuts');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        onOpenChange(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle size={24} className="text-primary" />
            Help & Support
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full overflow-x-auto scrollbar-none justify-start rounded-xl p-1">
            <TabsTrigger value="shortcuts" className="flex items-center gap-2">
              <Keyboard size={16} />
              <span className="hidden sm:inline">Shortcuts</span>
            </TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="shortcuts" className="space-y-4 mt-4">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Global Shortcuts</h3>
              <div className="space-y-2">
                {GLOBAL_SHORTCUTS.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-foreground mb-3">Request Shortcuts</h3>
              <div className="space-y-2">
                {REQUEST_SHORTCUTS.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-foreground mb-1">How do I create a project?</h4>
              <p className="text-sm text-muted-foreground">Navigate to Projects and click "New Project". Follow the 4-step wizard to set up your project, scope baseline, and client portal.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">How does the AI scope analysis work?</h4>
              <p className="text-sm text-muted-foreground">When a client submits a request, our AI analyzes it against your project scope document and classifies it as in-scope, out-of-scope, or needing clarification.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Can I customize email templates?</h4>
              <p className="text-sm text-muted-foreground">Yes! Go to Emails to preview and customize all client-facing and internal email templates before sending.</p>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText size={16} />
                Getting Started Guide
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText size={16} />
                API Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText size={16} />
                Best Practices
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                <MessageSquare size={16} />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare size={16} />
                Report a Bug
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare size={16} />
                Request a Feature
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">Average response time: 24 hours</p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
