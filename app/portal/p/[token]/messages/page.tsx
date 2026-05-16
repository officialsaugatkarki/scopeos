'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePortal } from '@/components/portal-context';
import { Button } from '@/components/ui/button';
import type { DirectMessage } from '@/lib/supabase';
import {
  Send,
  Loader2,
  User,
  Users,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export default function PortalTeamChatPage() {
  const { project, token } = usePortal();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!project) return;
    try {
      const res = await fetch(
        `/api/direct-chat?projectId=${project.id}&token=${token}&role=client`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    } finally {
      setIsLoading(false);
    }
  }, [project, token]);

  // Initial load + polling every 5s
  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending || !project) return;

    const content = input.trim();
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsSending(true);

    // Optimistic add
    const tempMsg: DirectMessage = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      sender_role: 'client',
      sender_name: project.client_name,
      content,
      read: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch('/api/direct-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          token,
          senderRole: 'client',
          senderName: project.client_name,
          content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev =>
          prev.map(m => m.id === tempMsg.id ? data.message : m)
        );
      }
    } catch (e) {
      console.error('Send failed:', e);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'MMMM d, yyyy');
  };

  if (!project) return null;

  return (
    <div className="max-w-3xl mx-auto flex flex-col -m-4 md:-m-6 p-4 md:p-6 h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white text-sm">Team Chat</h2>
            <p className="text-[11px] text-white/30">Talk directly with your PM / developer</p>
          </div>
        </div>
        <Button
          onClick={fetchMessages}
          variant="outline"
          size="sm"
          className="border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.06] hover:text-white/60 rounded-lg h-8 px-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
            <p className="text-white/40 max-w-sm text-sm mb-2">
              Start a conversation with your project manager or developer. They&apos;ll respond directly here.
            </p>
            <p className="text-white/20 text-xs">
              This is separate from the AI Chat — real humans, real conversations.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isClient = msg.sender_role === 'client';
              const showDateLabel =
                idx === 0 || getDateLabel(msg.created_at) !== getDateLabel(messages[idx - 1].created_at);

              return (
                <div key={msg.id}>
                  {showDateLabel && (
                    <div className="flex items-center justify-center py-3">
                      <span className="text-[10px] text-white/20 bg-[#0A0F1C] px-3 py-0.5 rounded-full border border-white/[0.04]">
                        {getDateLabel(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isClient ? 'justify-end' : 'justify-start'} mb-2`}>
                    <div className={`flex items-end gap-2 max-w-[80%] ${isClient ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isClient
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-purple-500/20 border border-purple-500/30'
                      }`}>
                        {isClient
                          ? <User className="w-3.5 h-3.5 text-blue-400" />
                          : <Users className="w-3.5 h-3.5 text-purple-400" />
                        }
                      </div>
                      <div>
                        <div className={`rounded-2xl px-4 py-2.5 ${
                          isClient
                            ? 'bg-blue-500/15 border border-blue-500/20 rounded-br-md'
                            : 'bg-white/[0.04] border border-white/[0.06] rounded-bl-md'
                        }`}>
                          <p className="text-[11px] font-medium mb-0.5 ${isClient ? 'text-blue-400/60' : 'text-purple-400/60'}">
                            {msg.sender_name}
                          </p>
                          <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                        <p className={`text-[10px] text-white/15 mt-1 ${isClient ? 'text-right' : 'text-left'}`}>
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 pt-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Message your team..."
              rows={1}
              className="w-full resize-none dark-input rounded-xl px-4 py-3 text-sm leading-relaxed min-h-[48px] max-h-[120px]"
              disabled={isSending}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/20 rounded-xl h-[48px] w-[48px] p-0 flex items-center justify-center disabled:opacity-40"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-[10px] text-white/15 text-center mt-2">
          Messages are sent to your project manager • Not monitored by AI
        </p>
      </div>
    </div>
  );
}
