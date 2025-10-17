# 🎯 CV Research - AI-Powered Applicant Tracking System

An intelligent **Applicant Tracking System (ATS)** that automates the entire recruitment workflow - from collecting CVs via Gmail to AI-powered candidate matching. Built for HR teams and recruiters who want to save 80% of their time on manual CV processing.

> **🚀 Key Innovation**: 3-layer intelligent filtering + AI processing + Direct/Cross candidate matching

## ✨ Features

### 📧 **Automated CV Collection**
- **Gmail Integration** - OAuth 2.0 authentication with automatic email synchronization
- **3-Layer Intelligent Filtering**:
  - Layer 1: Smart Gmail queries with multi-language CV keywords (EN, PL, DE)
  - Layer 2: Permissive pre-filtering (blacklist-based, rejects only obvious non-CVs)
  - Layer 3: AI validation using xAI Grok (final quality check)
- **PDF Extraction** - Automatic attachment download and text parsing
- **High Recall**: Designed to never miss real CVs while filtering out invoices, newsletters, etc.

### 🤖 **AI-Powered CV Processing**
- **xAI Grok 4 Fast** - Fast, non-reasoning model for reliable structured outputs
- **CV Validation** - Determines if document is a resume (confidence scoring 0-100%)
- **Data Extraction** - Extracts structured candidate data:
  - Personal info (name, email, phone, location)
  - Professional summary (4-6 sentences, AI-generated)
  - Skills split into technical & soft skills
  - Work experience with professional descriptions
  - Education, certifications, languages
  - Years of experience & key achievements
- **Data Normalization** - Standardized formats for phones, dates, skill names

### 📋 **Application Management System**
- **Automatic Position Detection** - AI analyzes email content to detect target job position
- **Application Types**:
  - **Direct** - Candidate applied for specific position
  - **Spontaneous** - CV sent without specific position
- **Application Tracking** - Status management (pending, reviewing, interview, rejected, accepted)
- **GDPR Compliance** - Tracks application intent and candidate consent

### 🎯 **Smart Candidate Matching**
- **Two-Phase Matching Algorithm**:
  - **Phase 1: Direct Applications** - Candidates who actually applied for this position (priority)
  - **Phase 2: Cross Matches** - Suggested candidates from database who didn't apply but might fit
- **AI-Powered Scoring** - Match score 0-100% with detailed reasoning
- **Comprehensive Analysis**:
  - Match score with quality indicators
  - Strengths & weaknesses (AI-generated lists)
  - Detailed 3-4 sentence analysis
  - Summary and recommendations
- **Smart Sorting** - Direct applications first, then cross matches, both sorted by score

### 💼 **Job Position Management**
- Create and manage job postings with full details
- Modal-based editing workflow (no page navigation)
- Intelligent text formatting (lists, headers, proper spacing)
- Status management (active, closed, draft)

### 👥 **Multi-Tenant SaaS Architecture**
- Team management with role-based access control (RBAC)
- Team member invitations
- Activity logging for audit trail
- Data isolation (team-scoped queries)

### 💳 **Stripe Integration**
- Subscription management
- 14-day trial period
- Customer portal
- Webhook handling

### 📧 **Email System**
- Transactional emails via Resend
- Welcome emails, team invitations
- Subscription confirmations

## 🛠️ Tech Stack

