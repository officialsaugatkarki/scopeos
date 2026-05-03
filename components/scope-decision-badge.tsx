'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface ScopeDecisionBadgeProps {
  decision: 'in-scope' | 'out-of-scope' | 'needs-info';
  size?: 'sm' | 'md' | 'lg';
}

export default function ScopeDecisionBadge({ decision, size = 'md' }: ScopeDecisionBadgeProps) {
  const getVariant = () => {
    switch (decision) {
      case 'in-scope':
        return 'default';
      case 'out-of-scope':
        return 'destructive';
      case 'needs-info':
        return 'secondary';
    }
  };

  const getLabel = () => {
    switch (decision) {
      case 'in-scope':
        return 'In Scope';
      case 'out-of-scope':
        return 'Out of Scope';
      case 'needs-info':
        return 'Needs Info';
    }
  };

  const getIcon = () => {
    switch (decision) {
      case 'in-scope':
        return <CheckCircle2 className={`w-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'} h-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'}`} />;
      case 'out-of-scope':
        return <AlertCircle className={`w-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'} h-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'}`} />;
      case 'needs-info':
        return <HelpCircle className={`w-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'} h-${size === 'sm' ? '3' : size === 'lg' ? '5' : '4'}`} />;
    }
  };

  return (
    <Badge variant={getVariant()} className="flex items-center gap-1.5 px-3 py-1">
      {getIcon()}
      <span>{getLabel()}</span>
    </Badge>
  );
}
