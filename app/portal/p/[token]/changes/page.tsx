'use client';

import { useState } from 'react';
import { usePortal } from '@/components/portal-context';
import { updateRequest } from '@/lib/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
  Shield,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PortalChangesPage() {
  const { requests, refreshRequests, project } = usePortal();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!project) return null;

  // Filter requests that are out-of-scope to act as change requests
  const changeRequests = requests.filter(r => r.ai_decision === 'out-of-scope');

  // Stats
  const pendingCRs = changeRequests.filter(cr => cr.status === 'pending' || cr.status === 'analyzed' || cr.status === 'submitted');
  const approvedCRs = changeRequests.filter(cr => cr.status === 'approved');
  const rejectedCRs = changeRequests.filter(cr => cr.status === 'rejected');

  // Helper to parse estimated hours
  const parseHours = (impact?: string) => {
    if (!impact) return 0;
    const match = impact.match(/(\d+)\s*hrs?/i);
    return match ? parseInt(match[1], 10) : 0;
  };

  const totalPendingCost = pendingCRs.reduce((sum, cr) => {
    const rate = 150; // default rate
    return sum + (parseHours(cr.estimated_impact) * rate);
  }, 0);

  const totalApprovedCost = approvedCRs.reduce((sum, cr) => {
    const rate = 150;
    return sum + (parseHours(cr.estimated_impact) * rate);
  }, 0);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(id);
    try {
      await updateRequest(id, { status });
      await refreshRequests();
    } catch (e) {
      console.error('Error updating change request:', e);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved': return { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Approved' };
      case 'rejected': return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Rejected' };
      case 'analyzed':
      case 'pending':
      case 'submitted':
        return { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pending Approval' };
      default:
        return { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'In Review' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Change Requests</h1>
        <p className="text-sm text-white/40 mt-1">Review and approve out-of-scope work with full cost transparency</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Card className="glass-card rounded-xl p-4 border-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Pending</p>
              <p className="text-xl font-bold text-amber-400">${totalPendingCost.toLocaleString()}</p>
              <p className="text-[10px] text-white/20">{pendingCRs.length} request{pendingCRs.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card rounded-xl p-4 border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Approved</p>
              <p className="text-xl font-bold text-emerald-400">${totalApprovedCost.toLocaleString()}</p>
              <p className="text-[10px] text-white/20">{approvedCRs.length} request{approvedCRs.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-card rounded-xl p-4 border-red-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Rejected</p>
              <p className="text-xl font-bold text-white/50">{rejectedCRs.length}</p>
              <p className="text-[10px] text-white/20">request{rejectedCRs.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/40">
          All cost estimates are calculated based on your agency&apos;s hourly rate. Approving a change request authorizes the additional work and associated costs.
        </p>
      </div>

      {/* Change Request List */}
      {changeRequests.length === 0 ? (
        <Card className="glass-card rounded-xl p-6 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-2">No change requests</h3>
          <p className="text-sm text-white/30">When AI identifies out-of-scope work, change requests will appear here for your review.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {changeRequests.map((cr) => {
            const config = getStatusConfig(cr.status);
            const StatusIcon = config.icon;
            const hours = parseHours(cr.estimated_impact);
            const estimatedCost = hours * 150;
            const isLoading = actionLoading === cr.id;
            const title = cr.message.substring(0, 80) + (cr.message.length > 80 ? '...' : '');
            const isPending = cr.status === 'pending' || cr.status === 'analyzed' || cr.status === 'submitted';

            return (
              <Card key={cr.id} className={`glass-card rounded-xl overflow-hidden transition-all hover:border-white/10 ${
                isPending ? 'border-l-4 border-l-amber-500/40' :
                cr.status === 'approved' ? 'border-l-4 border-l-emerald-500/40' :
                cr.status === 'rejected' ? 'border-l-4 border-l-red-500/40' :
                'border-l-4 border-l-blue-500/40'
              }`}>
                <div className="p-4 md:p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-xs text-white/30 mt-1">
                        Submitted by {project.client_name} • {formatDistanceToNow(new Date(cr.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border} font-medium flex items-center gap-1 flex-shrink-0`}>
                      <StatusIcon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-3">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Est. Hours</p>
                      <p className="text-sm font-bold text-white mt-0.5">{hours > 0 ? `${hours} hrs` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Rate</p>
                      <p className="text-sm font-bold text-white/70 mt-0.5">$150/hr</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Total Cost</p>
                      <p className="text-sm font-bold text-amber-400 mt-0.5">${estimatedCost.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions (only for pending) */}
                  {isPending && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleAction(cr.id, 'approved'); }}
                        disabled={isLoading}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl h-9 text-xs font-medium"
                      >
                        {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                        Approve
                      </Button>
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleAction(cr.id, 'rejected'); }}
                        disabled={isLoading}
                        variant="outline"
                        className="border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl h-9 text-xs font-medium"
                      >
                        <XCircle className="w-3 h-3 mr-1.5" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.06] hover:text-white/60 rounded-xl h-9 text-xs font-medium"
                      >
                        <MessageSquare className="w-3 h-3 mr-1.5" />
                        Request Clarification
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
