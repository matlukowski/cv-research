import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        primary:
          'border-transparent bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary:
          'border-transparent bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
        accent:
          'border-transparent bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500',
        success:
          'border-transparent bg-success text-white hover:bg-success-dark focus:ring-success',
        warning:
          'border-transparent bg-warning text-white hover:bg-warning-dark focus:ring-warning',
        error:
          'border-transparent bg-error text-white hover:bg-error-dark focus:ring-error',
        info:
          'border-transparent bg-info text-white hover:bg-info-dark focus:ring-info',
        outline:
          'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
        ghost:
          'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
        // Light variants
        'primary-light':
          'border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300',
        'secondary-light':
          'border-secondary-200 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 dark:border-secondary-800 dark:bg-secondary-950/50 dark:text-secondary-300',
        'accent-light':
          'border-accent-200 bg-accent-50 text-accent-700 hover:bg-accent-100 dark:border-accent-800 dark:bg-accent-950/50 dark:text-accent-300',
        'success-light':
          'border-success/20 bg-success-light text-success-dark hover:bg-success-light/80',
        'warning-light':
          'border-warning/20 bg-warning-light text-warning-dark hover:bg-warning-light/80',
        'error-light':
          'border-error/20 bg-error-light text-error-dark hover:bg-error-light/80',
        'info-light':
          'border-info/20 bg-info-light text-info-dark hover:bg-info-light/80',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, rounded, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, rounded }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
