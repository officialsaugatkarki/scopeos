'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getRequests } from '@/lib/database';
import type { Request } from '@/lib/supabase';

// Derives notification-style items from real Request records
function deriveNotifications(requests: Request[]) {
  return requests.map(req => ({
    id: req.id,
    type: req.ai_decision === 'out-of-scope'
      ? 'out-of-scope' as const
      : req.ai_decision === 'needs-info'
      ? 'clarification-needed' as const
      : 'new-request' as const,
    title:
      req.ai_decision === 'out-of-scope'
        ? 'Out-of-Scope Detected'
        : req.ai_decision === 'needs-info'
        ? 'Clarification Needed'
        : 'New Scope Request',
    message: req.message,
    clientId: req.client_id,
    impact: req.estimated_impact,
    timestamp: new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isRead: req.status !== 'pending',
    requestId: req.id,
  }));
}

interface PMNotificationListProps {
  projectId?: string;
}

export function PMNotificationList({ projectId }: PMNotificationListProps) {
  const [notifications, setNotifications] = useState<ReturnType<typeof deriveNotifications>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRequests(projectId).then(data => {
      setNotifications(deriveNotifications(data.slice(0, 10)));
      setIsLoading(false);
    });
  }, [projectId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'new-request':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'out-of-scope':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'clarification-needed':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'out-of-scope': return 'bg-red-500/10 border-red-500/20';
      case 'clarification-needed': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="glass-card rounded-xl p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-white/[0.04] rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                <div className="h-3 bg-white/[0.04] rounded w-2/3" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="glass-card rounded-xl p-6 md:p-10 text-center">
        <TrendingUp className="w-10 h-10 text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm">No activity yet</p>
        <p className="text-xs text-white/20 mt-1">Requests from the client portal will appear here</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`glass-card rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer ${
            !notification.isRead ? 'border-l-2 border-l-blue-500/60' : ''
          }`}
        >
          <div className="flex gap-3">
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
              {getIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm">{notification.title}</h3>
                  <p className="text-sm text-white/40 mt-0.5 truncate">{notification.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-white/25">{notification.timestamp}</span>
                    {notification.impact && (
                      <span className="text-xs text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">
                        {notification.impact}
                      </span>
                    )}
                    {!notification.isRead && (
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full inline-block" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
