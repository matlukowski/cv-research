import { z } from 'zod';

/**
 * Team validation schemas
 * Use these schemas to validate team-related data
 */

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(100, 'Team name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Team name can only contain letters, numbers, spaces, and hyphens'),
});

export const updateTeamSchema = z.object({
  name: z
    .string()
    .min(3, 'Team name must be at least 3 characters')
    .max(100, 'Team name must be less than 100 characters')
    .optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  planName: z.string().optional(),
});

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  role: z.enum(['owner', 'member'], {
    message: 'Role must be either "owner" or "member"',
  }),
  teamId: z.number().int().positive('Invalid team ID'),
});

export const removeMemberSchema = z.object({
  userId: z.number().int().positive('Invalid user ID'),
  teamId: z.number().int().positive('Invalid team ID'),
});

// Type exports for TypeScript
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;

/**
 * Example usage in Server Action:
 * 
 * 'use server';
 * 
 * import { createTeamSchema } from '@/lib/validations/team';
 * import { db } from '@/lib/db/drizzle';
 * import { teams } from '@/lib/db/schema';
 * 
 * export async function createTeam(formData: FormData) {
 *   const validatedData = createTeamSchema.parse({
 *     name: formData.get('name'),
 *   });
 *   
 *   const [newTeam] = await db.insert(teams).values({
 *     name: validatedData.name,
 *   }).returning();
 *   
 *   return { success: true, team: newTeam };
 * }
 */