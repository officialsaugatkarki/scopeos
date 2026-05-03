'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { ScopeDocument } from '@/lib/supabase';

interface ScopeDocumentViewProps {
  document: ScopeDocument;
  projectName?: string;
}

export function ScopeDocumentView({ document, projectName }: ScopeDocumentViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{document.title}</h2>
          {projectName && (
            <p className="text-muted-foreground">Project: {projectName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Document Sections */}
      <div className="space-y-4">
        {document.sections.map((section, idx) => (
          <Card key={idx} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-3">
              <Badge variant="outline" className="font-bold text-lg px-3 py-1">
                {section.section_number}
              </Badge>
              <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
            </div>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed ml-16">
              {section.content}
            </p>
          </Card>
        ))}
      </div>

      {/* Document Info */}
      <Card className="p-4 bg-muted/50">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Created: {new Date(document.created_at).toLocaleDateString()}</span>
          <span>Last Updated: {new Date(document.updated_at).toLocaleDateString()}</span>
        </div>
      </Card>
    </div>
  );
}
