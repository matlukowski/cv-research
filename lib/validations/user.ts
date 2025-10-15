import { z } from 'zod';

/**
 * User validation schemas
 * Use these schemas to validate user-related data in API routes and Server Actions
 */

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .optional(),
});

export const deleteUserSchema = z.object({
  userId: z.number().int().positive('Invalid user ID'),
  confirmDelete: z.literal(true, {
    message: 'You must confirm deletion',
  }),
});

// Type exports for TypeScript
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;

/**
 * Example usage in API route or Server Action:
 * 
 * import { updateUserSchema } from '@/lib/validations/user';
 * 
 * export async function updateUser(formData: FormData) {
 *   const data = updateUserSchema.parse({
 *     name: formData.get('name'),
 *     email: formData.get('email'),
 *   });
 *   
 *   // data is now type-safe and validated
 *   await db.update(users).set(data);
 * }
 */