'use client';

import { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRequests } from '@/lib/database';
import type { Request } from '@/lib/supabase';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'all' | 'scope'>('all');

  useEffect(() => {
    getRequests().then(data => setRequests(data.slice(0, 20)));
  }, []);

  const notifications = requests.map(req => ({
    id: req.id,
    type: req.ai_decision === 'out-of-scope' ? 'scope' as const : 'request' as const,
    message:
      req.ai_decision === 'out-of-scope'
        ? `Out-of-scope detected: ${req.message.slice(0, 80)}${req.message.length > 80 ? '…' : ''}`
        : `New request: ${req.message.slice(0, 80)}${req.message.length > 80 ? '…' : ''}`,
    time: new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    isOutOfScope: req.ai_decision === 'out-of-scope',
    unread: req.status === 'pending' && !readIds.has(req.id),
  }));

  const filtered = activeTab === 'scope'
    ? notifications.filter(n => n.type === 'scope')
    : notifications;

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setReadIds(new Set(requests.map(r => r.id)));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-glow-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 mt-2 w-96 bg-[#0F1629] rounded-xl border border-white/[0.08] shadow-2xl shadow-black/50 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div>
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-white/30 mt-0.5">{unreadCount} unread</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-white/30 hover:text-white/60">
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]">
              {(['all', 'scope'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {tab === 'all' ? 'All Activity' : 'Out of Scope'}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="max-h-[420px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 gap-3">
                  <TrendingUp className="w-8 h-8 text-white/10" />
                  <p className="text-white/30 text-sm text-center">
                    {activeTab === 'scope'
                      ? 'No out-of-scope requests detected yet'
                      : 'No activity yet. Share the portal link with your client to get started.'}
                  </p>
                </div>
              ) : (
                filtered.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-default flex items-start gap-3 ${
                      n.unread ? 'bg-blue-500/[0.03]' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      n.isOutOfScope
                        ? 'bg-red-500/10 border border-red-500/20'
                        : 'bg-blue-500/10 border border-blue-500/20'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${n.isOutOfScope ? 'text-red-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 leading-snug">{n.message}</p>
                      <p className="text-xs text-white/25 mt-1">{n.time}</p>
                    </div>
                    {n.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/[0.06]">
              <a
                href="/dashboard/settings?tab=notifications"
                className="text-xs text-white/30 hover:text-white/60 transition-colors block text-center"
              >
                Notification settings →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
