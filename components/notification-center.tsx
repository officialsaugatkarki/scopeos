'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    { id: '1', type: 'request', message: 'New request from Acme Corp: Add file uploads', time: '2 min ago', icon: '🔔', unread: true },
    { id: '2', type: 'scope', message: 'Out-of-scope detected: User authentication', time: '1 hour ago', icon: '⚠️', unread: true },
    { id: '3', type: 'approved', message: 'Change request approved by TechStart', time: '3 hours ago', icon: '✅', unread: false },
    { id: '4', type: 'payment', message: 'Payment received: $299', time: '1 day ago', icon: '💰', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = () => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'requests') return notifications.filter(n => n.type === 'request');
    if (activeTab === 'projects') return notifications.filter(n => ['scope', 'approved'].includes(n.type));
    return notifications.filter(n => n.type === 'payment');
  };

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X size={16} />
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-muted/50">
              <TabsTrigger value="all" className="rounded-none">All</TabsTrigger>
              <TabsTrigger value="requests" className="rounded-none">Requests</TabsTrigger>
              <TabsTrigger value="projects" className="rounded-none">Projects</TabsTrigger>
              <TabsTrigger value="system" className="rounded-none">System</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="max-h-96 overflow-y-auto p-0 m-0">
              <div className="space-y-0">
                {filteredNotifications().length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No notifications
                  </div>
                ) : (
                  filteredNotifications().map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer flex items-start gap-3 ${
                        notification.unread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="text-lg flex-shrink-0">{notification.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="p-4 border-t border-border space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              Mark all as read
            </Button>
            <a href="/dashboard/settings?tab=notifications" className="text-xs text-primary hover:underline block text-center">
              Notification settings
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
