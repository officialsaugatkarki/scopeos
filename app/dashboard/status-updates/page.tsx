'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Send, Clock, MessageSquare, Edit2, SkipForward, Calendar } from 'lucide-react';

export default function StatusUpdatesPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const [tone, setTone] = useState(50);
  const [detailLevel, setDetailLevel] = useState('standard');

  const upcomingUpdates = [
    {
      id: '1',
      project: 'Website Rebuild',
      client: 'Acme Corp',
      scheduled: 'Friday 5 PM',
      preview: 'Week 8 Progress Update',
      lastSent: null,
    },
    {
      id: '2',
      project: 'Mobile App',
      client: 'Tech Startup Inc',
      scheduled: 'Monday 10 AM',
      preview: 'Development Progress - Sprint 4',
      lastSent: null,
    },
  ];

  const pastUpdates = [
    {
      id: '1',
      project: 'Website Rebuild',
      sentDate: 'Jan 26, 2024',
      opened: true,
      replied: false,
      client: 'Acme Corp',
    },
    {
      id: '2',
      project: 'Mobile App',
      sentDate: 'Jan 19, 2024',
      opened: true,
      replied: true,
      client: 'Tech Startup Inc',
    },
  ];

  const generatedUpdate = `**Weekly Update - Website Rebuild**
*Week 8 of 12 | February 2, 2024*

**✓ Completed This Week:**
- Implemented responsive navigation (3 days)
- Completed contact form with validation (2 days)
- Fixed mobile layout issues (1 day)

**◆ In Progress:**
- Homepage hero section (80% complete)
- About page content integration (50% complete)

**□ Up Next:**
- Services page build
- Image optimization
- Performance testing

**Budget Status:**
Used: $32,000 of $50,000 (64%)
Timeline: On track for March 15 delivery
Scope: 3 change requests approved this month (+$4,200)

**Needs From You:**
- Final logo files (requested Jan 28)
- Team bios for About page

Let me know if you have questions!`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Client Status Updates</h1>
          <p className="text-muted-foreground">Automated progress updates for your clients</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 flex gap-2"
          onClick={() => setShowGenerator(true)}
        >
          <MessageSquare size={16} />
          Generate Update Now
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Updates</TabsTrigger>
          <TabsTrigger value="history">Update History</TabsTrigger>
        </TabsList>

        {/* UPCOMING UPDATES */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingUpdates.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No upcoming updates scheduled</p>
            </Card>
          ) : (
            upcomingUpdates.map((update) => (
              <Card key={update.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{update.project}</h3>
                      <Badge variant="outline">{update.client}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Scheduled: <span className="text-foreground font-medium">{update.scheduled}</span></p>
                    <p className="text-sm text-foreground">Preview: <span className="italic">{update.preview}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 size={16} className="mr-2" />
                      Edit Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send size={16} className="mr-2" />
                      Send Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <SkipForward size={16} className="mr-2" />
                      Skip
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* UPDATE HISTORY */}
        <TabsContent value="history">
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 text-muted-foreground font-medium">Project</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Sent</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Opened</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Replied</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastUpdates.map((update) => (
                    <tr key={update.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-foreground">{update.project}</p>
                          <p className="text-xs text-muted-foreground">{update.client}</p>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{update.sentDate}</td>
                      <td className="py-3">
                        <Badge variant={update.opened ? 'default' : 'secondary'}>
                          {update.opened ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Badge variant={update.replied ? 'default' : 'secondary'}>
                          {update.replied ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className="text-right py-3">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUpdate(update)}>
                          <Eye size={16} className="mr-2" />
                          View
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

      {/* UPDATE GENERATOR DIALOG */}
      {showGenerator && (
        <Dialog open={showGenerator} onOpenChange={setShowGenerator}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Status Update</DialogTitle>
              <DialogDescription>AI-powered update for Website Rebuild</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customization Controls */}
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">Tone</label>
                    <span className="text-sm text-muted-foreground">
                      {tone < 50 ? 'Formal' : tone > 50 ? 'Casual' : 'Balanced'}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={tone}
                    onChange={(e) => setTone(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Detail Level</label>
                  <div className="flex gap-2">
                    {['Brief', 'Standard', 'Detailed'].map((level) => (
                      <Button
                        key={level}
                        variant={detailLevel === level.toLowerCase() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setDetailLevel(level.toLowerCase())}
                        className="flex-1"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Include Sections</label>
                  <div className="space-y-2">
                    {['Completed Items', 'In Progress', 'Next Steps', 'Budget Status', 'Needs From Client'].map((section) => (
                      <label key={section} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm text-foreground">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Update Preview */}
              <div className="p-4 bg-muted rounded-lg border">
                <p className="text-sm font-medium text-foreground mb-3">Generated Update:</p>
                <div className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                  {generatedUpdate}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowGenerator(false)}>Close</Button>
                <Button variant="outline">
                  <Eye size={16} className="mr-2" />
                  Preview Email
                </Button>
                <Button variant="outline">
                  <Calendar size={16} className="mr-2" />
                  Schedule
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  <Send size={16} className="mr-2" />
                  Send Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
