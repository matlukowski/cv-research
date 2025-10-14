# Project Summary: CV Research - AI-Powered Applicant Tracking System

## Overview

This project is an advanced **AI-powered Applicant Tracking System (ATS)** built on top of a modern SaaS boilerplate. It combines automatic CV collection from Gmail, intelligent AI processing using OpenAI GPT-5 mini, and smart candidate-to-job matching capabilities. The application is designed for HR teams and recruiters who want to automate and optimize their recruitment workflow.

**Project Type**: SaaS Web Application (Multi-tenant ATS)
**Status**: Development
**Primary Language**: TypeScript
**Framework**: Next.js 15 (App Router, React 19)

---

## Tech Stack

### Core Framework & Runtime
- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Node.js 18+** - Runtime environment

### Authentication & Authorization
- **Clerk** - Modern authentication provider
  - OAuth integration
  - User management
  - Session handling
  - Protected routes via middleware

### Database & ORM
- **PostgreSQL** - Primary relational database
- **Drizzle ORM** - Type-safe database toolkit
  - Schema definition and migrations
  - Type inference
  - Query builder
- **Docker Compose** - Local database containerization

### Payments & Subscriptions
- **Stripe** - Payment processing
  - Checkout sessions
  - Subscription management
  - Webhook handling
  - Customer portal

### Email Service
- **Resend** - Transactional email service
  - Welcome emails
  - Team invitations
  - Subscription confirmations

### AI & Machine Learning
- **OpenAI API** - AI processing (GPT-5 model)
  - CV validation and classification (low reasoning effort)
  - Structured data extraction (medium reasoning effort)
  - Intelligent candidate matching (low reasoning effort)
  - Scoring and reasoning with configurable effort levels

### External Integrations
- **Google Gmail API** - Email integration
  - OAuth 2.0 authentication
  - Automatic email synchronization
  - Attachment extraction
  - PDF download

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library (built on Radix UI)
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **class-variance-authority** - Variant styling utilities
  - Button component: Fixed ghost variant hover (visible text on light backgrounds)

### Utilities & Libraries
- **Zod** - Schema validation and type inference
- **SWR** - Data fetching and caching
- **pdf-parse** - PDF text extraction
- **jose** - JWT handling
- **bcryptjs** - Password hashing

### Development Tools
- **pnpm** - Package manager
- **Turbopack** - Next.js bundler (dev mode)
- **Drizzle Kit** - Database migration tools

---

## Project Architecture

### Directory Structure

```
cv research/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard layout group
│   │   ├── dashboard/
│   │   │   ├── cvs/             # CV management pages
│   │   │   ├── positions/       # Job positions pages
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── matches/ # Candidate matching results
│   │   │   │   │   └── edit/    # Edit page (optional, modal preferred)
│   │   │   │   ├── new/         # Create new position form
│   │   │   │   ├── page.tsx     # Positions list
│   │   │   │   └── positions-list.tsx # List component with modals
│   │   │   └── settings/        # User settings
│   │   ├── pricing/             # Pricing & subscription
│   │   └── layout.tsx           # Dashboard layout with header
│   ├── (login)/                 # Login layout group
│   │   ├── sign-in/             # Clerk sign-in
│   │   └── sign-up/             # Clerk sign-up
│   ├── api/                     # API Routes
│   │   ├── stripe/              # Stripe webhooks & checkout
│   │   ├── gmail/               # Gmail OAuth & sync
│   │   ├── cvs/                 # CV operations
│   │   ├── positions/           # Job position CRUD & matching
│   │   ├── team/                # Team management
│   │   └── user/                # User operations
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── lib/                         # Core business logic
│   ├── ai/                      # AI processing modules
│   │   ├── cv-processor.ts      # CV validation & extraction
│   │   └── candidate-matcher.ts # AI-powered candidate matching
│   ├── gmail/                   # Gmail integration
│   │   ├── auth.ts              # OAuth 2.0 flow
│   │   └── sync.ts              # Email synchronization
│   ├── storage/                 # File storage
│   │   └── file-storage.ts      # Local file handling
│   ├── db/                      # Database layer
│   │   ├── schema.ts            # Drizzle schema definitions
│   │   ├── queries.ts           # Database queries
│   │   ├── drizzle.ts           # Database connection
│   │   ├── migrations/          # SQL migrations
│   │   ├── seed.ts              # Seed data
│   │   └── setup.ts             # Database setup script
│   ├── auth/                    # Authentication utilities
│   │   ├── session.ts           # Session management
│   │   └── middleware.ts        # Auth middleware
│   ├── payments/                # Payment processing
│   │   ├── stripe.ts            # Stripe client
│   │   └── actions.ts           # Payment actions
│   ├── email/                   # Email service
│   │   ├── client.ts            # Resend client
│   │   ├── send.tsx             # Email sending
│   │   └── templates.tsx        # Email templates
│   ├── validations/             # Zod schemas
│   │   ├── user.ts              # User validation
│   │   ├── team.ts              # Team validation
│   │   ├── payment.ts           # Payment validation
│   │   └── common.ts            # Common validators
│   └── utils/                   # Utility functions
│       ├── encryption.ts        # Token encryption
│       └── text-formatter.tsx   # Text formatting (lists, headers)
├── components/                  # React components
│   ├── ui/                      # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx               # Modal/Dialog component (Radix UI)
│   ├── input.tsx
│   ├── label.tsx
│   └── ...
├── docs/                        # Documentation
│   ├── features.md
│   ├── deployment.md
│   ├── customization.md
│   └── email.md
├── scripts/                     # Setup scripts
│   └── setup.ts
├── middleware.ts                # Next.js middleware (Clerk auth)
├── drizzle.config.ts            # Drizzle configuration
├── next.config.ts               # Next.js configuration
├── docker-compose.yml           # PostgreSQL container
└── package.json                 # Dependencies
```

