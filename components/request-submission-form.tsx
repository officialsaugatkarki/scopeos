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
  onSubmit?: (data: {
    title: string;
    description: string;
    attachments: string[];
  }) => void;
}

export default function RequestSubmissionForm({
  projectId,
  projectName,
  onSubmit,
}: RequestSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    if (onSubmit) {
      await onSubmit({
        title,
        description,
        attachments,
      });
    }

    setTitle('');
    setDescription('');
    setAttachments([]);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const isValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Submit a Change Request</h2>
          <p className="text-muted-foreground">
            Project: <span className="font-semibold">{projectName}</span>
          </p>
        </div>

        {submitSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
            ✓ Your request has been submitted successfully! The PM will review it shortly.
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <p>
              Our AI analyzes your request to determine if it&apos;s within the project scope. 
              You may be asked clarifying questions to help us make the best decision.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">
              Request Title *
            </span>
            <Input
              placeholder="e.g., Add customer testimonials section"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-1 block">
              Detailed Description *
            </span>
            <Textarea
              placeholder="Describe what you want to add or change. Include as much detail as possible..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-sm min-h-32"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            {description.length} characters
          </p>
        </div>

        <div>
          <label className="block">
            <span className="text-sm font-medium text-foreground mb-2 block">
              Attachments (Optional)
            </span>
            <Button variant="outline" className="w-full" type="button">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files (Images, Designs, etc.)
            </Button>
          </label>
          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                >
                  <span>{file}</span>
                  <button
                    onClick={() =>
                      setAttachments(attachments.filter((_, i) => i !== idx))
                    }
                    className="text-destructive hover:text-destructive/80"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </Card>
  );
}
