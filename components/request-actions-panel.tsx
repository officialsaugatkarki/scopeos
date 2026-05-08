'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface RequestActionsPanelProps {
  requestId: string;
  currentStatus: string;
  onApprove?: () => void;
  onReject?: () => void;
  onEscalate?: () => void;
}

export default function RequestActionsPanel({ requestId, currentStatus, onApprove, onReject, onEscalate }: RequestActionsPanelProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const handleAction = async (action: string, callback?: () => void) => {
    setActionInProgress(action);
    await new Promise((resolve) => setTimeout(resolve, 300));
    callback?.();
    setActionInProgress(null);
    setNotes('');
    setShowNotes(false);
  };

  const isDecisionMade = currentStatus === 'decision' || currentStatus === 'completed';

  return (
    <Card className="glass-card rounded-xl p-6 sticky top-24">
      <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {!isDecisionMade && (
          <>
            <Button onClick={() => handleAction('approve', onApprove)} disabled={actionInProgress !== null}
              className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {actionInProgress === 'approve' ? 'Approving...' : 'Approve for Scope'}
            </Button>
            <Button onClick={() => handleAction('reject', onReject)} disabled={actionInProgress !== null}
              className="w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20">
              <XCircle className="w-4 h-4 mr-2" />
              {actionInProgress === 'reject' ? 'Rejecting...' : 'Reject Out of Scope'}
            </Button>
            <Button onClick={() => setShowNotes(!showNotes)} variant="outline"
              className="w-full border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
              <AlertCircle className="w-4 h-4 mr-2" />
              Request Clarification
            </Button>
          </>
        )}

        {isDecisionMade && (
          <Button onClick={() => handleAction('escalate', onEscalate)} disabled={actionInProgress !== null} variant="outline"
            className="w-full border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
            <AlertCircle className="w-4 h-4 mr-2" />
            {actionInProgress === 'escalate' ? 'Escalating...' : 'Escalate Decision'}
          </Button>
        )}
      </div>

      {showNotes && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
          <Textarea placeholder="Add notes about what clarification is needed..." value={notes} onChange={(e) => setNotes(e.target.value)}
            className="text-sm min-h-24 dark-input rounded-xl" />
          <div className="flex gap-2">
            <Button onClick={() => handleAction('send_clarification', () => {})} disabled={!notes.trim() || actionInProgress !== null} size="sm"
              className="flex-1 btn-gradient text-white border-0">Send Clarification</Button>
            <Button onClick={() => setShowNotes(false)} variant="ghost" size="sm"
              className="flex-1 text-white/40 hover:text-white/70">Cancel</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
