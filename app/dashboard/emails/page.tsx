'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailPreviewModal } from '@/components/email-preview-modal';
import { PMNotificationList } from '@/components/pm-notification-list';
import { emailTemplates, pmNotificationTemplates, EmailTemplate, EmailContext } from '@/lib/email-templates';
import { Send, Settings, Archive, Trash2 } from 'lucide-react';

export default function EmailsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');

  const mockContext: Partial<EmailContext> = {
    clientName: 'John Smith',
    agencyName: 'Creative Agency',
    pmName: 'Sarah Johnson',
    projectName: 'Website Redesign',
    portalLink: 'https://portal.scopeguard.ai/projects/proj-1',
    magicEmail: 'magic-email@requests.scopeguard.ai',
    requestTitle: 'Add customer testimonials section',
    requestDescription: 'Add a carousel with customer testimonials and photos',
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  const handleSendEmail = (data: any) => {
    console.log('Sending email:', data);
    alert('Email sent successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Emails & Communications</h1>
        <p className="text-muted-foreground">Manage client emails and PM notifications</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
          <TabsTrigger value="notifications">PM Notifications</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        {/* EMAIL TEMPLATES TAB */}
        <TabsContent value="templates" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(emailTemplates).map((template) => (
              <Card key={template.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.category === 'client' ? 'Client Email' : 'PM Notification'}
                    </p>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>

                <div className="bg-muted p-3 rounded text-sm text-muted-foreground mb-4 line-clamp-2">
                  Subject: {template.subject}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleTemplateSelect(template)}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Send size={16} className="mr-2" />
                    Send
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* PM NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notification Stats */}
            <div className="lg:col-span-1 space-y-3">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <p className="text-sm text-blue-600 font-medium mb-1">Unread Notifications</p>
                <p className="text-3xl font-bold text-blue-900">2</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <p className="text-sm text-amber-600 font-medium mb-1">Pending Action</p>
                <p className="text-3xl font-bold text-amber-900">1</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                <p className="text-sm text-emerald-600 font-medium mb-1">This Week</p>
                <p className="text-3xl font-bold text-emerald-900">7</p>
              </Card>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Recent Notifications</h3>
                <Button variant="ghost" size="sm">
                  Mark all as read
                </Button>
              </div>
              <PMNotificationList />
            </div>
          </div>
        </TabsContent>

        {/* EMAIL HISTORY TAB */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">To</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      to: 'john@acme.com',
                      subject: 'Request Received: Add testimonials',
                      type: 'Confirmation',
                      status: 'Delivered',
                      date: '2 hours ago',
                    },
                    {
                      to: 'sarah@techstartup.com',
                      subject: 'Quick questions about: Analytics Integration',
                      type: 'Clarification',
                      status: 'Delivered',
                      date: '4 hours ago',
                    },
                    {
                      to: 'mike@designstudio.com',
                      subject: 'Approved: Website redesign',
                      type: 'Approval',
                      status: 'Delivered',
                      date: '1 day ago',
                    },
                    {
                      to: 'team@acme.com',
                      subject: 'Weekly Update: Website Redesign',
                      type: 'Status Update',
                      status: 'Delivered',
                      date: '3 days ago',
                    },
                  ].map((email, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="py-3 px-4">{email.to}</td>
                      <td className="py-3 px-4 text-foreground font-medium">{email.subject}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{email.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{email.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{email.date}</td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Archive size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* EMAIL PREVIEW MODAL */}
      {selectedTemplate && (
        <EmailPreviewModal
          open={showPreview}
          onOpenChange={setShowPreview}
          template={selectedTemplate}
          context={mockContext}
          onSend={handleSendEmail}
        />
      )}
    </div>
  );
}
