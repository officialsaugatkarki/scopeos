'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { WaitlistEntry } from '@/lib/supabase';
import { format } from 'date-fns';
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function WaitlistAdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/waitlist/admin?status=${statusFilter}`);
      if (res.status === 403) {
        toast.error('Unauthorized access');
        return;
      }
      const json = await res.json();
      if (res.ok) {
        setEntries(json.data);
      }
    } catch (err) {
      toast.error('Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, [statusFilter]);

  const handleAction = async (id: string, action: string) => {
    try {
      const res = await fetch('/api/waitlist/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });
      if (res.ok) {
        toast.success(`User ${action}ed successfully`);
        fetchWaitlist();
      } else {
        toast.error('Failed to perform action');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const pendingCount = entries.filter(e => e.status === 'pending').length;
  const approvedCount = entries.filter(e => e.status === 'approved').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waitlist Management</h1>
          <p className="text-muted-foreground">Manage early access applications and approve users.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applications</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading waitlist...</div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No entries found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Company & Role</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-muted-foreground">{entry.email}</div>
                        <div className="text-xs text-muted-foreground mt-1">{format(new Date(entry.created_at), 'PP')}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{entry.company}</div>
                        <div className="text-sm text-muted-foreground">{entry.role} • {entry.team_size}</div>
                        <div className="text-xs text-muted-foreground mt-1">{entry.country}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant={entry.email_verified ? 'default' : 'secondary'} className={entry.email_verified ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}>
                            Email
                          </Badge>
                          <Badge variant={entry.phone_verified ? 'default' : 'secondary'} className={entry.phone_verified ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}>
                            Phone
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-center">{entry.referral_count}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={entry.status === 'approved' ? 'default' : entry.status === 'rejected' ? 'destructive' : 'secondary'}
                          className={entry.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : entry.status === 'pending' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : ''}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10" onClick={() => handleAction(entry.id, 'approve')}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={() => handleAction(entry.id, 'reject')}>
                              Reject
                            </Button>
                          </div>
                        )}
                        {entry.status === 'approved' && (
                          <div className="text-sm text-muted-foreground">
                            Batch {entry.batch}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
