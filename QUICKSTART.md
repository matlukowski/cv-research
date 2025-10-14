# 🚀 Quick Start Guide

Get your SaaS up and running in 10 minutes!

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended) or npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local database)
- [Git](https://git-scm.com/)

## Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone https://github.com/matlukowski/saas-stack.git
cd saas-stack

# Install dependencies
pnpm install
```

## Step 2: Get API Keys (3 min)

### Clerk (Authentication)
1. Sign up at [clerk.com](https://clerk.com/)
2. Create a new application
3. Copy your keys from **Dashboard > API Keys**

### Stripe (Payments)
1. Sign up at [stripe.com](https://stripe.com/)
2. Get your **test mode** keys from **Developers > API keys**

### Resend (Email)
1. Sign up at [resend.com](https://resend.com/)
2. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)

## Step 3: Setup Environment (2 min)

```bash
# Run setup script
pnpm setup

# This creates your .env file from template
```

Now edit `.env` and add your API keys:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Resend
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

> 💡 **Tip**: For local testing, use `onboarding@resend.dev` as FROM_EMAIL

## Step 4: Start Database (1 min)

```bash
# Start PostgreSQL in Docker
pnpm docker:up

# Run database migrations
pnpm db:migrate
```

## Step 5: Start Development (1 min)

```bash
# Start Next.js dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 6: Test Everything (1 min)

### Test Sign Up
1. Go to http://localhost:3000
2. Click "Get started"
3. Create an account
4. You should be redirected to `/dashboard`

### Test Payments (Optional)
1. Go to http://localhost:3000/pricing
2. Click on a plan
3. Use test card: `4242 4242 4242 4242`
4. Any future date, any CVC

## Next Steps

### Customize Your SaaS

1. **Change Branding**: See [docs/customization.md](docs/customization.md)
   - Update site name in `app/layout.tsx`
   - Change logo in `app/(dashboard)/layout.tsx`
   - Update colors

2. **Setup Webhooks**: See [docs/deployment.md](docs/deployment.md#4-setup-production-webhooks)
   ```bash
   # For local testing
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. **Add Your Features**: See [docs/features.md](docs/features.md)
   - Add database tables
   - Create new pages
   - Build your unique features

### Deploy to Production

See [docs/deployment.md](docs/deployment.md) for:
- Deploying to Vercel
- Setting up production database (Supabase)
- Configuring production webhooks

## Troubleshooting

### Database connection error
```bash
# Make sure Docker is running
pnpm docker:up

# Check if database is running
docker ps
```

### Port 3000 already in use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
pnpm dev -- -p 3001
```

### Clerk authentication not working
- Make sure you copied the correct keys
- Check that keys start with `pk_test_` and `sk_test_`
- Verify `.env` file exists and is loaded

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm docker:up        # Start database
pnpm docker:down      # Stop database
pnpm docker:logs      # View database logs
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio

# Setup
pnpm setup            # Initialize project
```

## Need Help?

- 📚 [Full Documentation](README.md)
- 🎨 [Customization Guide](docs/customization.md)
- 🚀 [Deployment Guide](docs/deployment.md)
- 📧 [Email Setup](docs/email.md)
- ✨ [Features Overview](docs/features.md)

## What's Included?

- ✅ Next.js 15 with App Router
- ✅ Clerk Authentication
- ✅ Stripe Payments
- ✅ Resend Email System
- ✅ PostgreSQL + Drizzle ORM
- ✅ Tailwind CSS + Radix UI
- ✅ Team Management
- ✅ Activity Logging
- ✅ Docker Development Environment

Happy building! 🚀