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
- **xAI Grok 4 Fast** - AI processing (non-reasoning model)
  - CV validation and classification (temperature: 0.3)
  - Structured data extraction (temperature: 0.3)
  - Intelligent candidate matching (temperature: 0.3)
  - Fast, reliable JSON output with response_format enforcement

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
│   │   ├── candidate-matcher.ts # AI-powered candidate matching (Direct vs Cross)
│   │   └── job-detector.ts      # AI job position detection from emails
│   ├── applications/            # Application management
│   │   └── application-manager.ts # Create, update, query applications
│   ├── gmail/                   # Gmail integration
│   │   ├── auth.ts              # OAuth 2.0 flow
│   │   ├── sync.ts              # Email synchronization + auto-application creation
│   │   └── cv-filters.ts        # Intelligent CV filtering
│   ├── storage/                 # File storage
│   │   └── file-storage.ts      # Local file handling
│   ├── db/                      # Database layer
│   │   ├── schema.ts            # Drizzle schema definitions
│   │   ├── queries.ts           # Database queries
│   │   ├── drizzle.ts           # Database connection
│   │   ├── migrations/          # SQL migrations
│   │   ├── seed.ts              # Seed data
│   │   └── setup.ts             # Database setup script
│   ├── payments/                # Payment processing
│   │   ├── stripe.ts            # Stripe client
│   │   └── actions.ts           # Payment actions
│   ├── email/                   # Email service
│   │   ├── client.ts            # Resend client
│   │   ├── send.tsx             # Email sending
│   │   └── templates.tsx        # Email templates
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
   - Model: Grok 4 Fast (xAI, temperature: 0.3)
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
   - Model: Grok 4 Fast (xAI, temperature: 0.3)
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

#### Application Management System
**Purpose**: Track which candidates applied for which positions and distinguish them from AI-suggested matches

**Problem Solved**:
- Prevents matching candidates who didn't apply for a specific position
- Provides context for recruiter feedback (applied vs suggested)
- Maintains GDPR compliance by tracking application intent
- Enables proper candidate journey tracking

**Features**:

1. **Automatic Application Detection** (AI-powered)
   - Analyzes email subject and body during Gmail sync
   - Detects if candidate is applying for a specific position
   - Matches against active job positions in the system
   - Creates application record automatically
   - Falls back to "spontaneous application" if no position detected

2. **Application Types**:
   - **Direct** - Candidate applied for a specific position
   - **Spontaneous** - Candidate sent CV without specific position

3. **Application Statuses**:
   - `pending` - Application received, awaiting review
   - `reviewing` - Under active review by recruiter
   - `interview` - Candidate invited for interview
   - `rejected` - Application rejected
   - `accepted` - Candidate accepted/hired

4. **Application Management**:
   - View all applications for a specific position
   - View all spontaneous applications
   - Update application status with notes
   - Track review timeline (appliedAt, reviewedAt)

**Key Files**:
- `lib/ai/job-detector.ts` - AI job position detection from email content
- `lib/applications/application-manager.ts` - Application CRUD operations
- `lib/gmail/sync.ts` - Enhanced with auto-application creation
- `app/api/applications/route.ts` - Application API endpoints
- `app/api/applications/[id]/route.ts` - Single application operations
- `app/api/positions/[id]/applications/route.ts` - Position applications

**Database Tables**:
- `applications` - Application records linking CVs to positions

**Workflow**:
```
1. CV arrives via Gmail sync
2. AI analyzes email subject/body
3. Detects target job position (or none)
4. Creates application record:
   - Direct: cvId + jobPositionId
   - Spontaneous: cvId only (jobPositionId = null)
5. Application available for recruiter review
```

---

#### AI-Powered Candidate Matching
**Purpose**: Intelligently match candidates to job positions with Direct vs Cross distinction

**Matching Algorithm** (Enhanced with Direct vs Cross Matching):

