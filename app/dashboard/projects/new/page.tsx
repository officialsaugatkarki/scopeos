'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Sparkles, Copy, ExternalLink, Check, Mail, Zap, Shield } from 'lucide-react';
import { createProject } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';

type Phase = 'form' | 'creating' | 'success';

export default function NewProjectPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('form');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [createdPortalUrl, setCreatedPortalUrl] = useState('');
  const [createdProjectId, setCreatedProjectId] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const uid = await getCurrentUserId();
      setUserId(uid);
    };
    loadUser();
  }, []);

  const isValid = projectName.trim() && clientName.trim() && clientEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail);

  const handleCreate = async () => {
    if (!userId || !isValid) return;
    setError('');
    setPhase('creating');

    try {
      const project = await createProject({
        user_id: userId,
        name: projectName.trim(),
        client_name: clientName.trim(),
        client_email: clientEmail.trim(),
        portal_enabled: portalEnabled,
      });

      if (!project) {
        setError('Failed to create project. Please try again.');
        setPhase('form');
        return;
      }

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const portalUrl = `${baseUrl}/portal/p/${project.portal_token}`;
      setCreatedPortalUrl(portalUrl);
      setCreatedProjectId(project.id);

      // Small delay for the animation effect
      await new Promise((r) => setTimeout(r, 1200));
      setPhase('success');
    } catch {
      setError('An unexpected error occurred.');
      setPhase('form');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdPortalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Your project portal is ready — ${projectName}`);
    const body = encodeURIComponent(
      `Hi ${clientName},\n\nYour project "${projectName}" portal is now live.\n\nAccess your dashboard here:\n${createdPortalUrl}\n\nYou can submit requests, track progress, and communicate with us directly through this portal.\n\nBest regards`
    );
    window.open(`mailto:${clientEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  // ─── CREATING STATE ───
  if (phase === 'creating') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/30 flex items-center justify-center glow-blue">
              <Sparkles className="w-8 h-8 text-blue-400 animate-glow-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Creating your project</h2>
            <p className="text-white/40">Setting up portal & generating access link...</p>
          </div>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400"
                style={{ animation: `glow-pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SUCCESS STATE ───
  if (phase === 'success') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border border-emerald-500/30 flex items-center justify-center">
              <Check className="w-10 h-10 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Created!</h1>
          <p className="text-white/40 text-lg">
            <span className="text-white font-medium">{projectName}</span> is live with a client portal for{' '}
            <span className="text-white font-medium">{clientName}</span>
          </p>
        </div>

        {/* Portal URL Card */}
        <Card className="glass-card-strong rounded-2xl p-6 border-emerald-500/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Client Portal URL</h3>
              <p className="text-xs text-white/40">Share this with your client</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <code className="flex-1 bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl text-sm text-blue-400 truncate font-mono">
              {createdPortalUrl}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(createdPortalUrl, '_blank')}
              className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white flex-shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-emerald-400 animate-in fade-in duration-200">✓ Copied to clipboard</p>
          )}
        </Card>

        {/* Send Email Card */}
        <Card className="glass-card rounded-2xl p-6 border-blue-500/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Invite Client</h3>
              <p className="text-xs text-white/40">Send portal link to {clientEmail}</p>
            </div>
          </div>
          <Button
            onClick={handleSendEmail}
            className="w-full btn-gradient text-white border-0 rounded-xl h-11 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" /> Send Portal Invitation
          </Button>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.push(`/dashboard/projects/${createdProjectId}`)}
            className="flex-1 btn-gradient text-white border-0 rounded-xl h-11"
          >
            View Project
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/projects')}
            className="flex-1 border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl h-11"
          >
            All Projects
          </Button>
        </div>
      </div>
    );
  }

  // ─── FORM STATE ───
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2 border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      {/* Header */}
      <div className="text-center py-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
        <p className="text-white/40">Just the basics — AI handles the rest</p>
      </div>

      {/* Form Card */}
      <Card className="glass-card-strong rounded-2xl border border-white/[0.06] p-8">
        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Project Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., Website Redesign, Mobile App, Brand Identity"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="dark-input rounded-xl h-12 text-base"
              autoFocus
            />
          </div>

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Client Name <span className="text-red-400">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., Acme Corp, John Smith"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="dark-input rounded-xl h-12 text-base"
            />
          </div>

          {/* Client Email */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Client Email <span className="text-red-400">*</span>
            </label>
            <Input
              type="email"
              placeholder="client@company.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="dark-input rounded-xl h-12 text-base"
            />
            <p className="text-xs text-white/30 mt-1.5">Portal invitation will be sent to this email</p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Portal Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Client Portal Access</p>
                <p className="text-xs text-white/40">Auto-generate a shareable portal link</p>
              </div>
            </div>
            <Switch checked={portalEnabled} onCheckedChange={setPortalEnabled} />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* What happens next */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-xs font-medium text-white/50 mb-2">WHAT HAPPENS NEXT</p>
            <div className="space-y-2">
              {[
                'Project created in your dashboard',
                'Unique client portal generated',
                'Email invitation ready to send',
                'AI-powered scope analysis activated',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                  <span className="text-xs text-white/40">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button
        onClick={handleCreate}
        disabled={!isValid}
        className="w-full btn-gradient text-white border-0 rounded-xl h-12 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5" /> Create Project
      </Button>
    </div>
  );
}
