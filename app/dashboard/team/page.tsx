'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MoreVertical, Plus, Mail, Trash2, Edit } from 'lucide-react';

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [teamMembers] = useState([
    { id: '1', name: 'Sarah Chen', email: 'sarah@agency.com', role: 'Admin', projects: 8, lastActive: '2 min ago', status: 'Active' },
    { id: '2', name: 'Mike Ross', email: 'mike@agency.com', role: 'PM', projects: 5, lastActive: '1 hour ago', status: 'Active' },
    { id: '3', name: 'Jessica Lee', email: 'jessica@agency.com', role: 'PM', projects: 0, lastActive: null, status: 'Pending', invitedDate: '2 days ago' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Team Members</h1>
          <p className="text-muted-foreground">Manage your team and assign project access</p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 flex gap-2">
              <Plus size={16} />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>Add a new member to your team</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                <Input placeholder="member@agency.com" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                <select className="w-full px-3 py-2 border border-input rounded-md text-sm">
                  <option>Admin</option>
                  <option>PM</option>
                  <option>Viewer</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Assign to Projects</label>
                <div className="space-y-2">
                  {['Website Redesign', 'Mobile App Development', 'API Integration'].map((proj) => (
                    <label key={proj} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-foreground">{proj}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Personal Message</label>
                <textarea className="w-full px-3 py-2 border border-input rounded-md text-sm" rows={3} placeholder="Add a welcome message..." />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90">Send Invitation</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Role</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Projects</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Last Active</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-border hover:bg-muted/50">
                  <td className="py-3 font-medium">{member.name}</td>
                  <td className="py-3 text-muted-foreground">{member.email}</td>
                  <td className="py-3">
                    <Badge variant="outline">{member.role}</Badge>
                  </td>
                  <td className="py-3">{member.projects} projects</td>
                  <td className="py-3 text-muted-foreground">{member.lastActive || `Invited ${member.invitedDate}`}</td>
                  <td className="py-3">
                    <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="text-right py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Definitions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Role Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Admin</h4>
            <p className="text-sm text-muted-foreground">Full access to all features, billing, and team management</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">PM</h4>
            <p className="text-sm text-muted-foreground">Manage projects and review requests, no billing access</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Viewer</h4>
            <p className="text-sm text-muted-foreground">Read-only access to assigned projects</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
