import { z } from 'zod';

/**
 * Common validation schemas and utilities
 * Reusable validators for common patterns
 */

// Pagination
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
  filters: z.record(z.string()).optional(),
});

// ID validation
export const idSchema = z.object({
  id: z.coerce.number().int().positive('Invalid ID'),
});

// Slug validation
export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(100, 'Slug must be less than 100 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .refine((slug) => !slug.startsWith('-') && !slug.endsWith('-'), {
    message: 'Slug cannot start or end with a hyphen',
  });

// Email list validation
export const emailListSchema = z.array(
  z.string().email('Invalid email address')
).min(1, 'At least one email is required').max(100, 'Maximum 100 emails allowed');

// Date range validation
export const dateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// URL validation (with optional protocols)
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .or(z.string().regex(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/, 'Invalid domain'));

// Phone number validation (international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format (use international format: +1234567890)');

// Type exports
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type IdInput = z.infer<typeof idSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;

/**
 * Example usage:
 * 
 * import { paginationSchema, slugSchema } from '@/lib/validations/common';
 * 
 * // In API route with query params
 * export async function GET(req: Request) {
 *   const { searchParams } = new URL(req.url);
 *   
 *   const pagination = paginationSchema.parse({
 *     page: searchParams.get('page'),
 *     limit: searchParams.get('limit'),
 *   });
 *   
 *   // pagination.page is now a validated number (default: 1)
 *   // pagination.limit is now a validated number (default: 10, max: 100)
 * }
 * 
 * // Validate slug when creating a project
 * const projectData = {
 *   slug: slugSchema.parse('my-awesome-project'),
 * };
 */

/**
 * Helper function to safely parse with error handling
 */
export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.format(),
    };
  }
  
  return {
    success: true,
    data: result.data,
  };
}

/**
 * Example usage of safeParse:
 * 
 * const result = safeParse(createTeamSchema, formData);
 * 
 * if (!result.success) {
 *   return { error: result.error };
 * }
 * 
 * // result.data is now type-safe
 * await createTeam(result.data);
 */