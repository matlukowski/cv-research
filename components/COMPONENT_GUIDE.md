# CV Research ATS - Component Guide

Professional UI components for the AI-powered Applicant Tracking System.

## Design System

### Colors

- **Primary (Deep Blue)**: `#1e40af` - Trust, professionalism, technology
- **Secondary (Purple)**: `#7c3aed` - Innovation, AI, premium
- **Accent (Emerald)**: `#10b981` - Success, positive actions
- **Status Colors**:
  - Success: `#10b981` (processed, high match)
  - Warning: `#f59e0b` (pending, medium match)
  - Error: `#ef4444` (rejected, low match)
  - Info: `#3b82f6` (processing, neutral)

### Custom Utilities

```tsx
// Card hover effect
className="card-hover"

// Score gradients
className="score-gradient-excellent" // 86-100
className="score-gradient-good"      // 71-85
className="score-gradient-medium"    // 51-70
className="score-gradient-low"       // 0-50

// Text truncation
className="truncate-2"  // 2 lines
className="truncate-3"  // 3 lines

// Animations
className="shimmer"           // Loading animation
className="pulse-glow"        // Pulsing effect
className="animate-fade-in"   // Fade in
className="animate-slide-in"  // Slide in
className="animate-scale-in"  // Scale in
```

## Components

### 1. ScoreBadge

Circular AI score indicator with gradient and progress ring.

```tsx
import { ScoreBadge, ScoreBadgeSimple } from '@/components';

// Full circular badge with progress
<ScoreBadge
  score={92}
  size="lg"
  showLabel={true}
  animated={true}
/>

// Simple inline badge
<ScoreBadgeSimple score={85} />
```

**Props:**
- `score` (number): Score value 0-100
- `size` ('sm' | 'md' | 'lg' | 'xl'): Badge size
- `showLabel` (boolean): Show label below score
- `animated` (boolean): Enable pulse animation

**Score Ranges:**
- 86-100: Excellent (green-blue gradient)
- 71-85: Very Good (blue-purple gradient)
- 51-70: Good (orange gradient)
- 0-50: Low (red gradient)

---

### 2. StatCard

Dashboard metrics card with icon, value, and optional trend.

```tsx
import { StatCard, StatCardGrid, StatCardSkeleton } from '@/components';
import { FileText } from 'lucide-react';

// Single stat card
<StatCard
  title="Total CVs"
  value={147}
  subtitle="Last 30 days"
  icon={FileText}
  trend={{ value: 12, isPositive: true }}
  color="primary"
  onClick={() => navigate('/cvs')}
/>

// Grid layout
<StatCardGrid columns={4}>
  <StatCard {...} />
  <StatCard {...} />
  <StatCard {...} />
  <StatCard {...} />
</StatCardGrid>

// Loading skeleton
<StatCardSkeleton />
```

**Props:**
- `title` (string): Card title
- `value` (string | number): Main value to display
- `subtitle` (string): Optional subtitle
- `icon` (LucideIcon): Optional icon
- `trend` ({ value: number, isPositive: boolean }): Trend indicator
- `color` ('primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info')
- `onClick` (() => void): Optional click handler

---

### 3. StatusBadge

Enhanced status indicator with icons and multiple variants.

```tsx
import {
  StatusBadge,
  MatchQualityBadge,
  StatusGroup,
  StatusIndicator
} from '@/components';

// CV status
<StatusBadge status="processed" showIcon variant="default" />
<StatusBadge status="pending" variant="dot" />
<StatusBadge status="processing" variant="pill" />

// Position status
<StatusBadge status="active" />
<StatusBadge status="closed" />
<StatusBadge status="draft" />

// Match quality
<MatchQualityBadge quality="excellent" score={92} />

// Status indicator (dot only)
<StatusIndicator status="success" pulse={true} />

// Group multiple statuses
<StatusGroup>
  <StatusBadge status="active" />
  <StatusBadge status="pending" />
</StatusGroup>
```

**Supported Statuses:**
- CV: `pending`, `processing`, `processed`, `rejected`, `error`
- Position: `active`, `closed`, `draft`

---

### 4. EmptyState

Professional empty state components for various scenarios.

```tsx
import {
  EmptyState,
  EmptyStateCompact,
  EmptyStateList,
  EmptyStateSearch,
  EmptyStateError
} from '@/components';
import { FileText } from 'lucide-react';

// Full empty state
<EmptyState
  icon={FileText}
  title="No CVs yet"
  description="Connect your Gmail to start collecting CVs automatically"
  action={{
    label: "Connect Gmail",
    onClick: handleConnect
  }}
  secondaryAction={{
    label: "Upload manually",
    onClick: handleUpload
  }}
  illustration="default"
/>

// Compact version
<EmptyStateCompact
  icon={FileText}
  title="No results"
  description="Try adjusting your filters"
  action={{ label: "Reset", onClick: reset }}
/>

// Search results
<EmptyStateSearch
  query="John Doe"
  onReset={clearSearch}
/>

// Error state
<EmptyStateError
  title="Failed to load"
  description="An error occurred"
  onRetry={retryLoad}
/>
```

