'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export function ProgressIndicator({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
}: ProgressIndicatorProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div className={cn('flex gap-4', isVertical && 'flex-col')}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className={cn('flex items-start gap-3', isVertical && 'flex-col')}>
            {/* Step indicator */}
            <button
              onClick={() => onStepClick?.(index)}
              className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isCurrent
                  ? 'bg-primary text-white ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground'
              )}
              disabled={!onStepClick}
            >
              {isCompleted ? (
                <CheckCircle2 size={20} />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>

            {/* Step label and connector */}
            <div className="flex-1 min-w-0">
              <p className={cn('font-medium', isCurrent && 'text-foreground')}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              )}
            </div>

            {/* Connector line */}
            {!isVertical && index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-shrink-0 h-1 w-8 mt-5 rounded-full',
                  isCompleted || isCurrent ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
