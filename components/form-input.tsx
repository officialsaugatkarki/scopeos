'use client';

import { InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showPassword?: boolean;
  successMessage?: string;
}

export function FormInput({
  label,
  error,
  hint,
  showPassword = false,
  successMessage,
  type,
  className,
  disabled,
  ...props
}: FormInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';
  const displayType = isPassword && isPasswordVisible ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {props.required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          type={displayType}
          className={cn(
            'h-10 transition-all duration-200',
            error && 'border-destructive focus-visible:ring-destructive/20 bg-destructive/5',
            successMessage && 'border-emerald-500 focus-visible:ring-emerald-500/20 bg-emerald-50/30',
            isPassword && 'pr-10',
            className
          )}
          disabled={disabled}
          {...props}
        />

        {/* Password toggle */}
        {isPassword && showPassword && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Success indicator */}
        {successMessage && !error && (
          <CheckCircle2
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 flex-shrink-0"
          />
        )}

        {/* Error indicator */}
        {error && (
          <AlertCircle
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive flex-shrink-0"
          />
        )}
      </div>

      {/* Helper text */}
      {error ? (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span className="inline-block">{error}</span>
        </p>
      ) : successMessage ? (
        <p className="text-sm text-emerald-600 flex items-center gap-1">
          <span className="inline-block">{successMessage}</span>
        </p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
