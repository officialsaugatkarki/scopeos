'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check } from 'lucide-react';
import { createProject } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';

interface FormData {
  name: string;
  description: string;
  clientName: string;
  clientEmail: string;
  budget: string;
  startDate: string;
  scopeBaseline: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    clientName: '',
    clientEmail: '',
    budget: '',
    startDate: '',
    scopeBaseline: '',
  });
  const [portalUrl, setPortalUrl] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const uid = await getCurrentUserId();
      setUserId(uid);
    };
    loadUser();
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generatePortalUrl = () => {
    const projectSlug = formData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .substring(0, 20);
    return `https://portal.scopeguard.ai/projects/${projectSlug}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.description) {
        alert('Please fill in project name and description');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.clientName || !formData.clientEmail) {
        alert('Please fill in client information');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.budget || !formData.startDate) {
        alert('Please fill in budget and start date');
        return;
      }
      setStep(4);
      setPortalUrl(generatePortalUrl());
    }
  };

  const handleCreate = async () => {
    if (!userId) return;
    setIsCreating(true);

    const project = await createProject({
      user_id: userId,
      name: formData.name,
      description: formData.description,
      client_name: formData.clientName,
      client_email: formData.clientEmail,
      budget: parseFloat(formData.budget) || 0,
      spent: 0,
      start_date: formData.startDate || new Date().toISOString().split('T')[0],
      end_date: null,
      status: 'active',
      scope_baseline: formData.scopeBaseline,
    });

    setIsCreating(false);
    if (project) {
      router.push('/dashboard/projects');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step >= 1
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div
            className={`w-2 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}
            style={{ width: '40px' }}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step >= 2
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step > 2 ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div
            className={`w-2 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}
            style={{ width: '40px' }}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step >= 3
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {step > 3 ? <Check className="w-4 h-4" /> : '3'}
          </div>
          <div
            className={`w-2 h-0.5 ${step >= 4 ? 'bg-primary' : 'bg-muted'}`}
            style={{ width: '40px' }}
          />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step >= 4
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            4
          </div>
        </div>
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Project Basics
              </h2>
              <p className="text-muted-foreground">
                Let&apos;s start with the basics about your project
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Name
                </label>
                <Input
                  placeholder="e.g., Website Redesign"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Brief description of the project..."
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Client Information
              </h2>
              <p className="text-muted-foreground">
                Who is the client for this project?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Name
                </label>
                <Input
                  placeholder="e.g., Acme Corp"
                  value={formData.clientName}
                  onChange={(e) => updateFormData('clientName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Client Email
                </label>
                <Input
                  type="email"
                  placeholder="contact@client.com"
                  value={formData.clientEmail}
                  onChange={(e) => updateFormData('clientEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Project Settings
              </h2>
              <p className="text-muted-foreground">
                Set your budget and timeline
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Budget ($)
                </label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateFormData('startDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Scope Baseline
                </label>
                <Textarea
                  placeholder="Describe the original scope agreement with the client..."
                  value={formData.scopeBaseline}
                  onChange={(e) => updateFormData('scopeBaseline', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Client Portal
              </h2>
              <p className="text-muted-foreground">
                Your project is ready! Here&apos;s the portal link for your client
              </p>
            </div>

            <Card className="p-6 bg-muted/50 border-primary/20">
              <p className="text-sm text-muted-foreground mb-3">Portal URL</p>
              <div className="flex items-center gap-2 mb-4">
                <code className="flex-1 bg-background p-3 rounded text-sm text-foreground truncate border">
                  {portalUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(portalUrl)}
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this URL with your client so they can submit scope change requests
              </p>
            </Card>

            <Card className="p-6 bg-emerald-50 border-emerald-200">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 mb-1">
                    Project created successfully!
                  </p>
                  <p className="text-sm text-emerald-800">
                    Your project is now ready to receive scope requests from your client.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3 | 4)}
          disabled={step === 1}
        >
          Back
        </Button>

        <div className="flex items-center gap-2">
          {step < 4 && (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
          {step === 4 && (
            <Button onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Go to Projects'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
