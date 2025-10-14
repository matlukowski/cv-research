import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'default' | 'search' | 'upload' | 'success' | 'error';
  className?: string;
}

/**
 * EmptyState - Professional empty state component
 *
 * Usage:
 * <EmptyState
 *   icon={FileText}
 *   title="No CVs yet"
 *   description="Connect your Gmail to start collecting CVs automatically"
 *   action={{ label: "Connect Gmail", onClick: handleConnect }}
 * />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration = 'default',
  className,
}: EmptyStateProps) {
  const illustrationEmoji = {
    default: '📭',
    search: '🔍',
    upload: '📤',
    success: '✅',
    error: '❌',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-16 px-4 text-center',
        'bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700',
        'animate-fade-in',
        className
      )}
    >
      {/* Icon with background */}
      <div className="relative mb-6">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-2xl" />

        {/* Icon container */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
          <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Emoji badge */}
        <div className="absolute -bottom-2 -right-2 text-3xl">
          {illustrationEmoji[illustration]}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {description}
      </p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Button onClick={action.onClick} size="lg">
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="lg"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * EmptyStateCompact - Smaller version for inline use
 */
export function EmptyStateCompact({
  icon: Icon,
  title,
  description,
  action,
  className,
}: Omit<EmptyStateProps, 'secondaryAction' | 'illustration'>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-8 px-4 text-center',
        className
      )}
    >
      <Icon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />

      <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyStateList - Empty state for list views
 */
export function EmptyStateList({
  title,
  description,
  action,
  className,
}: Omit<EmptyStateProps, 'icon' | 'secondaryAction' | 'illustration'>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-12 px-4 text-center border-t border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        {description}
      </p>

      {action && (
        <Button onClick={action.onClick} size="sm" variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyStateSearch - Empty state specifically for search results
 */
export function EmptyStateSearch({
  query,
  onReset,
  className,
}: {
  query: string;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-12 px-4 text-center',
        className
      )}
    >
      <div className="text-6xl mb-4">🔍</div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No results found
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        No results found for{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          "{query}"
        </span>
      </p>

      {onReset && (
        <Button onClick={onReset} variant="outline" size="sm">
          Clear filters
        </Button>
      )}
    </div>
  );
}

/**
 * EmptyStateError - Empty state for error scenarios
 */
export function EmptyStateError({
  title = 'Something went wrong',
  description = 'An error occurred while loading this content',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-12 px-4 text-center',
        'bg-error-light/20 dark:bg-error-dark/10 rounded-xl border border-error/20',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-error-light dark:bg-error-dark/20 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        {description}
      </p>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}