### **Core**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router & Server Components
- **[React 19](https://react.dev/)** - Latest UI library with server components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library (Radix UI + Tailwind)

### **Backend & Database**
- **[PostgreSQL](https://www.postgresql.org/)** - Primary relational database
- **[Drizzle ORM](https://orm.drizzle.team/)** - Type-safe database toolkit with migrations
- **Docker Compose** - Local database containerization

### **AI & Integrations**
- **[xAI Grok 4 Fast](https://x.ai/)** - AI model for CV processing & matching
- **[Gmail API](https://developers.google.com/gmail/api)** - Email integration via OAuth 2.0
- **[Clerk](https://clerk.com/)** - Modern authentication & user management
- **[Stripe](https://stripe.com/)** - Payment processing & subscriptions
- **[Resend](https://resend.com/)** - Transactional email service

### **Utilities**
- **[Zod](https://zod.dev/)** - Schema validation
- **[SWR](https://swr.vercel.app/)** - Data fetching & caching
- **[pdfreader](https://www.npmjs.com/package/pdfreader)** - PDF text extraction
- **[pnpm](https://pnpm.io/)** - Fast package manager

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Docker Desktop
- API keys: [Clerk](https://dashboard.clerk.com), [Stripe](https://dashboard.stripe.com), [xAI](https://console.x.ai), [Google Cloud](https://console.cloud.google.com)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/cv-research.git
cd cv-research
pnpm install
```

### 2. Environment Setup

Run the setup script:

```bash
pnpm setup
```

Then configure your `.env` file:

```env
# Database
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend Email
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@yourdomain.com

# xAI (AI Processing)
XAI_API_KEY=xai-...
XAI_MODEL=grok-4-fast-non-reasoning

# Google Gmail API
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback

# Application
BASE_URL=http://localhost:3000
NODE_ENV=development
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

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 6. Test the Workflow

1. **Sign up** via Clerk authentication
2. **Connect Gmail** - Navigate to CV Dashboard → "Connect Gmail"
3. **Sync CVs** - Click "Sync Now" to fetch CVs from your inbox
4. **Process CVs** - AI will validate and extract candidate data
5. **Create Job Position** - Add a new job posting
6. **Match Candidates** - Run AI matching to find best candidates

> **📖 Detailed Setup**: See [QUICKSTART.md](QUICKSTART.md) or [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📊 Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Gmail Integration                        │
│  OAuth 2.0 → Email Sync → PDF Extraction → Local Storage       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    3-Layer CV Filtering                          │
│  Layer 1: Smart Gmail Query (multi-language keywords)           │
│  Layer 2: Pre-filtering (blacklist-based, permissive)           │
│  Layer 3: AI Validation (xAI Grok, confidence scoring)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI Data Extraction                            │
│  xAI Grok 4 Fast → Structured JSON → Database Storage           │
│  (Personal info, skills, experience, education, summary)         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI Job Position Detection                           │
│  Analyze email subject/body → Match active positions             │
│  Create Application: Direct (specific position) or Spontaneous  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Smart Candidate Matching (2-Phase)                  │
│  Phase 1: Direct Applications (who applied)                     │
│  Phase 2: Cross Matches (suggested from database)               │
│  AI Scoring: 0-100% + Strengths/Weaknesses + Analysis           │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (11 Tables)

**Core SaaS** (5): users, teams, team_members, activity_logs, invitations

**CV Management** (6): gmail_connections, cvs, candidates, job_positions, applications, candidate_matches

> **📖 Full Architecture**: See [.claude/project_summary.md](.claude/project_summary.md)

## 📚 Documentation

- **[Project Summary](.claude/project_summary.md)** - Complete architecture & technical documentation
- **[Quick Start](QUICKSTART.md)** - 10-minute setup guide
- **[Setup Guide](SETUP_GUIDE.md)** - Detailed local development setup
- **[Features](docs/features.md)** - Feature documentation
- **[Deployment](docs/deployment.md)** - Production deployment guide
- **[Email Setup](docs/email.md)** - Resend configuration

## 🚀 Deployment

### Recommended Stack

- **Hosting**: [Vercel](https://vercel.com) - Next.js optimized platform
- **Database**: [Supabase](https://supabase.com) or [Neon](https://neon.tech) - PostgreSQL hosting
- **File Storage**: Local (dev) → Cloud storage (production)

### Production Checklist

- [ ] Configure production OAuth credentials (Gmail, Clerk)
- [ ] Update Stripe webhooks to production URL
- [ ] Set up managed PostgreSQL database
- [ ] Configure production environment variables
- [ ] Run database migrations on production
- [ ] Enable error tracking (Sentry recommended)
- [ ] Set up monitoring and analytics
- [ ] Configure rate limiting
- [ ] Test end-to-end workflow

> **📖 Full Deployment Guide**: See [docs/deployment.md](docs/deployment.md)

## 🔧 Available Scripts

```bash
# Development
pnpm dev                # Start dev server (Turbopack)
pnpm build              # Build for production
pnpm start              # Start production server

# Database
pnpm docker:up          # Start PostgreSQL container
pnpm docker:down        # Stop PostgreSQL container
pnpm docker:logs        # View database logs
pnpm db:generate        # Generate migrations from schema
pnpm db:migrate         # Run migrations
pnpm db:studio          # Open Drizzle Studio (DB GUI)
pnpm db:seed            # Seed database with sample data

# Testing Stripe Webhooks (local)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🎯 Key Workflows

### CV Processing Pipeline

1. **Collection**: Gmail sync → 3-layer filtering → PDF extraction
2. **Validation**: AI checks if document is a CV (confidence ≥60%)
3. **Extraction**: AI extracts structured data (name, skills, experience, etc.)
4. **Detection**: AI analyzes email to detect target job position
5. **Application**: Creates application record (Direct or Spontaneous)
6. **Storage**: Saves to database with parsed text and metadata

### Candidate Matching Pipeline

1. **Input**: Job position details + processed candidates
2. **Phase 1 - Direct Applications**: Match candidates who applied for this position
3. **Phase 2 - Cross Matches**: Suggest candidates from database who didn't apply
4. **AI Analysis**: Grok 4 Fast evaluates fit (0-100 score + reasoning)
5. **Sorting**: Direct applications first, then cross matches, by score
6. **Output**: Ranked list with scores, strengths, weaknesses, analysis

## 💡 Use Cases

- **Recruitment Agencies** - Manage multiple job positions and candidate pools
- **HR Departments** - Automate CV screening and candidate matching
- **Startups** - Quick candidate discovery without manual CV reading
- **Freelance Recruiters** - Efficient talent matching for clients

## 🛡️ Security

- OAuth 2.0 token encryption (AES-256-GCM)
- Clerk authentication with session management
- Team-scoped data isolation (multi-tenant)
- Environment variables for all secrets
- SQL injection prevention (Drizzle ORM parameterized queries)
- Activity logging for audit trail

## 📈 Performance

- **Smart Filtering**: Reduces downloads by 90% (Layer 1+2 filtering)
- **AI Processing**: ~2-3 seconds per CV (xAI Grok 4 Fast)
- **Matching**: ~3-5 seconds per candidate-position pair
- **Scalability**: Handles 100+ CVs and positions efficiently

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - feel free to use this for your own projects!

## ⭐ Acknowledgments

Built with modern SaaS stack:
- Next.js 15 & React 19
- xAI Grok for intelligent CV processing
- Clerk for seamless authentication
- Stripe for payment processing
- Drizzle ORM for type-safe database access

---

**Made with ❤️ for recruiters who value their time**

If you find this project helpful, please give it a star! ⭐
