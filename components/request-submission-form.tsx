'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface RequestSubmissionFormProps {
  projectId?: string;
  projectName: string;
  onSubmit?: (data: { title: string; description: string; attachments: string[] }) => void;
}

export default function RequestSubmissionForm({ projectId, projectName, onSubmit }: RequestSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) { alert('Please fill in all required fields'); return; }
    setIsSubmitting(true);
    if (onSubmit) { await onSubmit({ title, description, attachments }); }
    setTitle(''); setDescription(''); setAttachments([]);
    setIsSubmitting(false); setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <Card className="glass-card rounded-xl p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Submit a Change Request</h2>
          <p className="text-white/40">Project: <span className="font-semibold text-white/60">{projectName}</span></p>
        </div>

        {submitSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
            ✓ Your request has been submitted successfully! The PM will review it shortly.
          </div>
        )}

        <div className="bg-blue-500/[0.06] border border-blue-500/10 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-white/50">
            <p className="font-medium mb-1 text-white/70">How it works:</p>
            <p>Our AI analyzes your request to determine if it&apos;s within the project scope. You may be asked clarifying questions to help us make the best decision.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-white/70 mb-1 block">Request Title *</span>
            <Input placeholder="e.g., Add customer testimonials section" value={title} onChange={(e) => setTitle(e.target.value)} className="dark-input rounded-xl text-sm" />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-white/70 mb-1 block">Detailed Description *</span>
            <Textarea placeholder="Describe what you want to add or change. Include as much detail as possible..." value={description} onChange={(e) => setDescription(e.target.value)} className="dark-input rounded-xl text-sm min-h-32" />
          </label>
          <p className="text-xs text-white/30">{description.length} characters</p>
        </div>

        <div>
          <label className="block">
            <span className="text-sm font-medium text-white/70 mb-2 block">Attachments (Optional)</span>
            <Button variant="outline" className="w-full border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl" type="button">
              <Upload className="w-4 h-4 mr-2" /> Upload Files (Images, Designs, etc.)
            </Button>
          </label>
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg text-sm border border-white/[0.04]">
                  <span className="text-white/60">{file}</span>
                  <button onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={!isValid || isSubmitting} className="w-full btn-gradient text-white border-0 rounded-xl h-11" size="lg">
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </Card>
  );
}