1. **Two-Phase Matching Process**:

   **Phase 1: Direct Applications**
   - Matches candidates who **applied for this specific position**
   - Queries `applications` table for this job position
   - Only processes candidates with direct applications
   - Marked as `matchType: 'direct'`
   - Linked to application record via `applicationId`
   - **Priority**: Displayed first in results

   **Phase 2: Cross Matches** (Optional)
   - Matches candidates who **did NOT apply** but might fit
   - Finds all team candidates except direct applicants
   - AI-powered suggestion system
   - Marked as `matchType: 'cross'`
   - No application record (applicationId: null)
   - **Purpose**: Discover talent in existing database

2. **Input** (per candidate):
   - Job position details (title, description, requirements, responsibilities)
   - Candidate profile (all extracted data)
   - Full CV text (up to 6000 chars)

3. **AI Analysis**:
   - Model: Grok 4 Fast (xAI, temperature: 0.3)
   - Task: Evaluate candidate-job fit
   - Scoring scale:
     - 0-30: Does not meet basic requirements
     - 31-50: Meets some requirements, lacks key skills
     - 51-70: Good fit, meets most requirements
     - 71-85: Very good fit, meets all requirements
     - 86-100: Ideal candidate, exceeds requirements

4. **Output**:
   ```json
   {
     "matchScore": 0-100,
     "matchType": "direct" | "cross",
     "applicationId": number | null,
     "aiAnalysis": "detailed 3-4 sentence analysis",
     "strengths": ["strength 1", "strength 2", "strength 3"],
     "weaknesses": ["weakness 1", "weakness 2"],
     "summary": "1-2 sentence summary of fit"
   }
   ```

5. **Sorting & Display**:
   - **Primary Sort**: Match type (direct first, cross second)
   - **Secondary Sort**: Match score (highest first)
   - Result: Direct applicants always appear before suggestions
   - Clear visual distinction in UI

6. **Storage**:
   - Results saved to `candidate_matches` table
   - Includes matchType and applicationId
   - Can be re-run to update scores
   - Historical tracking of matches

7. **Filtering Options**:
   - `matchType: 'all' | 'direct' | 'cross'` - Control which matches to return
   - `includeCrossMatches: boolean` - Enable/disable cross-match suggestions
   - `minScore: number` - Minimum match score threshold
   - `maxResults: number` - Limit number of results

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

#### `applications`
```sql
- id: serial (PK)
- cvId: FK(cvs.id)
- jobPositionId: FK(job_positions.id) [nullable for spontaneous applications]
- applicationType: varchar(20) DEFAULT 'direct' ('direct' or 'spontaneous')
- status: varchar(20) DEFAULT 'pending' (pending, reviewing, interview, rejected, accepted)
- appliedAt: timestamp DEFAULT now()
- reviewedAt: timestamp
- reviewNotes: text
- createdAt, updatedAt: timestamp
```

#### `candidate_matches`
```sql
- id: serial (PK)
- jobPositionId: FK(job_positions.id)
- candidateId: FK(candidates.id)
- cvId: FK(cvs.id)
- applicationId: FK(applications.id) [nullable for cross-matches]
- matchType: varchar(20) DEFAULT 'cross' ('direct' or 'cross')
- matchScore: integer (0-100)
- aiAnalysis: text (detailed reasoning)
- summary: text (short 1-2 sentence summary)
- strengths: jsonb (string[])
- weaknesses: jsonb (string[])
- createdAt, updatedAt: timestamp
```

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

### 3. CV Synchronization (with Intelligent Filtering + Auto-Application Detection)
```
1. Manual trigger: User clicks "Sync Now"
   OR Automated: Scheduled job (cron)
2. API call to /api/gmail/sync
   - Optional params: useSmartFiltering (default: true), filterThreshold (default: 10)
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
   i. **NEW: AI Job Position Detection**:
      - Analyze email subject and body
      - Match against active job positions for team
      - Determine if candidate is applying for specific position
      - Create application record:
        * Direct application: links to specific job position
        * Spontaneous application: no job position (jobPositionId = null)
      - Log detection result (position, confidence, reason)
      - Fallback to spontaneous if detection fails
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
   a. Send text to Grok 4 Fast (xAI)
   b. Get validation result (isCV, confidence, reason)
   c. Save validation score and reason
8. If NOT valid CV (confidence < 60):
   - Update status to 'rejected'
   - Stop processing
9. If valid CV:
   a. AI Data Extraction:
      - Send text to Grok 4 Fast (xAI)
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

### 6. Candidate Matching (Direct vs Cross)
```
1. User views job position
2. Clicks "Find Candidates" or "Run Matching"
3. API call to /api/positions/[id]/match
   - Options: matchType ('all'|'direct'|'cross'), includeCrossMatches (boolean)
