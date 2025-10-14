import React from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
  Circle
} from 'lucide-react';

type CVStatus = 'pending' | 'processing' | 'processed' | 'rejected' | 'error';
type PositionStatus = 'active' | 'closed' | 'draft';
type MatchQuality = 'excellent' | 'good' | 'medium' | 'low';

interface StatusBadgeProps {
  status: CVStatus | PositionStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  variant?: 'default' | 'dot' | 'pill';
  className?: string;
}

/**
 * StatusBadge - Enhanced status indicator with icons
 *
 * Usage:
 * <StatusBadge status="processed" showIcon />
 * <StatusBadge status="active" variant="dot" />
 */
export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  variant = 'default',
  className,
}: StatusBadgeProps) {
  // Status configurations
  const statusConfig = {
    // CV Statuses
    processed: {
      label: 'Processed',
      color: 'status-processed',
      icon: CheckCircle2,
      dotColor: 'bg-success',
    },
    pending: {
      label: 'Pending',
      color: 'status-pending',
      icon: Clock,
      dotColor: 'bg-warning',
    },
    processing: {
      label: 'Processing',
      color: 'status-processing',
      icon: Loader2,
      dotColor: 'bg-info',
      animated: true,
    },
    rejected: {
      label: 'Rejected',
      color: 'status-rejected',
      icon: XCircle,
      dotColor: 'bg-error',
    },
    error: {
      label: 'Error',
      color: 'status-rejected',
      icon: AlertCircle,
      dotColor: 'bg-error',
    },

    // Position Statuses
    active: {
      label: 'Active',
      color: 'bg-success-light text-success-dark border-success',
      icon: CheckCircle2,
      dotColor: 'bg-success',
    },
    closed: {
      label: 'Closed',
      color: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300',
      icon: XCircle,
      dotColor: 'bg-gray-500',
    },
    draft: {
      label: 'Draft',
      color: 'bg-warning-light text-warning-dark border-warning',
      icon: Clock,
      dotColor: 'bg-warning',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: Circle,
    dotColor: 'bg-gray-500',
  };

  const Icon = config.icon;

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  // Variant: Dot
  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2',
          sizeClasses[size],
          'font-medium',
          className
        )}
      >
        <span
          className={cn(
            'rounded-full',
            dotSizes[size],
            config.dotColor,
            config.animated && 'animate-pulse'
          )}
        />
        <span className="text-gray-700 dark:text-gray-300">{config.label}</span>
      </span>
    );
  }

  // Variant: Pill
  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5',
          'rounded-full border font-medium',
          sizeClasses[size],
          config.color,
          className
        )}
      >
        {showIcon && (
          <Icon
            className={cn(iconSizes[size], config.animated && 'animate-spin')}
          />
        )}
        <span>{config.label}</span>
      </span>
    );
  }

  // Variant: Default (rounded rectangle)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-md border font-medium',
        sizeClasses[size],
        config.color,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(iconSizes[size], config.animated && 'animate-spin')}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}

/**
 * MatchQualityBadge - Badge specifically for match quality scores
 */
export function MatchQualityBadge({
  quality,
  score,
  size = 'md',
  className,
}: {
  quality: MatchQuality;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const qualityConfig = {
    excellent: {
      label: 'Excellent Match',
      color: 'match-excellent',
      emoji: '🎯',
    },
    good: {
      label: 'Good Match',
      color: 'match-good',
      emoji: '✨',
    },
    medium: {
      label: 'Medium Match',
      color: 'match-medium',
      emoji: '⚡',
    },
    low: {
      label: 'Low Match',
      color: 'match-low',
      emoji: '📊',
    },
  };

  const config = qualityConfig[quality];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'rounded-md border font-medium',
        sizeClasses[size],
        config.color,
        className
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="font-bold ml-1">{score}/100</span>
      )}
    </span>
  );
}

/**
 * StatusGroup - Group multiple status badges
 */
export function StatusGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {children}
    </div>
  );
}

/**
 * StatusIndicator - Simple colored dot indicator
 */
export function StatusIndicator({
  status,
  size = 'md',
  pulse = false,
  className,
}: {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}) {
  const statusColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-gray-400',
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <span
        className={cn(
          'rounded-full',
          sizes[size],
          statusColors[status],
          pulse && 'animate-pulse'
        )}
      />
      {pulse && (
        <span
          className={cn(
            'absolute inline-flex rounded-full opacity-75',
            'animate-ping',
            sizes[size],
            statusColors[status]
          )}
        />
      )}
    </span>
  );
}
