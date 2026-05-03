'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emailTemplates, EmailTemplate, EmailContext, interpolateTemplate } from '@/lib/email-templates';
import { Mail, Eye, Copy } from 'lucide-react';

export default function EmailsDemoPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const mockContext: Partial<EmailContext> = {
    clientName: 'John Smith',
    agencyName: 'Creative Agency',
    pmName: 'Sarah Johnson',
    projectName: 'Website Redesign',
    portalLink: 'https://portal.scopeguard.ai/projects/proj-1',
    magicEmail: 'requests@agency.com',
    requestTitle: 'Add customer testimonials section',
    requestDescription: 'We want to add a section on the homepage showcasing customer testimonials with photos and ratings.',
    changeRequestNumber: 'CR-001',
    costImpact: '$2,400 - $3,600',
    timelineImpact: '+2 weeks',
    estimatedHours: '12-16',
    acceptanceCriteria: [
      'Testimonials display in responsive carousel',
      'Photos load correctly on all devices',
      'Star ratings visible next to each testimonial',
      'Works on mobile, tablet, and desktop'
    ],
    approvalLink: 'https://portal.scopeguard.ai/approve-cr-001',
    calendarLink: 'https://calendly.com/agency/call',
    kickoffDate: 'January 15, 2024',
    launchDate: 'April 15, 2024',
    projectDuration: '12 weeks',
    assetsNeeded: 'High-res testimonial photos',
    assetsDueDate: 'January 17, 2024',
    crAmount: '$3,200',
    newDeliveryDate: 'April 20, 2024',
    newProjectTotal: '$53,200',
  };

  const templateDetails: Record<string, { category: string; description: string; useCase: string }> = {
    'client-invitation': {
      category: 'Onboarding',
      description: 'Sent to invite clients to their project portal for the first time',
      useCase: 'When a new project is created and portal access needs to be granted',
    },
    'request-received': {
      category: 'Confirmation',
      description: 'Automatic confirmation sent when client submits a request',
      useCase: 'Immediately after a request is submitted through portal or email',
    },
    'clarification-needed': {
      category: 'Action Required',
      description: 'Sent when AI analysis needs more information from the client',
      useCase: 'When scope decision requires clarification questions answered',
    },
    'approved-in-scope': {
      category: 'Decision',
      description: 'Notifies client that their request is approved and in scope',
      useCase: 'When AI analysis confirms request is within project scope',
    },
    'change-request': {
      category: 'Decision',
      description: 'Sent when request is out-of-scope with change request proposal',
      useCase: 'When feature requires separate contract or additional investment',
    },
    'change-request-approved': {
      category: 'Update',
      description: 'Confirms change request approval and next steps',
      useCase: 'After client approves a change request',
    },
    'weekly-status-update': {
      category: 'Regular Update',
      description: 'AI-generated weekly progress update for client',
      useCase: 'Sent every Friday with progress, budget, and timeline status',
    },
    'project-kickoff': {
      category: 'Onboarding',
      description: 'Sent when project officially starts with timeline and resources',
      useCase: 'At the beginning of project after all agreements signed',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Email Templates Demo</h1>
        <p className="text-muted-foreground">Browse and preview all email templates used in ScopeGuard</p>
      </div>

      {viewMode === 'grid' ? (
        <>
          <div className="flex justify-end gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              size="sm"
            >
              Grid View
            </Button>
            <Button
              variant={viewMode === 'detail' ? 'default' : 'outline'}
              onClick={() => setViewMode('detail')}
              size="sm"
            >
              Detail View
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(emailTemplates).map((template) => {
              const details = templateDetails[template.id];
              return (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <Badge>{details.category}</Badge>
                  </div>

                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {template.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {details.description}
                  </p>

                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded mb-4">
                    <strong>Subject:</strong> {template.subject.substring(0, 50)}...
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
                    <Eye size={14} className="mr-2" />
                    Preview
                  </Button>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Tabs value={selectedTemplate?.id || ''} onValueChange={(id) => {
          const template = Object.values(emailTemplates).find(t => t.id === id);
          setSelectedTemplate(template || null);
        }}>
          <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8">
            {Object.values(emailTemplates).map((template) => (
              <TabsTrigger key={template.id} value={template.id} className="text-xs">
                {template.name.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.values(emailTemplates).map((template) => (
            <TabsContent key={template.id} value={template.id} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Template Info */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">{template.name}</h3>

                    {templateDetails[template.id] && (
                      <>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-muted-foreground">
                            <strong>Category:</strong> {templateDetails[template.id].category}
                          </p>
                          <p className="text-sm text-foreground">
                            {templateDetails[template.id].description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            <strong>When to use:</strong> {templateDetails[template.id].useCase}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Variables used:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.slice(0, 5).map((v) => (
                          <Badge key={v} variant="secondary" className="text-xs">
                            {v}
                          </Badge>
                        ))}
                        {template.variables.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.variables.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button className="w-full mt-4" size="sm">
                      <Copy size={14} className="mr-2" />
                      Copy Template
                    </Button>
                  </Card>
                </div>

                {/* Template Preview */}
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden">
                    <div className="bg-muted p-4">
                      <p className="text-xs text-muted-foreground mb-1">Subject Line</p>
                      <p className="font-medium text-foreground">
                        {interpolateTemplate(template.subject, mockContext)}
                      </p>
                    </div>

                    <iframe
                      srcDoc={interpolateTemplate(template.htmlBody, mockContext)}
                      className="w-full h-96 border-0"
                      title="Email Preview"
                    />
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Selected Template Detail View */}
      {selectedTemplate && viewMode === 'grid' && (
        <div className="space-y-6 mt-8 border-t pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Template Info */}
            <div>
              <Card className="p-6 sticky top-6">
                <h3 className="font-semibold text-foreground mb-4">{selectedTemplate.name}</h3>

                {templateDetails[selectedTemplate.id] && (
                  <>
                    <div className="space-y-2 mb-4 pb-4 border-b">
                      <Badge className="w-full text-center justify-center">
                        {templateDetails[selectedTemplate.id].category}
                      </Badge>
                      <p className="text-sm text-foreground">
                        {templateDetails[selectedTemplate.id].description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Use:</strong> {templateDetails[selectedTemplate.id].useCase}
                      </p>
                    </div>
                  </>
                )}

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <p className="text-xs font-medium text-muted-foreground">Variables:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.variables.map((v) => (
                      <Badge key={v} variant="secondary" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  <Copy size={14} className="mr-2" />
                  Copy Template
                </Button>
              </Card>
            </div>

            {/* Email Preview */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden">
                <div className="bg-muted p-4">
                  <p className="text-xs text-muted-foreground mb-1">Subject Line</p>
                  <p className="font-medium text-foreground break-words">
                    {interpolateTemplate(selectedTemplate.subject, mockContext)}
                  </p>
                </div>

                <iframe
                  srcDoc={interpolateTemplate(selectedTemplate.htmlBody, mockContext)}
                  className="w-full h-[600px] border-0"
                  title="Email Preview"
                />
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
