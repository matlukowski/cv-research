import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * ScoreBadge - Circular AI score indicator with gradient
 *
 * Score ranges:
 * - 86-100: Excellent (green-blue gradient)
 * - 71-85: Very Good (blue-purple gradient)
 * - 51-70: Good (orange gradient)
 * - 0-50: Low (red gradient)
 */
export function ScoreBadge({
  score,
  size = 'md',
  showLabel = true,
  animated = false,
  className,
}: ScoreBadgeProps) {
  // Determine gradient class based on score
  const getScoreClass = () => {
    if (score >= 86) return 'score-gradient-excellent';
    if (score >= 71) return 'score-gradient-good';
    if (score >= 51) return 'score-gradient-medium';
    return 'score-gradient-low';
  };

  // Determine label text
  const getScoreLabel = () => {
    if (score >= 86) return 'Excellent Match';
    if (score >= 71) return 'Very Good Match';
    if (score >= 51) return 'Good Match';
    return 'Low Match';
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-24 h-24 text-xl',
  };

  const progressSize = {
    sm: 44,
    md: 60,
    lg: 76,
    xl: 92,
  };

  const strokeWidth = {
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
  };

  const radius = (progressSize[size] - strokeWidth[size]) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {/* Circular score badge */}
      <div className="relative inline-flex items-center justify-center">
        {/* Background circle */}
        <svg
          className={cn(
            sizeClasses[size],
            'transform -rotate-90',
            animated && 'transition-all duration-500'
          )}
          viewBox={`0 0 ${progressSize[size]} ${progressSize[size]}`}
        >
          {/* Background track */}
          <circle
            cx={progressSize[size] / 2}
            cy={progressSize[size] / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            className="text-gray-200 dark:text-gray-700"
          />

          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              {score >= 86 && (
                <>
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </>
              )}
              {score >= 71 && score < 86 && (
                <>
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </>
              )}
              {score >= 51 && score < 71 && (
                <>
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </>
              )}
              {score < 51 && (
                <>
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </>
              )}
            </linearGradient>
          </defs>

          <circle
            cx={progressSize[size] / 2}
            cy={progressSize[size] / 2}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${score})`}
            strokeWidth={strokeWidth[size]}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-1000 ease-out',
              animated && 'animate-pulse-glow'
            )}
          />
        </svg>

        {/* Score number */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'font-bold text-gray-900 dark:text-gray-100'
          )}
        >
          <div className="text-center">
            <div className={cn(
              size === 'sm' && 'text-base',
              size === 'md' && 'text-xl',
              size === 'lg' && 'text-2xl',
              size === 'xl' && 'text-3xl',
            )}>
              {score}
            </div>
            {size !== 'sm' && (
              <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                /100
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="text-center">
          <div className={cn(
            'font-medium',
            score >= 86 && 'text-success-dark',
            score >= 71 && score < 86 && 'text-primary-700',
            score >= 51 && score < 71 && 'text-warning-dark',
            score < 51 && 'text-error-dark'
          )}>
            {getScoreLabel()}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple score badge without circular progress (for inline use)
 */
export function ScoreBadgeSimple({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const getScoreClass = () => {
    if (score >= 86) return 'bg-success text-white';
    if (score >= 71) return 'bg-primary-600 text-white';
    if (score >= 51) return 'bg-warning text-white';
    return 'bg-error text-white';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'px-2.5 py-1 rounded-full font-semibold text-sm',
        getScoreClass(),
        className
      )}
    >
      🤖 {score}
    </span>
  );
}
