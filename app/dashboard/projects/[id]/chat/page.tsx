'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getProject } from '@/lib/database';
import type { Project } from '@/lib/supabase';
import type { DirectMessage } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Send,
  Loader2,
  User,
  Users,
  MessageCircle,
  RefreshCw,
  ArrowLeft,
  Circle,
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import Link from 'next/link';

export default function DashboardProjectChatPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    getProject(projectId).then(p => setProject(p));
  }, [projectId]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/direct-chat?projectId=${projectId}&role=pm`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

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
      project_id: projectId,
      sender_role: 'pm',
      sender_name: 'Project Manager',
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
          projectId,
          senderRole: 'pm',
          senderName: 'Project Manager',
          content,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? data.message : m));
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

  const getDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return 'Today';
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'MMMM d, yyyy');
  };

  const clientMessages = messages.filter(m => m.sender_role === 'client');
  const lastClientMsg = clientMessages[clientMessages.length - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">
            Client Chat — {project?.client_name || 'Loading...'}
          </h1>
          <p className="text-xs text-white/30 truncate">{project?.name}</p>
        </div>
        <Button
          onClick={fetchMessages}
          variant="outline"
          size="sm"
          className="border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.06] rounded-lg h-8 px-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Client info bar */}
      {project && (
        <Card className="glass-card rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">{project.client_name}</p>
              <p className="text-[10px] text-white/30">{project.client_email || 'No email'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/20">
              {lastClientMsg
                ? `Last message ${formatDistanceToNow(new Date(lastClientMsg.created_at), { addSuffix: true })}`
                : 'No messages from client'}
            </p>
          </div>
        </Card>
      )}

      {/* Chat area */}
      <Card className="glass-card rounded-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 16rem)' }}>
        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Start a conversation</h3>
              <p className="text-white/40 text-sm max-w-sm">
                Send a message to <span className="text-white font-medium">{project?.client_name}</span>.
                They&apos;ll see it in their Team Chat portal.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => {
                const isPM = msg.sender_role === 'pm';
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
                    <div className={`flex ${isPM ? 'justify-end' : 'justify-start'} mb-2`}>
                      <div className={`flex items-end gap-2 max-w-[75%] ${isPM ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isPM
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : 'bg-blue-500/20 border border-blue-500/30'
                        }`}>
                          {isPM
                            ? <Users className="w-3.5 h-3.5 text-purple-400" />
                            : <User className="w-3.5 h-3.5 text-blue-400" />
                          }
                        </div>
                        <div>
                          <div className={`rounded-2xl px-4 py-2.5 ${
                            isPM
                              ? 'bg-purple-500/15 border border-purple-500/20 rounded-br-md'
                              : 'bg-white/[0.04] border border-white/[0.06] rounded-bl-md'
                          }`}>
                            <p className={`text-[11px] font-medium mb-0.5 ${isPM ? 'text-purple-400/60' : 'text-blue-400/60'}`}>
                              {msg.sender_name}
                            </p>
                            <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 mt-1 ${isPM ? 'justify-end' : 'justify-start'}`}>
                            <p className="text-[10px] text-white/15">
                              {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                            </p>
                            {isPM && msg.read && (
                              <span className="text-[9px] text-emerald-400/50">Read</span>
                            )}
                          </div>
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
        <div className="flex-shrink-0 p-3 border-t border-white/[0.04]">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${project?.client_name || 'client'}...`}
              rows={1}
              className="flex-1 resize-none dark-input rounded-xl px-4 py-3 text-sm leading-relaxed min-h-[44px] max-h-[120px]"
              disabled={isSending}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isSending}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/20 rounded-xl h-[44px] w-[44px] p-0 flex items-center justify-center disabled:opacity-40"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
