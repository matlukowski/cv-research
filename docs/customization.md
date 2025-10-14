# 🎨 Customization Guide

This guide will help you customize the boilerplate for your SaaS product.

## Branding

### 1. Update Site Name

**App Metadata** (`app/layout.tsx`):
```typescript
export const metadata: Metadata = {
  title: 'Your SaaS Name',
  description: 'Your SaaS description'
};
```

**Header Logo** (`app/(dashboard)/layout.tsx`):
```tsx
<Link href="/" className="flex items-center">
  <CircleIcon className="h-6 w-6 text-orange-500" />
  <span className="ml-2 text-xl font-semibold text-gray-900">
    Your SaaS Name
  </span>
</Link>
```

### 2. Update Colors

**Primary Color** (currently orange):

In your components, replace:
- `text-orange-500` → `text-yourcolor-500`
- `bg-orange-500` → `bg-yourcolor-500`

Or update Tailwind config for global changes:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#...',
          500: '#...',
          900: '#...'
        }
      }
    }
  }
}
```

Then use `text-primary-500`, `bg-primary-500`, etc.

### 3. Add Your Logo

Replace the `CircleIcon` in the header:

```tsx
// Option 1: SVG Logo
<svg width="32" height="32" viewBox="0 0 32 32">
  {/* Your SVG paths */}
</svg>

// Option 2: Image Logo
import Image from 'next/image';
<Image src="/logo.png" alt="Logo" width={32} height={32} />
```

### 4. Update Favicon

Replace `app/favicon.ico` with your own favicon.

Generate favicons: [realfavicongenerator.net](https://realfavicongenerator.net/)

## Email Customization

### Change Email Branding

**Update `lib/email/templates.tsx`**:

```tsx
// Change colors
<h1 style={{ color: '#YOUR_COLOR' }}>
  Welcome to YOUR_SAAS_NAME, {userName}! 🎉
</h1>

// Add logo
<img 
  src="https://yourdomain.com/email-logo.png" 
  alt="Logo" 
  style={{ width: '120px', marginBottom: '20px' }}
/>
```

### Update From Email

In `.env`:
```env
RESEND_FROM_EMAIL=hello@yourdomain.com
```

## Landing Page

### 1. Update Hero Section

`app/(dashboard)/page.tsx`:

```tsx
<h1 className="text-4xl font-bold">
  Your Custom Headline
  <span className="block text-primary-500">
    Your Subheadline
  </span>
</h1>
<p className="mt-3 text-base text-gray-500">
  Your custom description...
</p>
```

### 2. Update Feature Cards

Change the three feature cards:

```tsx
<div>
  <YourIcon className="h-6 w-6" />
  <h2>Your Feature Title</h2>
  <p>Your feature description</p>
</div>
```

### 3. Update Terminal Commands

`app/(dashboard)/terminal.tsx`:

```tsx
const terminalSteps = [
  'git clone https://github.com/YOUR_USERNAME/YOUR_REPO',
  'pnpm install',
  'pnpm setup',
  // ... your custom commands
];
```

## Pricing

### Update Pricing Plans

1. Create products in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Copy price IDs
3. Update `app/(dashboard)/pricing/page.tsx`:

```tsx
const plans = [
  {
    name: 'Starter',
    price: '$19',
    priceId: 'price_YOUR_STRIPE_PRICE_ID',
    features: ['Feature 1', 'Feature 2']
  },
  // ... more plans
];
```

## Database Schema

### Add Custom Tables

1. Edit `lib/db/schema.ts`:

```typescript
export const yourTable = pgTable('your_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  // ... your fields
});
```

2. Generate migration:
```bash
pnpm db:generate
```

3. Apply migration:
```bash
pnpm db:migrate
```

### Add Custom Queries

Create in `lib/db/queries.ts`:

```typescript
export async function getYourData() {
  return await db.select().from(yourTable);
}
```

## Dashboard

### Add New Pages

1. Create file: `app/(dashboard)/dashboard/your-page/page.tsx`

```tsx
export default function YourPage() {
  return (
    <div className="p-8">
      <h1>Your Page</h1>
    </div>
  );
}
```

2. Add to sidebar: `app/(dashboard)/dashboard/layout.tsx`

```typescript
const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/your-page', icon: YourIcon, label: 'Your Page' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' }
];
```

## API Routes

### Add Custom Endpoints

Create `app/api/your-endpoint/route.ts`:

```typescript
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic here
  return Response.json({ data: 'your data' });
}
```

## Authentication

### Customize Clerk Appearance

In `app/layout.tsx`:

```tsx
<ClerkProvider
  appearance={{
    variables: {
      colorPrimary: '#YOUR_COLOR',
      borderRadius: '0.5rem'
    },
    elements: {
      card: 'shadow-lg',
      formButtonPrimary: 'bg-primary-500 hover:bg-primary-600'
    }
  }}
>
  {children}
</ClerkProvider>
```

### Add OAuth Providers

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **User & Authentication > Social Connections**
3. Enable providers (Google, GitHub, etc.)
4. Configure OAuth settings

## Deployment

### Update Environment Variables

For production, update in your hosting platform:

```env
# Update these with your production values
POSTGRES_URL=your_production_db_url
BASE_URL=https://yourdomain.com
RESEND_FROM_EMAIL=hello@yourdomain.com
```

### Custom Domain

1. Add domain in Vercel/Netlify dashboard
2. Update DNS records
3. Update `BASE_URL` in environment variables
4. Update Stripe webhook URL
5. Update Clerk allowed domains

## Advanced Customization

### Add Analytics

```bash
pnpm add @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Add Error Tracking (Sentry)

```bash
pnpm add @sentry/nextjs
```

Follow [Sentry Next.js setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

### Add Feature Flags

Use the existing `features` and `planFeatures` tables:

```typescript
// lib/features.ts
export async function hasFeature(
  teamId: number, 
  featureCode: string
): Promise<boolean> {
  // Query planFeatures based on team's plan
  // Return true/false
}
```

## SEO Optimization

### Add Open Graph Tags

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Your SaaS',
  description: 'Your description',
  openGraph: {
    title: 'Your SaaS',
    description: 'Your description',
    images: ['/og-image.png'],
    url: 'https://yourdomain.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your SaaS',
    description: 'Your description',
    images: ['/og-image.png']
  }
};
```

### Add Sitemap

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
    },
    {
      url: 'https://yourdomain.com/pricing',
      lastModified: new Date(),
    }
  ];
}
```

## Tips

- **Keep it DRY**: Extract repeated UI patterns into components
- **Test thoroughly**: Test email sending, payments, auth flows
- **Monitor errors**: Set up error tracking early
- **Backup database**: Enable automatic backups
- **Update dependencies**: Regularly update packages for security

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)