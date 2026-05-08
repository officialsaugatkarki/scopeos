'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, MessageCircle, AlertCircle } from 'lucide-react';

interface TimelineEvent {
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
}

interface RequestTimelineProps {
  request: {
    history: TimelineEvent[];
  };
}

export default function RequestTimeline({ request }: RequestTimelineProps) {
  const getActionIcon = (action: string) => {
    if (action.includes('submitted')) return <Clock className="w-4 h-4" />;
    if (action.includes('complete')) return <CheckCircle2 className="w-4 h-4" />;
    if (action.includes('review')) return <MessageCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getActionLabel = (action: string) => {
    return action.replace(/_/g, ' ').split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!request.history || request.history.length === 0) {
    return (
      <Card className="glass-card rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Request History</h3>
        <p className="text-sm text-white/30">No history available</p>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-xl p-6">
      <h3 className="font-semibold text-white mb-6">Request History</h3>
      <div className="space-y-4">
        {request.history.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                {getActionIcon(event.action)}
              </div>
              {index < request.history.length - 1 && (
                <div className="w-0.5 h-12 bg-gradient-to-b from-blue-500/20 to-transparent mt-2" />
              )}
            </div>
            <div className="pt-1 pb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <p className="font-medium text-sm text-white/80">{getActionLabel(event.action)}</p>
                <p className="text-xs text-white/30">by {event.actor}</p>
              </div>
              <p className="text-xs text-white/30 mb-1">{formatTime(event.timestamp)}</p>
              {event.details && (
                <p className="text-sm text-white/40 italic">{event.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
