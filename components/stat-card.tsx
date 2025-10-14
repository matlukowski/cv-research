import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';
  className?: string;
  onClick?: () => void;
}

/**
 * StatCard - Dashboard metrics card with icon, value, and optional trend
 *
 * Usage:
 * <StatCard
 *   title="Total CVs"
 *   value={147}
 *   subtitle="Last 30 days"
 *   icon={FileText}
 *   trend={{ value: 12, isPositive: true }}
 *   color="primary"
 * />
 */
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  className,
  onClick,
}: StatCardProps) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50 dark:bg-primary-950/20',
      icon: 'text-primary-600 dark:text-primary-400',
      text: 'text-primary-900 dark:text-primary-100',
    },
    secondary: {
      bg: 'bg-secondary-50 dark:bg-secondary-950/20',
      icon: 'text-secondary-600 dark:text-secondary-400',
      text: 'text-secondary-900 dark:text-secondary-100',
    },
    accent: {
      bg: 'bg-accent-50 dark:bg-accent-950/20',
      icon: 'text-accent-600 dark:text-accent-400',
      text: 'text-accent-900 dark:text-accent-100',
    },
    success: {
      bg: 'bg-success-light dark:bg-success-dark/20',
      icon: 'text-success-dark dark:text-success',
      text: 'text-success-dark dark:text-success-light',
    },
    warning: {
      bg: 'bg-warning-light dark:bg-warning-dark/20',
      icon: 'text-warning-dark dark:text-warning',
      text: 'text-warning-dark dark:text-warning-light',
    },
    info: {
      bg: 'bg-info-light dark:bg-info-dark/20',
      icon: 'text-info-dark dark:text-info',
      text: 'text-info-dark dark:text-info-light',
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-900 p-6',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5',
        className
      )}
      onClick={onClick}
    >
      {/* Background decoration */}
      <div
        className={cn(
          'absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10',
          colors.bg
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>

          {/* Value */}
          <p
            className={cn(
              'text-3xl font-bold mb-1',
              'text-gray-900 dark:text-gray-100'
            )}
          >
            {value}
          </p>

          {/* Subtitle or Trend */}
          <div className="flex items-center gap-2">
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}

            {trend && (
              <div
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  trend.isPositive
                    ? 'bg-success-light text-success-dark'
                    : 'bg-error-light text-error-dark'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Icon */}
        {Icon && (
          <div
            className={cn(
              'flex items-center justify-center',
              'w-12 h-12 rounded-lg',
              colors.bg
            )}
          >
            <Icon className={cn('w-6 h-6', colors.icon)} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StatCardGrid - Grid layout for multiple stat cards
 */
export function StatCardGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {children}
    </div>
  );
}

/**
 * StatCardSkeleton - Loading skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shimmer" />
      </div>
    </div>
  );
}