**Illustration Options:**
- `default` - 📭 (mailbox)
- `search` - 🔍 (magnifying glass)
- `upload` - 📤 (outbox)
- `success` - ✅ (checkmark)
- `error` - ❌ (cross)

---

### 5. Loading Components

Various loading indicators and skeletons.

```tsx
import {
  LoadingSpinner,
  LoadingSkeleton,
  LoadingDots,
  LoadingBar,
  LoadingOverlay
} from '@/components';

// Spinner
<LoadingSpinner
  size="lg"
  text="Processing CVs..."
  variant="primary"
/>

// Full page spinner
<LoadingSpinner fullPage />

// Skeleton loader
<LoadingSkeleton lines={3} />

// Animated dots
<LoadingDots size="md" color="primary" />

// Progress bar
<LoadingBar
  progress={65}
  variant="success"
  showLabel
/>

// Card overlay
<div className="relative">
  {/* Card content */}
  <LoadingOverlay text="Loading..." />
</div>
```

---

### 6. Badge (Enhanced)

Updated badge component with new design system colors.

```tsx
import { Badge } from '@/components';
import { CheckCircle } from 'lucide-react';

// Solid variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// Light variants
<Badge variant="primary-light">Primary Light</Badge>
<Badge variant="success-light">Success Light</Badge>

// Other variants
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>

// With icon
<Badge variant="success" icon={<CheckCircle size={12} />}>
  Completed
</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Rounded variants
<Badge rounded="default">Default</Badge>
<Badge rounded="full">Pill</Badge>
<Badge rounded="lg">Large Radius</Badge>
```

---

### 7. FormattedText

Intelligent text formatter for job descriptions.

```tsx
import { FormattedText } from '@/components';

// Automatically formats:
// - Bullet lists (-, *, •)
// - Numbered lists (1., 2., 3.)
// - Section headers (UPPERCASE or ending with :)
// - Proper spacing and indentation

<FormattedText text={position.description} />

// Input text:
// REQUIREMENTS:
// - 5+ years experience
// - Strong React skills
//
// RESPONSIBILITIES:
// 1. Design architecture
// 2. Code review
// 3. Mentor team

// Output: Beautifully formatted with proper HTML tags and styling
```

---

## Usage Examples

### Dashboard Page

```tsx
import { StatCard, StatCardGrid } from '@/components';
import { FileText, Briefcase, Users, TrendingUp } from 'lucide-react';

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1>Welcome back! 👋</h1>

      <StatCardGrid columns={4}>
        <StatCard
          title="Total CVs"
          value={147}
          subtitle="Last 30 days"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          color="primary"
        />
        <StatCard
          title="Active Positions"
          value={12}
          icon={Briefcase}
          color="secondary"
        />
        <StatCard
          title="Pending CVs"
          value={8}
          icon={Users}
          color="warning"
        />
        <StatCard
          title="Process Rate"
          value="85%"
          icon={TrendingUp}
          color="success"
        />
      </StatCardGrid>
    </div>
  );
}
```

### CV List with EmptyState

```tsx
import { StatusBadge, EmptyState, LoadingSpinner } from '@/components';
import { FileText } from 'lucide-react';

function CVsList() {
  if (loading) return <LoadingSpinner text="Loading CVs..." />;

  if (cvs.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No CVs collected yet"
        description="Connect your Gmail to start automatically collecting CVs from your inbox"
        action={{
          label: "🔗 Connect Gmail",
          onClick: handleConnectGmail
        }}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {cvs.map(cv => (
        <div key={cv.id} className="card-hover">
          <StatusBadge status={cv.status} />
          {/* CV details */}
        </div>
      ))}
    </div>
  );
}
```

### Match Results Page

```tsx
import { ScoreBadge, MatchQualityBadge, FormattedText } from '@/components';

function MatchResults() {
  return (
    <div className="space-y-4">
      {matches.map(match => (
        <div key={match.id} className="border rounded-xl p-6">
          <div className="flex items-start gap-6">
            <ScoreBadge score={match.score} size="lg" />

            <div className="flex-1">
              <h3>{match.candidate.name}</h3>
              <MatchQualityBadge
                quality="excellent"
                score={match.score}
              />

              <div className="mt-4">
                <h4>Strengths:</h4>
                <FormattedText text={match.strengths} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

1. **Use consistent color variants** across the app
2. **Animate scores** on first load for emphasis
3. **Show loading states** for all async operations
4. **Use empty states** instead of blank pages
5. **Format text** in all job-related content
6. **Add hover effects** to clickable cards
7. **Use status badges** consistently for CV/position states
8. **Group related stats** in StatCardGrid

---

## Color Reference

```tsx
// Use in className
bg-primary-600    // Deep blue
bg-secondary-600  // Vibrant purple
bg-accent-600     // Emerald green

bg-success        // #10b981
bg-warning        // #f59e0b
bg-error          // #ef4444
bg-info           // #3b82f6

// Grays
bg-gray-50 to bg-gray-950

// Status classes (in globals.css)
status-processed
status-pending
status-rejected
status-processing

match-excellent
match-good
match-medium
match-low
```

---

For more examples, check individual component files in `/components` directory.