4. Load job position details
5. Auto-process any pending CVs first

6. PHASE 1: Match Direct Applications
   a. Query applications table for this position
   b. Get all candidates who applied for this position
   c. For each direct applicant:
      - Load processed CV
      - Prepare AI matching prompt
      - Send to Grok 4 Fast (xAI, temperature: 0.3)
      - Parse response (score, analysis, strengths, weaknesses)
      - Mark as matchType: 'direct'
      - Link to applicationId
      - Save to candidate_matches table
   d. Filter by minimum score
   e. Collect direct match results

7. PHASE 2: Match Cross Candidates (if enabled)
   a. Get all processed candidates for team
   b. Filter OUT candidates who already applied (from Phase 1)
   c. For each cross candidate:
      - Load processed CV
      - Prepare AI matching prompt
      - Send to Grok 4 Fast (xAI, temperature: 0.3)
      - Parse response (score, analysis, strengths, weaknesses)
      - Mark as matchType: 'cross'
      - No applicationId (null)
      - Save to candidate_matches table
   d. Filter by minimum score
   e. Collect cross match results

8. Combine and sort results:
   - Primary sort: matchType (direct first, cross second)
   - Secondary sort: matchScore (descending)

9. Return combined results

10. Display in UI with sections:
    ┌─────────────────────────────────┐
    │ DIRECT APPLICATIONS (3)         │
    │ ✓ Jan Kowalski (85%) - APPLIED │
    │ ✓ Anna Nowak (72%) - APPLIED   │
    ├─────────────────────────────────┤
    │ SUGGESTED CANDIDATES (2)        │
    │ ⚡ Piotr Kowalski (78%)         │
    │ ⚡ Maria Nowak (65%)             │
    └─────────────────────────────────┘

    Each showing:
    - Match type badge (APPLIED vs SUGGESTED)
    - Score badge and quality indicator
    - Candidate details
    - Strengths/weaknesses
    - AI analysis
    - Contact information
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
- `POST /api/positions/[id]/match` - Run candidate matching (Direct + Cross)
  - Body: `{ minScore?, maxResults?, matchType?, includeCrossMatches? }`
  - Returns: `MatchResult[]` (sorted by matchType then score)
- `GET /api/positions/[id]/match` - Get existing match results
- `GET /api/positions/[id]/applications` - Get all applications for this position

### Applications
- `GET /api/applications` - Get all spontaneous applications for team
- `GET /api/applications/[id]` - Get application details
- `PATCH /api/applications/[id]` - Update application status
  - Body: `{ status, reviewNotes? }`
  - Valid statuses: pending, reviewing, interview, rejected, accepted

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

# xAI (for AI-powered CV processing and matching)
XAI_API_KEY=xai-xxx
XAI_MODEL=grok-4-fast-non-reasoning

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
- **Grok 4 Fast (xAI)** - Fast non-reasoning model via OpenAI-compatible API
  - API Endpoint: `https://api.x.ai/v1`
  - Model: `grok-4-fast-non-reasoning`
  - Temperature: 0.3 (consistent, deterministic outputs)
  - Response Format: `json_object` (enforced JSON structure)
  - All operations: CV validation, data extraction, candidate matching

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
**Last Updated**: 2025-10-16
**Maintainer**: Development Team

