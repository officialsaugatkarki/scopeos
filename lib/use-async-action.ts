'use client';

import { useState, useCallback } from 'react';
import { toast } from '@/lib/toast';

interface UseAsyncActionOptions {
  onSuccess?: (data?: any) => void | Promise<void>;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAsyncAction(options: UseAsyncActionOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <T extends any[], R>(
      action: (...args: T) => Promise<R>,
      ...args: T
    ): Promise<R | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await action(...args);

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        if (options.onSuccess) {
          await options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);

        const errorMsg =
          options.errorMessage ||
          (error instanceof Error ? error.message : 'An error occurred');

        toast.error(errorMsg);

        options.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    execute,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
