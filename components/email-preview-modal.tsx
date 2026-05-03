'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Send, SaveIcon, X } from 'lucide-react';
import { EmailTemplate, EmailContext } from '@/lib/email-templates';

interface EmailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: EmailTemplate;
  context: Partial<EmailContext>;
  onSend: (data: any) => void;
}

export function EmailPreviewModal({
  open,
  onOpenChange,
  template,
  context,
  onSend,
}: EmailPreviewModalProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [editedSubject, setEditedSubject] = useState(interpolateTemplate(template.subject, context));
  const [editedBody, setEditedBody] = useState(template.htmlBody);
  const [toEmail, setToEmail] = useState(context.clientEmail || '');
  const [ccEmail, setCcEmail] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  function interpolateTemplate(text: string, ctx: any): string {
    let result = text;
    Object.entries(ctx).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
    });
    return result;
  }

  const renderedHtml = interpolateTemplate(editedBody, context);
  const renderedSubject = interpolateTemplate(editedSubject, context);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Email Preview: {template.name}</DialogTitle>
          <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* PREVIEW TAB */}
          <TabsContent value="preview" className="flex-1 overflow-auto">
            <div className="p-6 space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Subject:</label>
                <input
                  type="text"
                  value={renderedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>

              <div className="bg-white border border-border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={renderedHtml}
                  className="w-full h-96 border-0"
                  title="Email Preview"
                />
              </div>

              <div className="text-xs text-muted-foreground">
                Preview is responsive and will display correctly on mobile devices.
              </div>
            </div>
          </TabsContent>

          {/* EDIT TAB */}
          <TabsContent value="edit" className="flex-1 overflow-auto">
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Subject Line:</label>
                <input
                  type="text"
                  value={editedSubject}
                  onChange={(e) => setEditedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Email Body (HTML):</label>
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm font-mono h-64"
                />
              </div>

              <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                <strong>Available variables:</strong> {template.variables.join(', ')}
              </div>
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="flex-1 overflow-auto">
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">To:</label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">CC (optional):</label>
                <input
                  type="email"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  placeholder="team@agency.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Send Time:</label>
                <select
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                >
                  <option value="">Send immediately</option>
                  <option value="in-1-hour">In 1 hour</option>
                  <option value="tomorrow-9am">Tomorrow at 9 AM</option>
                  <option value="in-3-days">In 3 days</option>
                </select>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full mb-2">
                  <SaveIcon size={16} className="mr-2" />
                  Save as Template
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 p-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(renderedHtml);
            }}
            className="flex-1"
          >
            <Copy size={16} className="mr-2" />
            Copy HTML
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSend({
                subject: editedSubject,
                html: editedBody,
                to: toEmail,
                cc: ccEmail,
                scheduleTime,
              });
              onOpenChange(false);
            }}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Send size={16} className="mr-2" />
            Send Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