---

## Core Functionality

### 1. SaaS Base Features (Boilerplate)

#### Authentication & User Management
- User sign-up and sign-in via Clerk
- OAuth providers support
- Profile management
- Session handling
- Protected routes middleware

#### Team Management (Multi-tenancy)
- Team creation and management
- Team member invitations
- Role-based access control (RBAC)
- Activity logging for team actions

#### Payments & Subscriptions
- Stripe checkout integration
- Subscription plans management
- 14-day trial period
- Customer portal access
- Webhook handling for subscription events

#### Email System
- Transactional emails via Resend
- Welcome emails
- Team invitation emails
- Subscription confirmations

---

### 2. CV Management System (Core Feature)

#### Gmail Integration
**Purpose**: Automatically collect CV attachments from email

**Flow**:
1. User connects Gmail account via OAuth 2.0
2. Application requests read-only access to Gmail
3. Tokens (access + refresh) are encrypted and stored
4. **Intelligent Sync Process** (3-layer filtering):

   **LAYER 1: Smart Gmail Query** (BEFORE fetching)
   - Uses intelligent search query with CV keywords in multiple languages
   - Polish: cv, życiorys, aplikacja, kandydat, rekrutacja
   - English: cv, resume, application, curriculum
   - German: lebenslauf, bewerbung
   - Query: `has:attachment filename:pdf (filename:(cv OR resume...) OR subject:(aplikacja OR job...))`

   **LAYER 2: Pre-filtering** (BEFORE downloading attachment)
   - **SIMPLIFIED & PERMISSIVE** - Focus on blacklists, not quality scoring
   - Philosophy: "Better to download 5 false positives than miss 1 real CV"
   - **Blacklists** (immediate rejection):
     - Senders: noreply@, invoice@, billing@, newsletter@
     - Filenames: invoice, faktura, contract, report
     - Subjects: invoice, payment, newsletter
   - **Positive signals** (simplified scoring):
     - Has "cv" or "resume" in filename → score = 100 (auto-accept)
     - Has CV keywords in subject → score = 80
     - Matches name pattern (Jan_Kowalski.pdf) → score = 70
     - No blacklist, no CV keywords → score = 50 (give AI a chance)
   - **Threshold: 10 points** (very permissive - almost everything passes)
   - Logs all decisions for debugging

   **LAYER 3: AI Validation** (AFTER download)
   - Final verification using GPT model
   - See "AI-Powered CV Processing" section

5. Downloads only likely CV candidates
6. Extracts metadata (sender, subject, date)
7. Stores files locally
8. Creates CV records with status: `pending`

**Key Files**:
- `lib/gmail/auth.ts` - OAuth flow
- `lib/gmail/cv-filters.ts` - **NEW: Intelligent CV filtering logic**
- `lib/gmail/sync.ts` - Email synchronization with pre-filtering
- `app/api/gmail/connect/route.ts` - OAuth initiation
- `app/api/gmail/callback/route.ts` - OAuth callback
- `app/api/gmail/sync/route.ts` - Manual sync trigger with filtering options

**Filtering Options** (API parameters):
- `useSmartFiltering` (boolean, default: true) - Enable/disable intelligent filtering
- `filterThreshold` (number, default: 10) - Minimum score to download (0-100, very permissive)
- `query` (string) - Custom Gmail search query (overrides smart query)