**Recent Changes**:
- **Code Optimization Phase 2 & 3 - Removed Validation Modules & Optimized Queries** (2025-10-16):
  - **Phase 2: Validation Module Removal**
    - **Problem**: 6 validation files (~300+ lines) completely unused in application
      - Files existed in `lib/validations/` but never imported anywhere
      - Only references were self-documentation examples
      - Added code complexity without any functionality
    - **Solution**: Complete removal of validation directory
      - Deleted files: `user.ts`, `team.ts`, `payment.ts`, `common.ts`, `index.ts`, `README.md`
      - No impact on application functionality (100% unused code)
      - Verified zero imports in app/ directory and throughout codebase
    - **Benefits**:
      - Removed ~300+ lines of dead code
      - Cleaner codebase structure
      - Reduced cognitive overhead for developers
      - Less maintenance burden
  - **Phase 3: Query Optimization**
    - **Problem**: Dashboard candidate count query inefficient
      - Fetched ALL candidateId values from database
      - Processed in JavaScript with `.map()`, `.filter()`, `new Set()`
      - O(n) memory usage for all IDs
      - Slow for large datasets (100+ candidates)
    - **Solution**: Use SQL COUNT(DISTINCT) directly in database
      - Changed from: Fetch all IDs → process in JS → count unique
      - Changed to: `COUNT(DISTINCT candidateId)` in PostgreSQL
      - Uses Drizzle's `sql` template for raw SQL optimization
    - **Code Changes** (`app/(dashboard)/dashboard/page.tsx:25-32`):
      ```typescript
      // Before (inefficient):
      const cvWithCandidates = await db
        .select({ candidateId: cvs.candidateId })
        .from(cvs)
        .where(eq(cvs.teamId, teamId));
      const uniqueCandidateIds = new Set(
        cvWithCandidates.map(c => c.candidateId).filter(id => id !== null)
      );
      const candidateCount = uniqueCandidateIds.size;

      // After (optimized):
      const candidateCountResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${cvs.candidateId})` })
        .from(cvs)
        .where(eq(cvs.teamId, teamId));
      const candidateCount = candidateCountResult[0]?.count || 0;
      ```
    - **Benefits**:
      - 🚀 **Performance**: Counts in database instead of JavaScript
      - 💾 **Memory**: O(1) vs O(n) memory usage
      - ⚡ **Speed**: Single aggregate query vs fetch-all-then-process
      - 📊 **Scalability**: Handles large datasets efficiently
      - 🔧 **Simplicity**: Less code, clearer intent
  - **Files Modified**:
    - Deleted: `lib/validations/*` (6 files removed)
    - Updated: `app/(dashboard)/dashboard/page.tsx` (query optimization)
  - **Verification**:
    - TypeScript compilation: ✅ Successful
    - Build: Stripe config error (pre-existing, unrelated to changes)
    - Code quality: Zero unused imports, cleaner structure
- **Database Schema Cleanup - Removed Unused SaaS Boilerplate Tables** (2025-10-16):
  - **Problem**: Schema contained 8 unused tables from original SaaS boilerplate template
    - Tables were fully defined but never used in the CV ATS application
    - Added unnecessary complexity to migrations and schema maintenance
    - Cluttered the schema with ~280 lines of unused code
  - **Solution**: Complete removal of unused tables
    - Removed 8 table definitions: `projects`, `apiKeys`, `webhookEndpoints`, `webhookDeliveries`, `usageEvents`, `plans`, `features`, `planFeatures`
    - Removed all Drizzle relations for these tables
    - Removed all TypeScript type exports
    - Generated and applied migration `0005_chubby_namorita.sql` to drop tables with CASCADE
    - Updated project_summary.md to reflect changes
  - **Database Migration**: `lib/db/migrations/0005_chubby_namorita.sql`
    - Drops 8 tables with CASCADE to handle dependencies
    - Safely removes foreign key constraints
  - **Benefits**:
    - Reduced schema from 19 tables to 11 tables (42% reduction)
    - Removed ~153 lines of code from schema.ts
    - Cleaner, more focused database structure
    - Easier schema maintenance and understanding
    - Faster migrations and database operations
    - Only keeps tables actively used by the CV ATS application
  - **Remaining Tables** (11 total):
    - Core SaaS (5): users, teams, team_members, activity_logs, invitations
    - CV Management (6): gmail_connections, candidates, cvs, job_positions, applications, candidate_matches
- **Removed Mistral Local LLM, Fixed Candidate Data Extraction, Fixed Dashboard Counter** (2025-10-16):
  - **Problem 1**: Mistral (local LLM) performed poorly compared to Grok
    - Mistral generated placeholder/example data instead of real analysis
    - Required ~6-7GB RAM and Ollama setup
    - Quality significantly lower than Grok
  - **Problem 2**: AI extracting placeholder personal data from CVs
    - Names like "John Doe", "Jan Kowalski" instead of real candidate names
    - Email addresses like "john.doe@example.com" instead of actual emails
    - Phone numbers like "+48 123 456 789" instead of real numbers
    - Root cause: Prompt contained detailed example with "Jan Kowalski" data that AI copied literally
  - **Problem 3**: Dashboard candidate counter showing cumulative count
    - Counter showed 6 candidates when only 2 CVs existed
    - Counted all candidates ever created, not current candidates with CVs
    - Didn't update when CVs were deleted
  - **Solution 1 - Removed Mistral Completely**:
    - Deleted `components/ai-provider-switch.tsx` (navbar switcher)
    - Removed AIProviderSwitch from dashboard layout
    - Deleted MistralProvider class from `lib/ai/providers.ts`
    - Removed Ollama integration code
    - Simplified AI settings to only xAI API key input
    - Updated `getAIProvider()` to require user's xAI API key (mandatory)
    - Database migration `0004_young_marvex.sql`: Dropped `ai_provider` and `ollama_base_url` columns
    - Kept only Grok (xAI) with user API key requirement
  - **Solution 2 - Fixed CV Data Extraction** (`lib/ai/cv-processor.ts:166-268`):
    - Removed concrete example data from prompt:
      * Before: `"firstName": "Jan", "lastName": "Kowalski", "email": "jan.kowalski@example.com"`
      * After: `"firstName": "[EKSTRAKTUJ Z CV - dokładne imię kandydata lub null]"`
    - Added new section "EKSTRAKCJA DANYCH OSOBOWYCH" with strict rules:
      * ⚠️ KRYTYCZNE: Ekstraktuj dane DOKŁADNIE z CV
      * ⛔ ZABRONIONE: NIE używaj przykładowych danych (Jan, John, Doe, example.com)
      * ✅ PRAWIDŁOWE: Jeśli dane w CV → ekstraktuj; jeśli brak → zwróć null
    - Added validation step to check for placeholder names
    - Changed example JSON structure to use instruction comments instead of real data
  - **Solution 3 - Fixed Dashboard Counter** (`app/(dashboard)/dashboard/page.tsx:25-39`):
    - Changed from counting all candidates in table to counting unique candidates with CVs:
      * Before: `SELECT count() FROM candidates WHERE teamId = ?` (returns 6)
      * After: `SELECT DISTINCT candidateId FROM cvs WHERE teamId = ?` (returns 2)
    - Uses `Set()` to count unique candidateId values from cvs table
    - Counter now reflects actual number of candidates with CVs in system
    - Updates correctly when CVs are deleted (shows 0 when all deleted)
  - **Updated Files**:
    - `lib/ai/providers.ts` - Removed MistralProvider, simplified to Grok only
    - `lib/ai/cv-processor.ts` - Fixed prompt engineering for personal data extraction
    - `app/(dashboard)/dashboard/page.tsx` - Fixed candidate counter logic
    - `app/(dashboard)/dashboard/settings/ai-provider-settings.tsx` - Simplified to single API key input
    - `app/(dashboard)/layout.tsx` - Removed AIProviderSwitch component
    - `app/api/team/ai-settings/route.ts` - Simplified to handle only xaiApiKey
    - `app/api/team/ai-settings/test/route.ts` - Tests only Grok provider
    - `lib/db/schema.ts` - Removed ai_provider and ollama_base_url columns
  - **Database Migrations**:
    - `lib/db/migrations/0004_young_marvex.sql` - Drop unused AI provider columns
  - **Benefits**:
    - Single, high-quality AI provider (Grok) - no confusion
    - Users must provide their own xAI API key (no shared keys)
    - Real candidate data extracted from CVs (no more "John Doe")
    - Accurate dashboard statistics (reflects actual CV count)
    - Simpler codebase and maintenance
    - Better user experience with consistent, quality AI responses
  - **AI Provider Architecture (After Changes)**:
    ```typescript
    // Only Grok supported, mandatory user API key
    export class GrokProvider implements AIProvider {
      constructor(apiKey?: string) {
        this.client = new OpenAI({
          apiKey: apiKey || process.env.XAI_API_KEY, // User key priority
          baseURL: 'https://api.x.ai/v1',
        });
      }
    }

    // getAIProvider throws error if no user API key
    export async function getAIProvider(teamId: number) {
      if (!team.xaiApiKey) {
        throw new Error('⚠️ API key xAI nie jest skonfigurowany. Przejdź do Settings...');
      }
      return new GrokProvider(team.xaiApiKey);
    }
    ```
- **Orphaned CV Detection and Cleanup** (2025-10-15):
  - **Problem**: CV records remained in database after files were deleted
    - CVs displayed on frontend even though files didn't exist on disk
    - No way to identify or clean up orphaned records
  - **Solution**: Automatic detection and cleanup system
    - **Modified GET /api/cvs**:
      - Checks file existence for each CV using `fileExists()`
      - Filters out CVs without files before sending to frontend
      - Returns `orphanedCount` in response
      - Logs orphaned CV details for debugging
    - **New endpoint: DELETE /api/cvs/orphaned**:
      - Cleans up CV records without corresponding files
      - Performs cascade deletion (candidate_matches → applications → CVs)
      - Returns count of deleted records
      - Comprehensive logging
    - **Frontend enhancements** (cv-dashboard.tsx):
      - Displays orphaned count in card description
      - Shows "Wyczyść rekordy (N)" button when orphaned CVs exist
      - Loading state during cleanup operation
      - Toast notifications for success/error
  - **Benefits**:
    - Users only see CVs that actually exist
    - Easy one-click cleanup of orphaned records
    - No manual database intervention needed
    - Maintains database integrity automatically
    - Clear visibility of orphaned record count
- **Fixed CV Deletion with Cascade** (2025-10-15):
  - **Problem**: CV deletion failed with foreign key constraint violation
    - Error: `update or delete on table "cvs" violates foreign key constraint "candidate_matches_cv_id_cvs_id_fk"`
    - CVs referenced by `candidate_matches` and `applications` tables couldn't be deleted
    - Additional issue: ENOENT errors for missing files blocked deletion
  - **Solution**: Implemented proper cascade deletion
    - Added cascade deletion for `candidate_matches` records before CV deletion
    - Added cascade deletion for `applications` records before CV deletion
    - Updated `deleteFileLocally` to gracefully handle missing files (ENOENT)
    - Proper deletion order: matches → applications → files → CVs
  - **Updated Files**:
    - `app/api/cvs/route.ts`:
      - Import `candidateMatches` and `applications` tables
      - Import `inArray` operator from Drizzle ORM
      - Delete related records before CV deletion
      - Enhanced logging with detailed step-by-step output
      - Added `relatedRecords` to response (shows counts of deleted matches/applications)
    - `lib/storage/file-storage.ts`:
      - Updated `deleteFileLocally` to catch ENOENT errors
      - Log warning instead of throwing error when file doesn't exist
      - Don't block database cleanup if file is already deleted
  - **Enhanced Error Handling**:
    - Frontend now checks `response.ok` before parsing JSON
    - Displays detailed error messages from server (`error.details`)
    - Better user feedback for deletion failures
  - **Benefits**:
    - CV deletion now works correctly even with related records
    - Proper cleanup of all associated data
    - No orphaned records left in database
    - Better error messages for debugging
    - Graceful handling of missing files
    - Comprehensive logging for troubleshooting
- **Code Cleanup & Optimization** (2025-10-14):
  - **Removed Unused Dependencies**:
    - `bcryptjs` - Not needed (Clerk handles authentication)
    - `pdf-parse` - Not used (pdfreader is used instead)
    - `pdfjs-dist` - Not used
    - `react-pdf` - Not used (server-side PDF parsing)
    - `radix-ui` - Not used (using @radix-ui/* packages)
    - `@types/pdf-parse` - Dependency removed
  - **Removed Unused Files**:
    - `lib/auth/session.ts` - Custom session management not needed with Clerk
    - `lib/auth/middleware.ts` - Clerk provides middleware
    - `scripts/migrate-candidates.ts` - One-time migration completed
    - `scripts/reset-cv-status.ts` - Utility script not in core flow
    - `scripts/run-migration-0004.ts` - One-time migration completed
  - **Removed Unused Functions**:
    - `lib/ai/job-detector.ts`: Removed `detectJobPositionFromCV()` - unused alternative method
  - **Cleaned up package.json Scripts**:
    - Removed `db:migrate-candidates` - migration completed
    - Removed `db:reset-cv-status` - utility script
  - **Benefits**:
    - Reduced npm package count from 35 to 28 dependencies (7 packages removed)
    - Removed ~50MB of unused node_modules
    - Cleaner codebase with no dead code
    - Faster npm install times
    - Reduced bundle size potential
    - Improved maintainability
- **Application Management System & Direct/Cross Matching** (2025-10-14):
  - **Problem**: System matched all candidates to all positions, regardless of whether they applied
  - **Solution**: Implemented application tracking with AI-powered position detection
  - **New Tables**:
    - `applications` - Tracks which CV applied for which position (or spontaneous)
    - Extended `candidate_matches` with `matchType` ('direct' | 'cross') and `applicationId`
  - **New Modules**:
    - `lib/ai/job-detector.ts` - AI detection of target job position from email content
    - `lib/applications/application-manager.ts` - Complete application CRUD operations
  - **Enhanced Gmail Sync**:
    - Now automatically detects job position during CV sync
    - Creates application record linking CV to position
    - Falls back to spontaneous application if no position detected
    - Uses AI to analyze email subject and body against active positions
  - **Enhanced Candidate Matching**:
    - Two-phase matching: Direct Applications → Cross Matches
    - Direct matches: Candidates who applied for this position (priority)
    - Cross matches: Candidates who didn't apply but might fit (suggestions)
    - Results sorted by type (direct first) then score
    - New filtering options: matchType, includeCrossMatches
  - **New API Endpoints**:
    - `GET/PATCH /api/applications/[id]` - Application management
    - `GET /api/positions/[id]/applications` - Position applications
    - Enhanced `/api/positions/[id]/match` with filtering options
  - **Database Migration**: `0005_add_applications_and_match_type.sql`
  - **Benefits**:
    - Recruiters know who actually applied vs who is a suggestion
    - Proper feedback context for candidates
    - GDPR compliance (tracks application intent)
    - Prevents inappropriate matching (e.g., suggesting someone who didn't apply)
    - Enables discovery of talent in database (cross-matching)
  - **Workflow**:
    ```
    CV arrives → AI detects position → Creates application → Matching distinguishes:
    ┌─────────────────────────────┐
    │ DIRECT APPLICATIONS         │ ← Applied for this position
    │ ✓ Jan Kowalski (85%)        │
    ├─────────────────────────────┤
    │ SUGGESTED CANDIDATES        │ ← Didn't apply, but might fit
    │ ⚡ Anna Nowak (78%)          │
    └─────────────────────────────┘
    ```
- **Switched from OpenAI to xAI Grok 4 Fast** (2025-10-14):
  - Replaced OpenAI GPT-5 with xAI Grok 4 Fast (non-reasoning model)
  - API Configuration:
    - New endpoint: `https://api.x.ai/v1`
    - Model: `grok-4-fast-non-reasoning`
    - Temperature: 0.3 (consistent outputs)
    - Response format: JSON object enforcement
  - Updated Files:
    - `lib/ai/cv-processor.ts` - CV validation and data extraction
    - `lib/ai/candidate-matcher.ts` - Candidate matching
  - API Method Change:
    - From: `openai.responses.create()` with `input` and `reasoning`/`text` parameters
    - To: `openai.chat.completions.create()` with `messages` and `temperature`
  - Response Handling:
    - From: `result.output_text`
    - To: `result.choices[0].message.content`
  - Environment Variables:
    - Changed: `OPENAI_API_KEY` → `XAI_API_KEY`
    - Changed: `OPENAI_MODEL` → `XAI_MODEL`
  - Benefits:
    - Faster processing (non-reasoning model)
    - OpenAI SDK compatibility (minimal code changes)
    - Reliable JSON output with format enforcement
    - All prompts remain in Polish, functionality unchanged
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
