'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface Step {
  label: string;
  completed: boolean;
}

const ANALYSIS_STEPS = [
  'Reading request',
  'Extracting intent',
  'Comparing to scope baseline',
  'Generating recommendations',
];

export function AILoadingState() {
  const [steps, setSteps] = useState<Step[]>(
    ANALYSIS_STEPS.map((label) => ({ label, completed: false }))
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 30;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stepsCompleted = Math.floor((progress / 100) * ANALYSIS_STEPS.length);
    setSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        completed: idx < stepsCompleted,
      }))
    );
  }, [progress]);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 backdrop-blur">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Analyzing request with AI</h3>
      </div>

      <div className="space-y-3 mb-6">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {step.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : idx === Math.floor((progress / 100) * ANALYSIS_STEPS.length) ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-muted" />
            )}
            <span
              className={`text-sm ${
                step.completed ? 'text-emerald-600 font-medium' : 'text-muted-foreground'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Analysis progress</span>
          <span className="text-xs font-semibold text-primary">{Math.min(Math.round(progress), 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
