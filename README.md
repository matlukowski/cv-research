# 🚀 Next.js SaaS Boilerplate

A modern, production-ready SaaS starter template built with **Next.js 15**, **Clerk Authentication**, **Stripe Payments**, and **PostgreSQL**. Get your SaaS up and running in minutes, not weeks.

> **New to this boilerplate?** → Check out the [Quick Start Guide](QUICKSTART.md) (10 min setup!)

## ✨ Features

### 🔐 Authentication & User Management
- **Clerk Integration** - Modern, secure authentication
- Protected routes with middleware
- User profile management
- Session handling

### 💳 Payments & Subscriptions
- **Stripe Integration** - Full payment processing
- Subscription management
- Customer portal
- Webhook handling
- 14-day trial period

### 👥 Team Management
- Multi-tenant architecture
- Team invitations
- Role-based access control (RBAC)
- Activity logging

### 📧 Email System
- **Resend Integration** - Transactional emails
- Welcome emails
- Team invitation emails
- Subscription confirmations
- Password reset emails

### 🗄️ Database & ORM
- **PostgreSQL** with Drizzle ORM
- Docker Compose for local development
- Migration system
- Seed data scripts
- Ready for Supabase deployment

### 🎨 UI & Styling
- **Tailwind CSS 4** - Latest styling framework
- **shadcn/ui** - Beautiful, accessible components (built on Radix UI)
- Responsive design
- Dark mode support
- Modern dashboard layout

### ✅ Data Validation
- **Zod Integration** - Type-safe runtime validation
- Pre-built validation schemas (user, team, payment)
- Common validators (pagination, slugs, dates)
- Error handling utilities
- Full TypeScript type inference

### 📊 Advanced SaaS Features (Schema Ready)
- API Keys management
- Webhook endpoints
- Usage tracking & analytics
- Projects/workspaces
- Feature flags system
- Plans & pricing tiers

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Payments**: [Stripe](https://stripe.com/)
- **Email**: [Resend](https://resend.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/matlukowski/saas-stack.git
cd saas-stack
pnpm install
```

### 2. Setup Environment

Run the setup script to create your `.env` file:

```bash
pnpm setup
```

Then fill in your API keys in the `.env` file:

```env
# Clerk (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (get from https://resend.com/api-keys)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@yourdomain.com
```

### 3. Start Database

```bash
pnpm docker:up
```

### 4. Run Migrations

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. (Optional) Seed Database

```bash
pnpm db:seed
```

### 6. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - your SaaS is ready! 🎉

### 7. (Optional) Setup Stripe Webhooks

For local development with Stripe webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 💳 Testing Payments

Use Stripe test cards for development:

| Scenario | Card Number | Details |
|----------|-------------|----------|
| Success | `4242 4242 4242 4242` | Any future date, any CVC |
| Decline | `4000 0000 0000 0002` | Any future date, any CVC |
| 3D Secure | `4000 0025 0000 3155` | Requires authentication |

[More test cards](https://stripe.com/docs/testing)

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/)
3. Add environment variables (see below)
4. Deploy!

### Production Environment Variables

Set these in your Vercel project settings:

```env
# Database (use Supabase or Neon)
POSTGRES_URL=your_production_database_url

# Clerk (production keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Stripe (production keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Resend (production)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=your@domain.com

# App
BASE_URL=https://yourdomain.com
NODE_ENV=production
```

### Setup Production Webhooks

**Stripe:**
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.*`
4. Copy the webhook secret to your environment variables

**Database Migration:**
```bash
# After deploying, run migrations on production DB
pnpm db:migrate
```

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

## 📚 Documentation

- [Features Overview](docs/features.md) - Detailed feature documentation
- [Deployment Guide](docs/deployment.md) - Production deployment steps
- [Customization Guide](docs/customization.md) - How to customize for your SaaS
- [Email Setup](docs/email.md) - Resend configuration
- [Local Development](LOCAL_SETUP.md) - Local setup guide

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this for your own projects!

## ⭐ Support

If you find this boilerplate helpful, please give it a star on GitHub!
