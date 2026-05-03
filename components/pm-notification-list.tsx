'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface PMNotification {
  id: string;
  type: 'new-request' | 'out-of-scope' | 'cr-approved' | 'clarification-needed';
  title: string;
  message: string;
  clientName: string;
  requestTitle: string;
  amount?: string;
  timestamp: string;
  isRead: boolean;
  actionLink: string;
}

interface PMNotificationListProps {
  notifications?: PMNotification[];
}

const mockNotifications: PMNotification[] = [
  {
    id: '1',
    type: 'new-request',
    title: 'New Request from Acme Corp',
    message: 'John Smith submitted: "Add customer testimonials section"',
    clientName: 'John Smith',
    requestTitle: 'Add customer testimonials section',
    timestamp: '2 hours ago',
    isRead: false,
    actionLink: '/dashboard/requests/req-1',
  },
  {
    id: '2',
    type: 'out-of-scope',
    title: 'Out-of-Scope Detected',
    message: 'Sarah Johnson: "Integration with third-party analytics" needs clarification',
    clientName: 'Sarah Johnson',
    requestTitle: 'Integration with third-party analytics',
    timestamp: '4 hours ago',
    isRead: false,
    actionLink: '/dashboard/requests/req-2',
  },
  {
    id: '3',
    type: 'cr-approved',
    title: 'Change Request Approved',
    message: 'Mike Chen approved CR-001: Complete website redesign ($45,000)',
    clientName: 'Mike Chen',
    requestTitle: 'Complete website redesign',
    amount: '$45,000',
    timestamp: '1 day ago',
    isRead: true,
    actionLink: '/dashboard/projects/1',
  },
];

export function PMNotificationList({ notifications = mockNotifications }: PMNotificationListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'new-request':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'out-of-scope':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'cr-approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'clarification-needed':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'new-request':
        return 'default';
      case 'out-of-scope':
        return 'outline';
      case 'cr-approved':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No notifications</p>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
              !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
            }`}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0">{getIcon(notification.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                      {notification.amount && (
                        <Badge variant="secondary" className="text-xs">
                          {notification.amount}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => (window.location.href = notification.actionLink)}
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
