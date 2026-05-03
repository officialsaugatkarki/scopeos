'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  href?: string;
}

const INITIAL_ITEMS: ChecklistItem[] = [
  { id: 'project', label: 'Create first project', completed: false, href: '/dashboard/projects/new' },
  { id: 'scope', label: 'Upload scope document', completed: false },
  { id: 'client', label: 'Invite client', completed: false },
  { id: 'request', label: 'Receive first request', completed: false },
];

export function OnboardingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>(INITIAL_ITEMS);
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;

  const handleToggle = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const isComplete = completedCount === totalCount;

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-primary">{completedCount}/{totalCount}</div>
          <div>
            <h3 className="font-semibold text-foreground">Onboarding Checklist</h3>
            <p className="text-xs text-muted-foreground">Get your account ready</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded transition-colors"
          aria-expanded={isExpanded}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="mb-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className="flex-shrink-0 transition-colors"
                  aria-label={`Toggle ${item.label}`}
                >
                  {item.completed ? (
                    <CheckCircle2 size={20} className="text-emerald-600" />
                  ) : (
                    <Circle size={20} className="text-muted-foreground" />
                  )}
                </button>
                <span
                  className={`text-sm flex-1 ${
                    item.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {item.href && !item.completed && (
                  <Link href={item.href}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Go
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
              <p className="text-sm font-medium text-emerald-700">You&apos;re all set! Start managing scope like a pro.</p>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
