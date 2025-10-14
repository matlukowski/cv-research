# 🚀 Deployment Guide

Complete guide for deploying your SaaS to production.

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub repository with your code
- ✅ Production API keys (Clerk, Stripe, Resend)
- ✅ Production database ready (Supabase, Neon, etc.)
- ✅ Domain name (optional but recommended)

## Step-by-Step Deployment

### 1. Prepare Your Database

#### Option A: Supabase (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project
3. Wait for database provisioning (~2 minutes)
4. Go to **Settings > Database**
5. Copy the **Connection string (URI)** under "Connection string"
6. Save this for later as `POSTGRES_URL`

#### Option B: Neon

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Save as `POSTGRES_URL`

#### Option C: Vercel Postgres

1. In Vercel project settings
2. Go to **Storage** tab
3. Create new Postgres database
4. Connection string will be automatically added to env vars

### 2. Setup Production Keys

#### Clerk (Authentication)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application (or create new one for production)
3. Go to **API Keys**
4. Copy production keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   ```

#### Stripe (Payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Toggle to "Live mode"** (important!)
3. Go to **Developers > API keys**
4. Copy:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
5. Create webhook (see step 4)

#### Resend (Email)

1. Go to [Resend](https://resend.com/api-keys)
2. Create production API key
3. Verify your domain (Settings > Domains)
4. Copy:
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### 3. Deploy to Vercel

#### Via GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"Add New Project"**
4. Select your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`

6. Add **Environment Variables** (see step 3.1 below)
7. Click **Deploy**

#### Environment Variables in Vercel

Add these in **Settings > Environment Variables**:

```env
# Database
POSTGRES_URL=postgresql://user:pass@host:5432/db

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (add after step 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
BASE_URL=https://yourdomain.com
NODE_ENV=production
```

### 4. Setup Production Webhooks

#### Stripe Webhooks

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. Set endpoint URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy **Signing secret** (starts with `whsec_`)
7. Add to Vercel env vars as `STRIPE_WEBHOOK_SECRET`
8. Redeploy your app

### 5. Run Database Migrations

After first deployment, run migrations on production database:

```bash
# Make sure POSTGRES_URL in .env points to production
pnpm db:migrate
```

Or use Vercel CLI:
```bash
vercel env pull .env.production
POSTGRES_URL=$(cat .env.production | grep POSTGRES_URL) pnpm db:migrate
```

### 6. Setup Custom Domain (Optional)

1. In Vercel project settings
2. Go to **Domains**
3. Add your domain
4. Follow DNS configuration instructions
5. Update `BASE_URL` environment variable
6. Update Stripe webhook URL

### 7. Verify Deployment

Test these critical paths:

- [ ] Homepage loads correctly
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] Dashboard is accessible
- [ ] Stripe checkout works
- [ ] Payment webhooks are received
- [ ] Emails are being sent
- [ ] Database operations work

## Post-Deployment

### Enable Monitoring

#### Vercel Analytics
```bash
pnpm add @vercel/analytics
```

#### Sentry (Error Tracking)
```bash
pnpm add @sentry/nextjs
```

### Setup Backups

#### Supabase
- Go to **Settings > Backups**
- Enable daily backups
- Configure retention period

#### Neon
- Backups are automatic
- Configure point-in-time recovery

### Security Checklist

- [ ] Environment variables are set correctly
- [ ] Webhook secrets are configured
- [ ] CORS is properly configured (if using API)
- [ ] Rate limiting is enabled (if applicable)
- [ ] SSL/HTTPS is working
- [ ] Email sending domain is verified

## Troubleshooting

### Build Errors

**Error: Missing environment variables**
```bash
# Solution: Add missing vars in Vercel dashboard
# Settings > Environment Variables
```

**Error: Database connection failed**
```bash
# Check POSTGRES_URL format:
# postgresql://user:password@host:5432/database
```

### Runtime Errors

**Clerk authentication fails**
```bash
# Verify you're using LIVE mode keys (pk_live_, sk_live_)
# Check that domain is added to Clerk allowed domains
```

**Stripe webhook not working**
```bash
# Verify webhook endpoint URL is correct
# Check STRIPE_WEBHOOK_SECRET is set
# Ensure endpoint is publicly accessible
```

**Emails not sending**
```bash
# Verify domain is verified in Resend
# Check RESEND_FROM_EMAIL matches verified domain
# Review Resend logs for errors
```

## Scaling Considerations

### Database
- **Connection pooling**: Use PgBouncer (Supabase has it built-in)
- **Read replicas**: For read-heavy applications
- **Indexing**: Monitor slow queries and add indexes

### Caching
```typescript
// Add Redis for caching
import { Redis } from '@upstash/redis'
```

### CDN
- Vercel automatically provides CDN
- For assets, consider Cloudflare or AWS CloudFront

### Background Jobs
```bash
# Consider adding for async tasks
pnpm add @trigger.dev/sdk
# or
pnpm add inngest
```

## Cost Estimates

### Free Tier (Getting Started)
- **Vercel**: Free (Hobby plan)
- **Supabase**: Free (up to 500MB database, 50k rows)
- **Clerk**: Free (up to 10,000 MAUs)
- **Stripe**: Pay-per-transaction
- **Resend**: Free (100 emails/day)

**Total: $0/month for first users**

### Growth Phase (~1000 users)
- **Vercel**: $20/month (Pro)
- **Supabase**: $25/month (Pro)
- **Clerk**: $25/month (after free tier)
- **Stripe**: ~2.9% + $0.30 per transaction
- **Resend**: $20/month (50,000 emails)

**Estimated: ~$90-100/month base + transaction fees**

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe Webhooks Best Practices](https://stripe.com/docs/webhooks/best-practices)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for client errors
3. Check Supabase logs for database errors
4. Review webhook delivery logs in Stripe dashboard