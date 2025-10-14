import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  text?: string;
  fullPage?: boolean;
  className?: string;
}

/**
 * LoadingSpinner - Animated loading indicator
 *
 * Usage:
 * <LoadingSpinner size="lg" text="Processing CVs..." />
 * <LoadingSpinner fullPage />
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  text,
  fullPage = false,
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const variantClasses = {
    default: 'text-gray-600 dark:text-gray-400',
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
  };

  const content = (
    <div className="flex flex-col items-center gap-3">
      <Loader2
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      {content}
    </div>
  );
}

/**
 * LoadingSkeleton - Skeleton loader for content
 */
export function LoadingSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer',
            i === lines - 1 && 'w-3/4'
          )}
        />
      ))}
    </div>
  );
}

/**
 * LoadingDots - Animated dots indicator
 */
export function LoadingDots({
  size = 'md',
  color = 'primary',
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  className?: string;
}) {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotColors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-600',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            dotSizes[size],
            dotColors[color]
          )}
          style={{
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * LoadingBar - Progress bar loader
 */
export function LoadingBar({
  progress,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: {
  progress?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    accent: 'bg-accent-600',
    success: 'bg-success',
  };

  const isIndeterminate = progress === undefined;

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          heightClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            variantClasses[variant],
            isIndeterminate && 'animate-pulse'
          )}
          style={{
            width: isIndeterminate ? '100%' : `${progress}%`,
          }}
        />
      </div>

      {showLabel && progress !== undefined && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
          {progress}%
        </p>
      )}
    </div>
  );
}

/**
 * LoadingOverlay - Overlay spinner for cards or sections
 */
export function LoadingOverlay({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10',
        'flex flex-col items-center justify-center',
        'bg-background/80 backdrop-blur-sm rounded-xl',
        className
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-primary-600 mb-2" />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );
}
