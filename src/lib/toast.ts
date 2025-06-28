// src/lib/toast.ts
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Base styles for all toasts
const baseClass = cn(
  'p-4',
  'rounded-lg',
  'border',
  'shadow-md',
  'font-medium',
  'max-w-sm',
  'w-full'
);

// Default options
const baseOptions = {
  className: cn(baseClass, 'bg-card-foreground text-card border-border'),
  duration: 5000, // 5 seconds
};

export const Toast = {
  success: (message: string) =>
    toast.success(message, {
      ...baseOptions,
      icon: '✅',
      className: cn(baseClass, 'bg-green text-white border-green'),
    }),

  error: (message: string) =>
    toast.error(message, {
      ...baseOptions,
      icon: '❌',
      className: cn(baseClass, 'bg-red text-white border-red'),
    }),

  info: (message: string) =>
    toast(message, {
      ...baseOptions,
      icon: 'ℹ️',
      className: cn(baseClass, 'bg-blue text-white border-blue'),
    }),

  loading: (message: string) =>
    toast(message, {
      ...baseOptions,
      icon: '⏳',
      className: cn(
        baseClass,
        'bg-muted-foreground text-muted border-muted-foreground'
      ),
    }),

  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) =>
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...baseOptions,
    }),
};
