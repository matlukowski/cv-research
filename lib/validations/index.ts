/**
 * Validation Schemas Index
 * 
 * This file exports all validation schemas for easy importing.
 * All schemas use Zod for runtime type validation.
 * 
 * Usage:
 * import { createTeamSchema, updateUserSchema } from '@/lib/validations';
 */

// User validations
export {
  updateUserSchema,
  deleteUserSchema,
  type UpdateUserInput,
  type DeleteUserInput,
} from './user';

// Team validations
export {
  createTeamSchema,
  updateTeamSchema,
  inviteMemberSchema,
  removeMemberSchema,
  type CreateTeamInput,
  type UpdateTeamInput,
  type InviteMemberInput,
  type RemoveMemberInput,
} from './team';

// Payment validations
export {
  createCheckoutSchema,
  webhookEventSchema,
  subscriptionUpdateSchema,
  type CreateCheckoutInput,
  type WebhookEventInput,
  type SubscriptionUpdateInput,
} from './payment';

// Common validations and utilities
export {
  paginationSchema,
  searchSchema,
  idSchema,
  slugSchema,
  emailListSchema,
  dateRangeSchema,
  urlSchema,
  phoneSchema,
  safeParse,
  type PaginationInput,
  type SearchInput,
  type IdInput,
  type DateRangeInput,
} from './common';

/**
 * Quick Start Guide:
 * 
 * 1. Import the schema you need:
 *    import { createTeamSchema } from '@/lib/validations';
 * 
 * 2. Use it to validate data:
 *    const validatedData = createTeamSchema.parse(rawData);
 * 
 * 3. Or use safeParse for error handling:
 *    const result = safeParse(createTeamSchema, rawData);
 *    if (!result.success) {
 *      return { error: result.error };
 *    }
 * 
 * 4. TypeScript types are automatically inferred:
 *    type CreateTeamData = z.infer<typeof createTeamSchema>;
 *    // or import the exported type:
 *    import { CreateTeamInput } from '@/lib/validations';
 */