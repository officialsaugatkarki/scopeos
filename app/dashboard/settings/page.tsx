'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Copy, Trash2, Plus, Download } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [apiKeys] = useState([
    { id: '1', name: 'Production Key', created: 'Jan 15, 2024', lastUsed: '2 hours ago' },
  ]);
  const [notifications, setNotifications] = useState({
    newRequest: true,
    clarification: true,
    outOfScope: true,
    approved: true,
    weeklySummary: false,
    mentions: false,
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and workspace preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="agency">Agency</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>

            <div className="space-y-6">
              {/* Avatar Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Avatar</label>
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:shadow-lg transition-shadow">
                    JS
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex gap-2">
                      <Upload size={16} />
                      Upload
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                  <Input placeholder="John Smith" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                  <Input placeholder="john@agency.com" type="email" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                <Input value="Admin" disabled className="bg-muted" />
              </div>

              {/* Preferences */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Timezone</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md text-sm">
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Date Format</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md text-sm">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
                <select className="w-full px-3 py-2 border border-input rounded-md text-sm max-w-xs">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>

              {/* Password Change */}
              <div className="border-t pt-6">
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* AGENCY SETTINGS TAB */}
        <TabsContent value="agency" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Agency Settings</h2>

            <div className="space-y-6">
              {/* Agency Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Agency Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Agency Name</label>
                    <Input placeholder="Your Agency Name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded border border-dashed border-primary/30 flex items-center justify-center bg-muted">
                        📷
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload size={16} className="mr-2" />
                          Upload
                        </Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Website</label>
                    <Input placeholder="https://youragency.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Default Hourly Rate</label>
                      <Input placeholder="$150" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Currency</label>
                      <select className="w-full px-3 py-2 border border-input rounded-md text-sm">
                        <option>USD</option>
                        <option>EUR</option>
                        <option>GBP</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">AI Settings</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Confidence Threshold</label>
                      <span className="text-lg font-bold text-primary">85%</span>
                    </div>
                    <input type="range" min="0" max="100" defaultValue="85" className="w-full" />
                    <p className="text-xs text-muted-foreground mt-2">Auto-approve in-scope requests above this threshold. Requests below need manual review.</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Scope Sensitivity</label>
                    <div className="flex gap-2">
                      {['Low', 'Medium', 'High'].map((level) => (
                        <Button
                          key={level}
                          variant={level === 'Medium' ? 'default' : 'outline'}
                          className="flex-1"
                          size="sm"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">How strict should AI be with scope boundaries?</p>
                  </div>
                </div>
              </div>

              {/* Email Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Email Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">From Name</label>
                    <Input placeholder="ScopeGuard Team" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Reply-to Email</label>
                    <Input placeholder="noreply@agency.com" type="email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email Signature</label>
                    <textarea className="w-full px-3 py-2 border border-input rounded-md text-sm" rows={4} placeholder="Add your email signature..." />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* BILLING TAB */}
        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">Current Plan</h3>
              <div className="mb-6">
                <p className="text-3xl font-bold text-foreground">Growth Plan</p>
                <p className="text-xl text-primary font-semibold mt-1">$299/month</p>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Projects</span>
                    <span className="text-sm font-medium text-foreground">7/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-primary rounded-full" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Requests</span>
                    <span className="text-sm font-medium text-foreground">142/200</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[71%] bg-primary rounded-full" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90">Upgrade Plan</Button>
                <Button variant="outline" className="flex-1">Manage Billing</Button>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
              <div className="mb-6 p-4 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visa</p>
                  <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                </div>
                <span className="text-xs text-muted-foreground">Expires 12/25</span>
              </div>
              <Button variant="outline" className="w-full">Update Payment Method</Button>
            </Card>
          </div>

          {/* Billing History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Billing History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: 'Jan 1, 2024', amount: '$299', status: 'Paid' },
                    { date: 'Dec 1, 2023', amount: '$299', status: 'Paid' },
                    { date: 'Nov 1, 2023', amount: '$199', status: 'Paid' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3">{row.date}</td>
                      <td className="py-3 font-medium">{row.amount}</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700">
                          {row.status}
                        </Badge>
                      </td>
                      <td className="text-right py-3">
                        <Button variant="ghost" size="sm">
                          <Download size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Notification Preferences</h2>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'newRequest', label: 'New request received' },
                    { key: 'clarification', label: 'Request needs clarification' },
                    { key: 'outOfScope', label: 'Out-of-scope request detected' },
                    { key: 'approved', label: 'Change request approved by client' },
                    { key: 'weeklySummary', label: 'Weekly project summary' },
                    { key: 'mentions', label: 'Team member mentions' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications]}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Slack Notifications */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Slack Notifications</h3>
                <Button variant="outline" className="mb-4">Connect Slack</Button>
                <p className="text-sm text-muted-foreground">Connect Slack to receive notifications directly in your Slack workspace.</p>
              </div>

              {/* In-app Notifications */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">In-app Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-foreground">Desktop notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-foreground">Sound alerts</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* API KEYS TAB */}
        <TabsContent value="api" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">API Keys</h2>
              <Button className="bg-primary hover:bg-primary/90 flex gap-2">
                <Plus size={16} />
                Generate API Key
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 text-muted-foreground font-medium">Key Name</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Created</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Last Used</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 font-medium">{key.name}</td>
                      <td className="py-3 text-muted-foreground">{key.created}</td>
                      <td className="py-3 text-muted-foreground">{key.lastUsed}</td>
                      <td className="text-right py-3 flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-foreground mb-2 font-medium">Need help?</p>
              <a href="#" className="text-sm text-primary hover:underline">View API Documentation</a>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
