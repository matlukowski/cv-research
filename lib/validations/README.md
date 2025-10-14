# Validation Schemas

This folder contains Zod validation schemas for type-safe data validation throughout the application.

## Why Validation?

- ✅ **Runtime Safety**: Validate data at runtime, not just compile time
- ✅ **Type Safety**: Automatically generate TypeScript types from schemas
- ✅ **Error Messages**: Clear, user-friendly error messages
- ✅ **API Security**: Validate incoming API requests
- ✅ **Form Validation**: Validate form data before processing

## Available Schemas

### User Schemas (`user.ts`)
- `updateUserSchema` - Validate user updates
- `deleteUserSchema` - Validate user deletion with confirmation

### Team Schemas (`team.ts`)
- `createTeamSchema` - Validate team creation
- `updateTeamSchema` - Validate team updates
- `inviteMemberSchema` - Validate team member invitations
- `removeMemberSchema` - Validate team member removal

### Payment Schemas (`payment.ts`)
- `createCheckoutSchema` - Validate Stripe checkout creation
- `webhookEventSchema` - Validate Stripe webhook events
- `subscriptionUpdateSchema` - Validate subscription updates

### Common Schemas (`common.ts`)
- `paginationSchema` - Validate pagination parameters
- `searchSchema` - Validate search queries
- `idSchema` - Validate numeric IDs
- `slugSchema` - Validate URL slugs
- `emailListSchema` - Validate email lists
- `dateRangeSchema` - Validate date ranges
- `urlSchema` - Validate URLs
- `phoneSchema` - Validate phone numbers
- `safeParse()` - Helper for safe parsing with error handling

## Usage Examples

### Basic Usage

```typescript
import { createTeamSchema } from '@/lib/validations';

// Parse and validate
const data = createTeamSchema.parse({
  name: 'My Team'
});
// data is now type-safe: { name: string }

// Throws error if validation fails
```

### Safe Parsing (Recommended)

```typescript
import { safeParse, createTeamSchema } from '@/lib/validations';

const result = safeParse(createTeamSchema, formData);

if (!result.success) {
  console.error('Validation failed:', result.error);
  return;
}

// result.data is now validated and type-safe
console.log(result.data.name);
```

### In API Routes

```typescript
// app/api/teams/route.ts
import { createTeamSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = createTeamSchema.parse(body);
    
    // data is validated and type-safe
    const team = await db.insert(teams).values(data);
    
    return Response.json({ team });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.errors }, 
        { status: 400 }
      );
    }
    throw error;
  }
}
```

### In Server Actions

```typescript
'use server';

import { createTeamSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function createTeam(formData: FormData) {
  const data = createTeamSchema.parse({
    name: formData.get('name'),
  });
  
  const team = await db.insert(teams).values(data).returning();
  
  revalidatePath('/dashboard/teams');
  return { success: true, team };
}
```

### Type Inference

```typescript
import { createTeamSchema, type CreateTeamInput } from '@/lib/validations';

// Option 1: Use z.infer
type TeamData = z.infer<typeof createTeamSchema>;

// Option 2: Use exported type
function createTeam(data: CreateTeamInput) {
  // data is { name: string }
}
```

### Custom Error Handling

```typescript
import { createTeamSchema } from '@/lib/validations';

try {
  const data = createTeamSchema.parse(rawData);
} catch (error) {
  if (error instanceof z.ZodError) {
    // Get formatted errors
    const formatted = error.format();
    console.log(formatted.name?._errors); // ["Team name must be at least 3 characters"]
    
    // Or get flat errors
    const flat = error.flatten();
    console.log(flat.fieldErrors.name); // ["Team name must be at least 3 characters"]
  }
}
```

## Best Practices

1. **Always Validate User Input**: Never trust data from forms, URL params, or API requests
2. **Use safeParse for Public APIs**: Handle validation errors gracefully
3. **Export Types**: Use `type MyInput = z.infer<typeof mySchema>` for TypeScript types
4. **Clear Error Messages**: Write helpful error messages for users
5. **Reuse Common Schemas**: Import common patterns from `common.ts`

## Adding New Schemas

1. Create schema in appropriate file (or create new file)
2. Export schema and type from that file
3. Add exports to `index.ts`
4. Document with JSDoc comments and examples

Example:

```typescript
// lib/validations/project.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
```

Then add to `index.ts`:

```typescript
export {
  createProjectSchema,
  type CreateProjectInput,
} from './project';
```

## Resources

- [Zod Documentation](https://zod.dev/)
- [Zod with TypeScript](https://zod.dev/?id=type-inference)
- [Error Handling](https://zod.dev/?id=error-handling)