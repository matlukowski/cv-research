/**
 * CV Research ATS - Component Library
 * Professional, modern UI components for AI-powered Applicant Tracking System
 */

// === CORE UI COMPONENTS ===
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Button } from './button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Input } from './input';
export { Label } from './label';
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';

// === NEW ATS COMPONENTS ===

// Score Badges
export { ScoreBadge, ScoreBadgeSimple } from './score-badge';

// Stat Cards
export { StatCard, StatCardGrid, StatCardSkeleton } from './stat-card';

// Status Badges
export {
  StatusBadge,
  MatchQualityBadge,
  StatusGroup,
  StatusIndicator,
} from './status-badge';

// Empty States
export {
  EmptyState,
  EmptyStateCompact,
  EmptyStateList,
  EmptyStateSearch,
  EmptyStateError,
} from './empty-state';

// Loading Components
export {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingDots,
  LoadingBar,
  LoadingOverlay,
} from './loading-spinner';

// Text Formatting
export { FormattedText, formatText } from '@/lib/utils/text-formatter';
