'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface ClarificationPanelProps {
  questions: string[];
  onSubmit?: (answers: string[]) => void;
}

export default function ClarificationPanel({ questions, onSubmit }: ClarificationPanelProps) {
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit?.(answers);
    setIsSubmitting(false);
  };

  const allAnswered = answers.every((a) => a.trim().length > 0);

  return (
    <Card className="p-6 border-2 border-amber-200 bg-amber-50">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Clarification Needed</h3>
            <p className="text-sm text-muted-foreground">
              Please answer the following questions to help us better understand your request scope.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="flex items-start gap-2">
                <span className="text-sm font-medium text-foreground mt-1">Q{index + 1}:</span>
                <span className="text-sm text-foreground">{question}</span>
              </label>
              <Textarea
                placeholder="Provide a detailed answer..."
                value={answers[index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="text-sm min-h-20"
              />
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answers'}
        </Button>
      </div>
    </Card>
  );
}