**Filtering Philosophy**:
- **Permissive approach**: Don't judge CV quality, just filter obvious non-CV
- Only rejects blacklisted items (invoices, newsletters, system emails)
- Any file with "CV" in name/subject gets score 100 → always downloaded
- Files without CV keywords still get score 50 → downloaded (AI verifies)
- Focus: High recall (don't miss CVs), AI handles precision

**Database Tables**:
- `gmail_connections` - Stores OAuth tokens and connection status

**Performance**:
- **Before filtering**: ~49 PDFs downloaded, ~2% accuracy (1 CV, 48 non-CV)
- **After simplification**: Downloads all potential CVs, rejects only obvious non-CV
- Reduces false negatives (missed CVs) to near zero
- AI validation (Layer 3) handles final quality check

---

#### AI-Powered CV Processing
**Purpose**: Validate and extract structured data from CVs using AI

**Processing Pipeline**:

1. **PDF Text Extraction**
   - Uses `pdf-parse` library
   - Extracts raw text from PDF
   - Stores in `cvs.parsedText` field

2. **CV Validation** (AI Step 1)
   - Model: GPT-5 mini (low reasoning effort)
   - Task: Determine if document is a CV/resume
   - Checks for: personal info, experience, skills, education
   - Rejects: cover letters, invoices, articles
   - Output:
     ```json
     {
       "isCV": true/false,
       "confidence": 0-100,
       "reason": "explanation in Polish"
     }
     ```
   - Threshold: confidence >= 60%
   - If rejected: status = `rejected`

3. **Data Extraction** (AI Step 2)
   - Model: GPT-5 mini (medium reasoning effort)
   - Task: Extract structured candidate data with enhanced AI processing
   - Extracted fields:
     - Personal: firstName, lastName, email, phone, location
     - Professional Summary: 4-6 sentence detailed summary including years of experience, specialization, top skills, main achievement, seniority level
     - Skills: Split into technicalSkills (programming, tools) and softSkills (communication, leadership)
     - Experience: company, position, dates (YYYY-MM format), professional description
     - Education: institution, degree, field, graduation year
     - Additional: yearsOfExperience (calculated), certifications, languages (with proficiency levels), keyAchievements (top 3-5)
     - Social: linkedinUrl
   - **Data Normalization**:
     - Phone numbers: International format (+XX XXX XXX XXX)
     - Skills: Capitalized, standardized names
     - Dates: Consistent YYYY-MM format
   - Creates `candidates` record with enriched data
   - Links CV to candidate
   - Status updated to: `processed`

**Key Files**:
- `lib/ai/cv-processor.ts` - CV validation & extraction
- `lib/storage/file-storage.ts` - File operations
- `app/api/cvs/process/route.ts` - Processing trigger API

**Database Tables**:
- `cvs` - CV metadata and processing status
- `candidates` - Structured candidate data

**Statuses**:
- `pending` - Awaiting AI processing
- `processing` - Currently being processed
- `processed` - Successfully processed
- `rejected` - Not a valid CV
- `error` - Processing failed

---

#### Job Position Management
**Purpose**: Create and manage job postings

**Features**:
- Create job positions with details:
  - Title, description, requirements
  - Responsibilities, location
  - Employment type (full-time, part-time, contract)
  - Salary range
- Edit and update positions via modal
- Close/archive positions
- Status management: `active`, `closed`, `draft`

**New Modal-Based Workflow**:
1. **View Modal** (click on position card):
   - Full position preview with formatted text
   - Intelligent text formatting:
     - Bullet lists (-, *, •)
     - Numbered lists (1., 2., 3.)
     - Section headers (UPPERCASE or ending with :)
     - Proper spacing and indentation
   - "Close" and "View Candidates" buttons

2. **Edit Modal** (click edit button):
   - Full edit form with all fields
   - Textarea for long text (description, requirements, responsibilities)
   - Input for short fields (location, salary)
   - Select for employment type and status
   - "Save Changes" button with API call
   - "Cancel" button
   - No page navigation required

**Text Formatting Utility**:
- `lib/utils/text-formatter.tsx` - Smart text formatting
  - Detects and formats lists (bullet and numbered)
  - Recognizes section headers
  - Preserves whitespace and structure
  - Renders as React components with proper CSS
  - Used in view modal for better readability

**Key Files**:
- `app/(dashboard)/dashboard/positions/page.tsx` - List view
- `app/(dashboard)/dashboard/positions/positions-list.tsx` - Main component with modals
- `app/(dashboard)/dashboard/positions/new/page.tsx` - Create form
- `app/(dashboard)/dashboard/positions/[id]/edit/` - Standalone edit page (optional, replaced by modal)
- `app/api/positions/route.ts` - CRUD operations
- `app/api/positions/[id]/route.ts` - Single position operations
- `lib/utils/text-formatter.tsx` - Text formatting utility

**Database Tables**:
- `job_positions` - Job posting details

---

#### AI-Powered Candidate Matching
**Purpose**: Intelligently match candidates to job positions

**Matching Algorithm**:

1. **Input**:
   - Job position details (title, description, requirements, responsibilities)
   - Candidate profile (all extracted data)
   - Full CV text (up to 6000 chars)

2. **AI Analysis**:
   - Model: GPT-5 mini (HIGH reasoning effort)
   - Task: Evaluate candidate-job fit
   - Scoring scale:
     - 0-30: Does not meet basic requirements
     - 31-50: Meets some requirements, lacks key skills
     - 51-70: Good fit, meets most requirements
     - 71-85: Very good fit, meets all requirements
     - 86-100: Ideal candidate, exceeds requirements

3. **Output**:
   ```json
   {
     "matchScore": 0-100,
     "aiAnalysis": "detailed 3-4 sentence analysis",
     "strengths": ["strength 1", "strength 2", "strength 3"],
     "weaknesses": ["weakness 1", "weakness 2"],
     "summary": "1-2 sentence summary of fit"
   }
   ```

4. **Storage**:
   - Results saved to `candidate_matches` table
   - Can be re-run to update scores
   - Historical tracking of matches

**Key Files**:
- `lib/ai/candidate-matcher.ts` - Matching logic
- `app/api/positions/[id]/match/route.ts` - Trigger matching API
- `app/(dashboard)/dashboard/positions/[id]/matches/page.tsx` - Results view

**Database Tables**:
- `candidate_matches` - Match results and scoring

---

## Database Schema

### Core SaaS Tables

#### `users`
```sql
- id: serial (PK)
- name: varchar(100)
- email: varchar(255) UNIQUE NOT NULL
- passwordHash: text NOT NULL
- role: varchar(20) DEFAULT 'member'
- createdAt, updatedAt, deletedAt: timestamp
```

#### `teams`
```sql
- id: serial (PK)
- name: varchar(100) NOT NULL
- stripeCustomerId: text UNIQUE
- stripeSubscriptionId: text UNIQUE
- stripeProductId: text
- planName: varchar(50)
- subscriptionStatus: varchar(20)
- createdAt, updatedAt: timestamp
```

#### `team_members`
```sql
- id: serial (PK)
- userId: FK(users.id)
- teamId: FK(teams.id)
- role: varchar(50)
- joinedAt: timestamp
```

#### `activity_logs`
```sql
- id: serial (PK)
- teamId: FK(teams.id)
- userId: FK(users.id)
- action: text (enum: SIGN_UP, SIGN_IN, CREATE_TEAM, etc.)
- timestamp: timestamp
- ipAddress: varchar(45)
```

#### `invitations`
```sql
- id: serial (PK)
- teamId: FK(teams.id)
- email: varchar(255)
- role: varchar(50)
- invitedBy: FK(users.id)
- status: varchar(20) DEFAULT 'pending'
- invitedAt: timestamp
```

---

### CV Management Tables

#### `gmail_connections`
```sql
- id: serial (PK)
- userId: FK(users.id)
- teamId: FK(teams.id)
- email: varchar(255)
- refreshToken: text (encrypted)
- accessToken: text
- tokenExpiry: timestamp
- lastSyncAt: timestamp
- isActive: boolean DEFAULT true
- createdAt, updatedAt: timestamp
```

#### `candidates`
```sql
- id: serial (PK)
- teamId: FK(teams.id)
- firstName, lastName: varchar(100)
- email: varchar(255)
- phone: varchar(50)
- summary: text (AI-generated professional summary, 4-6 sentences)
- yearsOfExperience: integer (total years of work experience)
- technicalSkills: jsonb (string[] - technical/hard skills)
- softSkills: jsonb (string[] - soft skills)
- experience: jsonb (array of objects with company, position, dates, description)
- education: jsonb (array of objects with institution, degree, field, year)
- certifications: jsonb (string[] - professional certifications)
- languages: jsonb (array of objects with language, level)
- keyAchievements: jsonb (string[] - top 3-5 achievements)
- linkedinUrl: varchar(500)
- location: varchar(200)
- createdAt, updatedAt: timestamp
```

#### `cvs`
```sql
- id: serial (PK)
- teamId: FK(teams.id)
- candidateId: FK(candidates.id) [nullable]
- fileName: varchar(255)
- fileUrl: text (storage path)
- fileSize: integer (bytes)
- mimeType: varchar(100) DEFAULT 'application/pdf'
- parsedText: text (extracted from PDF)
- emailSubject: varchar(500)
- emailFrom: varchar(255)
- emailDate: timestamp
- gmailMessageId: varchar(255) UNIQUE
- status: varchar(20) DEFAULT 'pending'
  (pending, processing, processed, rejected, error)
- aiValidationScore: integer (0-100)
- aiValidationReason: text
- uploadedAt, processedAt: timestamp
```

#### `job_positions`
```sql
- id: serial (PK)
- teamId: FK(teams.id)
- createdBy: FK(users.id)
- title: varchar(200)
- description: text
- requirements: text
- responsibilities: text
- location: varchar(200)
- employmentType: varchar(50) (full-time, part-time, contract)
- salaryRange: varchar(100)
- status: varchar(20) DEFAULT 'active' (active, closed, draft)
- createdAt, updatedAt: timestamp
```

#### `candidate_matches`
```sql
- id: serial (PK)
- jobPositionId: FK(job_positions.id)
- candidateId: FK(candidates.id)
- cvId: FK(cvs.id)
- matchScore: integer (0-100)
- aiAnalysis: text (detailed reasoning)
- strengths: jsonb (string[])
- weaknesses: jsonb (string[])
- createdAt, updatedAt: timestamp
```

---

### Advanced SaaS Tables (Schema Ready, Not Yet Implemented)

- `projects` - Project/workspace management
- `api_keys` - API key management
- `webhook_endpoints` - Webhook subscriptions
- `webhook_deliveries` - Webhook delivery logs
- `usage_events` - Usage tracking & analytics
- `plans` - Pricing plan definitions
- `features` - Feature flags
- `plan_features` - Plan-feature mappings

---

## Application Workflow

### 1. User Onboarding
```
1. User signs up via Clerk (email/OAuth)
2. Account created in `users` table
3. Default team created in `teams` table
4. Team member record created
5. Welcome email sent via Resend
6. User redirected to dashboard
```

### 2. Gmail Connection
```
1. User clicks "Connect Gmail" in dashboard
2. OAuth flow initiated (/api/gmail/connect)
3. Redirect to Google consent screen
4. User grants Gmail read-only access
5. Callback with authorization code (/api/gmail/callback)
6. Exchange code for access + refresh tokens
7. Tokens encrypted and stored in `gmail_connections`
8. User redirected back to dashboard
```

### 3. CV Synchronization (with Intelligent Filtering)
```
1. Manual trigger: User clicks "Sync Now"
   OR Automated: Scheduled job (cron)
2. API call to /api/gmail/sync
   - Optional params: useSmartFiltering (default: true), filterThreshold (default: 30)
3. Fetch authenticated Gmail client
4. LAYER 1 - Smart Gmail Query:
   - Build intelligent query with CV keywords (multi-language)
   - Query: "has:attachment filename:pdf (filename:(cv OR resume...) OR subject:(aplikacja OR job...))"
   - Gmail returns only relevant messages
5. For each message:
   a. Check if already processed (gmail_message_id) → Skip if exists
   b. Fetch full message metadata
   c. Extract: subject, sender, date, email body
   d. Find PDF attachments
   e. LAYER 2 - Pre-filtering (SIMPLIFIED - BEFORE download):
      - Check blacklists (noreply@, invoice, faktura, etc.) → Reject if match
      - Simple scoring:
        * Has "cv"/"resume" in filename → score = 100 (auto-accept)
        * Has CV keywords in subject → score = 80
        * Matches name pattern (Jan_Kowalski.pdf) → score = 70
        * No blacklist, no keywords → score = 50 (give AI a chance)
      - Log filtering decision
      - Skip only if score < 10 (very permissive threshold)
   f. Download attachment ONLY if passed filtering (base64)
   g. Decode and save file to storage
   h. Create CV record (status: pending)
6. Update lastSyncAt timestamp
7. Return sync results:
   - totalMessages: Messages found
   - pdfAttachments: Total PDFs found
   - filteredOut: PDFs skipped by filtering
   - newCVs: PDFs downloaded and saved
   - errors: Any errors during sync
```

**Filtering Performance**:
- Without filtering: Downloads all 49 PDFs (2% CV rate)
- With permissive filtering: Rejects only obvious non-CV (invoices, newsletters)
- Downloads all potential CVs (high recall)
- AI validation (Layer 3) provides final quality check (precision)
- Result: No missed CVs, minimal false positives reaching AI

### 4. CV Processing
```
1. Manual trigger: User clicks "Process" on CV
   OR Automated: Background job processes pending CVs
2. API call to /api/cvs/process
3. Update CV status to 'processing'
4. Read PDF file from storage
5. Extract text using pdf-parse
6. Save parsed text to CV record
7. AI Validation:
   a. Send text to GPT-5 mini
   b. Get validation result (isCV, confidence, reason)
   c. Save validation score and reason
8. If NOT valid CV (confidence < 60):
   - Update status to 'rejected'
   - Stop processing
9. If valid CV:
   a. AI Data Extraction:
      - Send text to GPT-5 mini
      - Extract structured data
   b. Create candidate record
   c. Link CV to candidate
   d. Update status to 'processed'
10. Return processing result
```

### 5. Job Position Management

#### Creating a Position
```
1. User navigates to /dashboard/positions/new
2. Fill out job position form:
   - Title, description, requirements
   - Responsibilities, location
   - Employment type, salary range
3. Submit form (POST /api/positions)
4. Validate data with Zod schema
5. Create job_positions record
6. Log activity
7. Redirect to position detail page
```

#### Viewing Position Details (New Modal-Based)
```
1. User clicks on position card in list
2. View modal opens with formatted text:
   - Text formatter detects lists and headers
   - Renders bullet points, numbered lists
   - Displays section headers with proper styling
   - Shows all position details in readable format
3. User can:
   - Close modal
   - Navigate to "View Candidates" page
   - Click edit button to switch to edit mode
```

#### Editing a Position (New Modal-Based)
```
1. User clicks edit button (pencil icon) on position card
2. Edit modal opens with pre-filled form:
   - All fields populated with current data
   - Textarea for long fields (description, requirements)
   - Input for short fields (location, salary)
   - Select dropdowns for type and status
3. User modifies desired fields
4. Clicks "Save Changes" button
5. API call (PUT /api/positions/[id])
6. Validates data with Zod schema
7. Updates job_positions record
8. Modal closes, list refreshes
9. Toast notification shows success/error
10. No page navigation required - all in modal
```

### 6. Candidate Matching
```
1. User views job position
2. Clicks "Find Candidates" or "Run Matching"
3. API call to /api/positions/[id]/match
4. Load job position details
5. Load all processed candidates for team
6. For each candidate:
   a. Load latest processed CV
   b. Prepare matching prompt:
      - Job details
      - Candidate profile
      - Full CV text (up to 6000 chars)
   c. Send to GPT-5 mini (HIGH reasoning effort)
   d. Parse AI response:
      - Match score (0-100)
      - Detailed analysis
      - Strengths & weaknesses
      - Summary
   e. Save to candidate_matches table
   f. Apply minimum score filter
7. Sort results by match score (descending)
8. Return top matches
9. Display results in UI with:
   - Score badge
   - Candidate details
   - Strengths/weaknesses
   - AI analysis
   - Contact actions
```

### 7. Payment Flow
```
1. User selects pricing plan
2. Redirect to Stripe checkout
3. User completes payment
4. Stripe webhook: checkout.session.completed
5. Update team record:
   - stripeCustomerId
   - stripeSubscriptionId
   - subscriptionStatus: 'active'
   - planName
6. Send subscription confirmation email
7. Enable premium features
```

---

## API Endpoints

### Authentication (Clerk)
- `/sign-in` - Sign in page
- `/sign-up` - Sign up page
- Middleware protects all `/dashboard/*` routes

### Gmail Integration
- `POST /api/gmail/connect` - Initiate OAuth flow
- `GET /api/gmail/callback` - OAuth callback handler
- `POST /api/gmail/sync` - Trigger email synchronization
  - Returns: `{ totalMessages, pdfAttachments, newCVs, errors }`

### CV Management
- `GET /api/cvs` - List CVs for team
  - Query params: `status`, `limit`, `offset`
- `POST /api/cvs/process` - Process pending CVs
  - Body: `{ cvId }` (optional, process single CV)
  - Returns: `{ success, isCV, candidateId, error }`

### Job Positions
- `GET /api/positions` - List positions for team
- `POST /api/positions` - Create new position
  - Body: `{ title, description, requirements, ... }`
- `GET /api/positions/[id]` - Get position details
- `PUT /api/positions/[id]` - Update position
- `DELETE /api/positions/[id]` - Delete position
- `POST /api/positions/[id]/match` - Run candidate matching
  - Body: `{ minScore?, maxResults? }`
  - Returns: `MatchResult[]`

### Team Management
- `GET /api/team` - Get current team details
- `PUT /api/team` - Update team settings
- `POST /api/team/invite` - Invite team member

### User Management
- `GET /api/user` - Get current user profile
- `PUT /api/user` - Update user profile

### Payments (Stripe)
- `POST /api/stripe/checkout` - Create checkout session
  - Body: `{ planId }`
- `POST /api/stripe/webhook` - Handle Stripe webhooks
  - Events: `checkout.session.completed`, `customer.subscription.*`

---

## Environment Configuration

### Required Environment Variables

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/saas_db

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Resend Email
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@yourdomain.com

# OpenAI (for CV processing)
OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-5

# Google Gmail API
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback

# Application
BASE_URL=http://localhost:3000
NODE_ENV=development
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Docker Desktop
- API keys (Clerk, Stripe, Resend, OpenAI, Google)

### Quick Start
```bash
# 1. Install dependencies
pnpm install

# 2. Run setup script (creates .env)
pnpm setup

# 3. Start PostgreSQL
pnpm docker:up

# 4. Run database migrations
pnpm db:generate
pnpm db:migrate

# 5. (Optional) Seed database
pnpm db:seed

# 6. Start development server
pnpm dev

# Open http://localhost:3000
```

### Useful Commands
```bash
# Database
pnpm docker:up          # Start PostgreSQL
pnpm docker:down        # Stop PostgreSQL
pnpm docker:logs        # View logs
pnpm db:generate        # Generate migrations
pnpm db:migrate         # Run migrations
pnpm db:studio          # Open Drizzle Studio

# Development
pnpm dev                # Start dev server (Turbopack)
pnpm build              # Build for production
pnpm start              # Start production server

# Stripe (local webhook testing)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Key Design Patterns

### Server Components First
- Most pages are React Server Components
- Data fetching happens on server
- Reduces client bundle size
- Better SEO and initial load

### Server Actions
- AI processing functions marked with `'use server'`
- Direct database access from server components
- Type-safe with TypeScript

### Multi-tenancy
- All data scoped to `teamId`
- Row-level security via queries
- Team isolation enforced

### Type Safety
- Drizzle ORM provides full type inference
- Zod schemas for runtime validation
- TypeScript strict mode enabled

### Progressive Enhancement
- Forms work without JavaScript
- Client components only where needed
- Suspense boundaries for loading states

### Text Formatting System
- **Purpose**: Intelligently format plain text job descriptions into readable, structured content
- **Location**: `lib/utils/text-formatter.tsx`
- **Features**:
  - Automatic list detection (bullet and numbered)
  - Section header recognition (UPPERCASE or ending with `:`)
  - Proper spacing and indentation
  - React component rendering with CSS classes
- **Usage**: Applied to job position descriptions, requirements, and responsibilities in view modal
- **Algorithm**:
  1. Split text into lines
  2. Detect patterns:
     - Bullet lists: `- `, `* `, `• `
     - Numbered lists: `1. `, `2. `, `3. `
     - Headers: UPPERCASE text or lines ending with `:`
  3. Group consecutive list items
  4. Render with appropriate HTML tags (`<ul>`, `<ol>`, `<h4>`, `<p>`)
  5. Apply Tailwind CSS classes for styling

---

## AI Integration Details

### Models Used
- **GPT-5** - Advanced reasoning model via OpenAI Responses API
  - CV validation: Low reasoning effort (faster, basic validation)
  - Data extraction: Medium reasoning effort (balanced accuracy)
  - Candidate matching: Low reasoning effort (fast matching at scale)

### Prompt Engineering
- Prompts in Polish (matching target market)
- Clear task definition
- JSON output format specification
- Few-shot examples in prompts
- Explicit scoring rubrics

### Error Handling
- Try-catch blocks around all AI calls
- Fallback error messages
- Status tracking (pending → processing → processed/error)
- Failed CVs marked with error status

### Cost Optimization
- Text truncation (max 8000 chars for validation, 6000 for matching)
- Batch processing when possible
- Results caching in database
- Re-matching only when requested

---

## Security Considerations

### Authentication
- Clerk handles all auth flows
- Protected routes via Next.js middleware
- Session-based authentication

### Data Isolation
- Team-scoped data access
- User permissions checked on every request
- Activity logging for audit trail

### Sensitive Data
- Gmail tokens encrypted at rest (encryption module)
- Environment variables for secrets
- No credentials in code or git

### File Storage
- Local file system (production: consider cloud storage)
- File size limits
- MIME type validation
- Unique file names to prevent overwrites

### API Security
- Rate limiting (TODO: implement)
- Input validation with Zod
- SQL injection prevention (Drizzle ORM parameterized queries)

---

## Future Enhancements (TODO)

### Short-term
- [ ] Cloud file storage (S3, Google Cloud Storage)
- [ ] Automated background CV processing (cron jobs)
- [ ] Scheduled Gmail sync (hourly/daily)
- [ ] Email notifications for new CVs
- [ ] Export candidate data (CSV, Excel)
- [ ] Candidate notes and tags
- [ ] Interview scheduling

### Medium-term
- [ ] Advanced search and filtering
- [ ] Candidate pipeline/stages (applied, screening, interview, offer)
- [ ] Email templates for candidate outreach
- [ ] Calendar integration (Google Calendar)
- [ ] Bulk actions (process multiple CVs)
- [ ] Team collaboration features (comments, assignments)

### Long-term
- [ ] Video interview integration
- [ ] AI-powered interview question generation
- [ ] Candidate ranking dashboard
- [ ] Analytics and reporting
- [ ] Mobile app
- [ ] Integrations (LinkedIn, Indeed, other job boards)
- [ ] Custom branding (white-label)
- [ ] Advanced RBAC (custom roles)

---

## Performance Optimization

### Current Optimizations
- React Server Components reduce client JS
- SWR for client-side data fetching and caching
- Turbopack for fast dev builds
- Drizzle ORM efficient queries
- Image optimization (Next.js)

### Areas for Improvement
- [ ] Implement CDN for static assets
- [ ] Add Redis for caching
- [ ] Optimize database indexes
- [ ] Implement pagination everywhere
- [ ] Add loading skeletons
- [ ] Optimize AI prompts (reduce token usage)
- [ ] Background job processing (Bull/BullMQ)

---

## Monitoring & Observability

### Current State
- Console logging for errors
- Drizzle queries visible in dev mode

### Recommended Additions
- [ ] Error tracking (Sentry)
- [ ] Application monitoring (Vercel Analytics, New Relic)
- [ ] Database query monitoring
- [ ] AI usage tracking (tokens, costs)
- [ ] User analytics (PostHog, Mixpanel)

---

## Deployment

### Recommended Platforms
- **Vercel** - Next.js hosting (recommended)
- **Supabase** - PostgreSQL hosting
- **Stripe** - Payment processing
- **Resend** - Email service
- **OpenAI** - AI processing
- **Google Cloud** - Gmail API, file storage

### Production Checklist
- [ ] Update all API keys to production
- [ ] Configure production database
- [ ] Set up Stripe production webhooks
- [ ] Configure Gmail OAuth redirect URIs
- [ ] Enable error tracking
- [ ] Set up monitoring
- [ ] Configure CORS
- [ ] Enable rate limiting
- [ ] Set up backups
- [ ] Configure SSL/TLS
- [ ] Test email deliverability
- [ ] Review security headers

---

## Support & Documentation

### Internal Documentation
- `README.md` - Project overview and setup
- `QUICKSTART.md` - 10-minute setup guide
- `LOCAL_SETUP.md` - Detailed local setup
- `CHANGELOG.md` - Version history
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/features.md` - Feature documentation
- `docs/deployment.md` - Deployment guide
- `docs/customization.md` - Customization guide
- `docs/email.md` - Email setup

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Gmail API Documentation](https://developers.google.com/gmail/api)

---

## License
MIT License - See LICENSE file for details

---

## Project Status

**Version**: 1.0.0 (Development)
**Last Updated**: 2025-01-15
**Maintainer**: Development Team

**Recent Changes**:
- **GPT-5 API Configuration Fix** (2025-10-14):
  - Fixed incorrect model name: `gpt-5-mini` → `gpt-5`
  - Changed candidate matching reasoning effort: `high` → `low` for faster performance
  - Confirmed correct API structure: `openai.responses.create()` with `input` parameter
  - API endpoint: `/v1/responses` (not /chat/completions)
  - All AI operations now use GPT-5 with appropriate reasoning effort levels
- **Database Schema Fix + Complete Candidate Matches UI Rebuild** (2025-10-14):
  - **Database Migration** (0003_add_candidate_fields.sql):
    - Fixed missing columns in candidates table: years_of_experience, technical_skills, soft_skills, certifications, languages, key_achievements
    - Schema was updated but migration never generated - caused PostgreSQL error "column candidates.years_of_experience does not exist"
    - Migration successfully applied to database
  - **Complete UI Rebuild** (candidate-matches.tsx):
    - Removed all header sections (position title, description)
    - **Initial State**: Centered "Znajdź kandydatów" button with empty state message
    - **Empty State**: Displays "Nie pobrano jeszcze kandydatów z dostępnych CV" when no workflow has run
    - **Results State**: Shows candidate list with prominent 1-100% match score badges
    - **Scoring**: Only shows matches specific to the current job position (filtered by jobPositionId)
    - Cleaner, focused UI centered on candidate discovery and scoring
    - Uses EmptyState, ScoreBadge, and LoadingSpinner components for better UX
- **Simplified & Permissive CV Filtering** (2025-10-14 - UPDATED):
  - NEW FILE: `lib/gmail/cv-filters.ts` - Blacklist-focused filtering (not quality scoring)
  - Philosophy: "Better 5 false positives than 1 missed CV"
  - Layer 1: Smart Gmail query with CV keywords (Polish, English, German)
  - Layer 2: Simplified pre-filtering:
    - Blacklists reject obvious non-CV (invoices, newsletters)
    - Any file with "cv"/"resume" in name → score = 100 (auto-accept)
    - No CV keywords but not blacklisted → score = 50 (let AI verify)
    - Threshold lowered from 30 → 10 (very permissive)
  - Layer 3: AI validation (existing system) - final quality check
  - Result: High recall (doesn't miss real CVs), AI handles precision
  - Configurable via API: `useSmartFiltering`, `filterThreshold` (default: 10), custom query
  - Comprehensive logging for debugging filtering decisions
- **Code Cleanup & Optimization** (2025-10-14):
  - Fixed missing Loader2 imports in cv-dashboard.tsx and positions-list.tsx
  - Verified all component files are in use (avatar.tsx, dropdown-menu.tsx, radio-group.tsx - used in layout)
  - Confirmed all npm dependencies are actively used
  - All new component files (score-badge, stat-card, status-badge, empty-state, loading-spinner) are properly integrated
  - Text formatter utility is being used in positions-list modal views
  - tw-animate-css is used in globals.css for animations
  - react-pdf NOT directly used (we use pdf-parse for server-side parsing instead)
- **UI/UX Improvements** (2025-10-14):
  - Fixed button hover visibility issue in navigation menu (components/button.tsx)
  - Ghost variant now uses `hover:text-primary` instead of `hover:text-accent-foreground`
  - Ensures text remains visible on light backgrounds during hover state
- **Enhanced AI CV Processing** (2025-01-15):
  - Improved candidate summary generation (4-6 sentences with detailed profile)
  - Split skills into technicalSkills and softSkills
  - Added new fields: yearsOfExperience, certifications, languages, keyAchievements
  - Implemented data normalization (phone, dates, skill names)
  - Enhanced AI prompt with detailed instructions
  - Updated database schema with new candidate fields
- Added modal-based position editing workflow
- Implemented intelligent text formatting system
- Enhanced position view modal with formatted content
- Improved UX - editing without page navigation

**Current Focus**:
- Core CV processing pipeline
- AI matching algorithm refinement
- UI/UX improvements
- Modal-based workflows for better UX
- Text formatting and presentation
- Bug fixes and stability

**Known Issues**:
- Gmail sync sometimes requires multiple attempts
- Large PDFs (>10MB) slow to process
- AI matching can be slow for large candidate pools
- No pagination on CV list (performance issue with 100+ CVs)

---

*This document is maintained as the single source of truth for project architecture and functionality. Update when making significant changes.*
