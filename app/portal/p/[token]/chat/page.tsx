'use client';

import { useState, useEffect, useRef } from 'react';
import { usePortal } from '@/components/portal-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PortalMessage } from '@/lib/supabase';
import {
  Send,
  Loader2,
  Bot,
  User,
  CheckCircle2,
  XCircle,
  HelpCircle,
  DollarSign,
  ArrowRight,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PortalChatPage() {
  const { project, token, messages: initialMessages, refreshMessages } = usePortal();
  const [messages, setMessages] = useState<PortalMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial messages from context
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending || !project) return;

    const userMessage = input.trim();
    setInput('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    setIsSending(true);

    // Optimistic client message
    const tempClientMsg: PortalMessage = {
      id: `temp-${Date.now()}`,
      project_id: project.id,
      role: 'client',
      content: userMessage,
      metadata: {},
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempClientMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          portalToken: token,
          message: userMessage,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const assistantMsg: PortalMessage = {
        id: `resp-${Date.now()}`,
        project_id: project.id,
        role: 'assistant',
        content: data.message,
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Refresh context data for other pages
      refreshMessages();
    } catch (error) {
      const errorMsg: PortalMessage = {
        id: `err-${Date.now()}`,
        project_id: project.id,
        role: 'assistant',
        content: `Sorry, something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        metadata: {},
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
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

  if (!project) return null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col -m-4 md:-m-6 p-4 md:p-6 h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5.5rem)]">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-0">
        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Hi {project.client_name}! 👋
            </h2>
            <p className="text-white/40 max-w-md mb-8 text-sm">
              Tell me what you need for <span className="text-white font-medium">{project.name}</span>.
              I&apos;ll analyze scope, estimate costs, and handle everything automatically.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
              {[
                { label: 'Report a bug', icon: '🐛', desc: 'Something not working?' },
                { label: 'Request a feature', icon: '✨', desc: 'Need something new?' },
                { label: 'Ask a question', icon: '❓', desc: 'Scope or status?' },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setInput(s.label); inputRef.current?.focus(); }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/20 hover:bg-white/[0.05] transition-all text-left group"
                >
                  <span className="text-xl mb-2 block">{s.icon}</span>
                  <p className="text-sm text-white/70 font-medium group-hover:text-white transition-colors">{s.label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className="animate-in slide-in-from-bottom-4">
            {msg.role === 'client' ? (
              <div className="flex justify-end">
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="bg-blue-500/20 border border-blue-500/20 rounded-2xl rounded-br-md px-4 py-3">
                    <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] text-white/20 mt-1.5 text-right">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="text-sm text-white/80 whitespace-pre-wrap">
                        <MessageContent content={msg.content} />
                      </div>
                      <p className="text-[10px] text-white/20 mt-1.5">
                        {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    {msg.metadata?.decision && <DecisionCard metadata={msg.metadata} />}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex justify-start animate-in slide-in-from-bottom-4">
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="glass-card rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400/60"
                      style={{ animation: `glow-pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                  <span className="text-xs text-white/30 ml-2">Analyzing scope...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="flex-shrink-0 pt-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you need..."
              rows={1}
              className="w-full resize-none dark-input rounded-xl px-4 py-3 pr-12 text-sm leading-relaxed min-h-[48px] max-h-[150px]"
              disabled={isSending}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white/40 transition-colors" title="Attach file">
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="btn-gradient text-white border-0 rounded-xl h-[48px] w-[48px] p-0 flex items-center justify-center disabled:opacity-40"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          Powered by ScopeOS AI • Messages are analyzed for scope decisions
        </p>
      </div>
    </div>
  );
}

/* ─── MESSAGE CONTENT RENDERER ─── */
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="text-sm font-semibold text-white mt-3 mb-1">{line.replace('### ', '')}</h4>;
        if (line.startsWith('## ')) return <h3 key={i} className="text-base font-semibold text-white mt-3 mb-1">{line.replace('## ', '')}</h3>;
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(Boolean).map(c => c.trim());
          if (cells.every(c => c.match(/^[-:]+$/))) return null;
          return (
            <div key={i} className="flex items-center gap-4 text-xs py-1">
              {cells.map((cell, j) => (
                <span key={j} className={j === 0 ? 'text-white/40 w-32' : 'text-white font-medium'}>
                  <InlineFormat text={cell} />
                </span>
              ))}
            </div>
          );
        }
        if (line.startsWith('```')) return <div key={i} className="font-mono text-xs bg-white/[0.03] rounded px-2 py-0.5" />;
        if (!line.trim()) return <div key={i} className="h-2" />;
        return <p key={i} className="text-sm text-white/80 leading-relaxed"><InlineFormat text={line} /></p>;
      })}
    </>
  );
}

function InlineFormat({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─── DECISION CARD ─── */
function DecisionCard({ metadata }: { metadata: PortalMessage['metadata'] }) {
  if (!metadata.decision) return null;

  if (metadata.decision === 'in-scope') {
    return (
      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">IN SCOPE — Task Added</span>
        </div>
        {metadata.title && <p className="text-xs text-white/50 ml-6">{metadata.title}</p>}
      </div>
    );
  }

  if (metadata.decision === 'out-of-scope') {
    return (
      <div className="rounded-xl bg-red-500/5 border border-red-500/15 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-red-400">OUT OF SCOPE — Change Request</span>
        </div>
        {metadata.title && <p className="text-xs text-white/50 ml-6">{metadata.title}</p>}
        <div className="flex items-center gap-3 ml-6">
          {metadata.cost && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">{metadata.cost}</span>
            </div>
          )}
          {metadata.estimatedHours && (
            <span className="text-xs text-white/30">{metadata.estimatedHours} hrs estimated</span>
          )}
        </div>
        <button className="ml-6 flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors mt-1">
          <ArrowRight className="w-3 h-3" /> Approve Change Request
        </button>
      </div>
    );
  }

  if (metadata.decision === 'needs-info') {
    return (
      <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">NEEDS CLARIFICATION</span>
        </div>
        <p className="text-xs text-white/40 ml-6 mt-1">Please provide more details above to continue</p>
      </div>
    );
  }

  return null;
}
