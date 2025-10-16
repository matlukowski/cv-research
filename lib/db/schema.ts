import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
  // AI settings - only Grok (xAI) is supported
  xaiApiKey: text('xai_api_key'), // User's xAI API key for Grok
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}

// ===================================
// CV MANAGEMENT SYSTEM TABLES
// ===================================

export const gmailConnections = pgTable('gmail_connections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  teamId: integer('team_id').notNull().references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  refreshToken: text('refresh_token').notNull(), // encrypted
  accessToken: text('access_token'),
  tokenExpiry: timestamp('token_expiry'),
  lastSyncAt: timestamp('last_sync_at'),
  syncFromDate: timestamp('sync_from_date'), // Filter Gmail sync from this date (nullable - must be set before first sync)
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  summary: text('summary'), // AI-generated summary (4-6 sentences)
  yearsOfExperience: integer('years_of_experience'), // Total years of professional experience
  technicalSkills: jsonb('technical_skills').$type<string[]>(), // Technical/hard skills
  softSkills: jsonb('soft_skills').$type<string[]>(), // Soft skills
  experience: jsonb('experience').$type<{
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[]>(),
  education: jsonb('education').$type<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: string;
  }[]>(),
  certifications: jsonb('certifications').$type<string[]>(), // Professional certifications
  languages: jsonb('languages').$type<{
    language: string;
    level: string; // e.g., "Native", "Fluent", "Intermediate", "Basic"
  }[]>(),
  keyAchievements: jsonb('key_achievements').$type<string[]>(), // Top 3-5 achievements
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  location: varchar('location', { length: 200 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const cvs = pgTable('cvs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  candidateId: integer('candidate_id').references(() => candidates.id),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(), // storage URL or local path
  fileSize: integer('file_size'), // in bytes
  mimeType: varchar('mime_type', { length: 100 }).default('application/pdf'),
  parsedText: text('parsed_text'), // extracted text from PDF
  emailSubject: varchar('email_subject', { length: 500 }),
  emailFrom: varchar('email_from', { length: 255 }),
  emailDate: timestamp('email_date'),
  gmailMessageId: varchar('gmail_message_id', { length: 255 }).unique(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, processed, rejected, error
  aiValidationScore: integer('ai_validation_score'), // 0-100 confidence that this is a CV
  aiValidationReason: text('ai_validation_reason'),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  processedAt: timestamp('processed_at'),
});

export const jobPositions = pgTable('job_positions', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').notNull().references(() => teams.id),
  createdBy: integer('created_by').notNull().references(() => users.id),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  responsibilities: text('responsibilities'),
  location: varchar('location', { length: 200 }),
  employmentType: varchar('employment_type', { length: 50 }), // full-time, part-time, contract, etc.
  salaryRange: varchar('salary_range', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, closed, draft
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  cvId: integer('cv_id').notNull().references(() => cvs.id),
  jobPositionId: integer('job_position_id').references(() => jobPositions.id), // NULL = spontaneous application
  applicationType: varchar('application_type', { length: 20 }).notNull().default('direct'), // 'direct' or 'spontaneous'
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, reviewing, interview, rejected, accepted
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewNotes: text('review_notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const candidateMatches = pgTable('candidate_matches', {
  id: serial('id').primaryKey(),
  jobPositionId: integer('job_position_id').notNull().references(() => jobPositions.id),
  candidateId: integer('candidate_id').notNull().references(() => candidates.id),
  cvId: integer('cv_id').notNull().references(() => cvs.id),
  applicationId: integer('application_id').references(() => applications.id), // NULL if this is a cross-match
  matchType: varchar('match_type', { length: 20 }).notNull().default('cross'), // 'direct' = applied for this position, 'cross' = suggested match
  matchScore: integer('match_score').notNull(), // 0-100
  aiAnalysis: text('ai_analysis'), // detailed AI reasoning (3-4 sentences)
  summary: text('summary'), // short summary from AI (1-2 sentences)
  strengths: jsonb('strengths').$type<string[]>(), // candidate strengths for this position
  weaknesses: jsonb('weaknesses').$type<string[]>(), // areas for improvement
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations
export const gmailConnectionsRelations = relations(gmailConnections, ({ one }) => ({
  user: one(users, {
    fields: [gmailConnections.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [gmailConnections.teamId],
    references: [teams.id],
  }),
}));

export const candidatesRelations = relations(candidates, ({ one, many }) => ({
  team: one(teams, {
    fields: [candidates.teamId],
    references: [teams.id],
  }),
  cvs: many(cvs),
  matches: many(candidateMatches),
}));

export const cvsRelations = relations(cvs, ({ one, many }) => ({
  team: one(teams, {
    fields: [cvs.teamId],
    references: [teams.id],
  }),
  candidate: one(candidates, {
    fields: [cvs.candidateId],
    references: [candidates.id],
  }),
  matches: many(candidateMatches),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  cv: one(cvs, {
    fields: [applications.cvId],
    references: [cvs.id],
  }),
  jobPosition: one(jobPositions, {
    fields: [applications.jobPositionId],
    references: [jobPositions.id],
  }),
}));

export const jobPositionsRelations = relations(jobPositions, ({ one, many }) => ({
  team: one(teams, {
    fields: [jobPositions.teamId],
    references: [teams.id],
  }),
  createdBy: one(users, {
    fields: [jobPositions.createdBy],
    references: [users.id],
  }),
  matches: many(candidateMatches),
  applications: many(applications),
}));

export const candidateMatchesRelations = relations(candidateMatches, ({ one }) => ({
  jobPosition: one(jobPositions, {
    fields: [candidateMatches.jobPositionId],
    references: [jobPositions.id],
  }),
  candidate: one(candidates, {
    fields: [candidateMatches.candidateId],
    references: [candidates.id],
  }),
  cv: one(cvs, {
    fields: [candidateMatches.cvId],
    references: [cvs.id],
  }),
  application: one(applications, {
    fields: [candidateMatches.applicationId],
    references: [applications.id],
  }),
}));

// TypeScript Types
export type GmailConnection = typeof gmailConnections.$inferSelect;
export type NewGmailConnection = typeof gmailConnections.$inferInsert;
export type Candidate = typeof candidates.$inferSelect;
export type NewCandidate = typeof candidates.$inferInsert;
export type CV = typeof cvs.$inferSelect;
export type NewCV = typeof cvs.$inferInsert;
export type JobPosition = typeof jobPositions.$inferSelect;
export type NewJobPosition = typeof jobPositions.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type CandidateMatch = typeof candidateMatches.$inferSelect;
export type NewCandidateMatch = typeof candidateMatches.$inferInsert;
