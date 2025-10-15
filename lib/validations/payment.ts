import { z } from 'zod';

/**
 * Payment and subscription validation schemas
 * Use these schemas to validate payment-related data
 */

export const createCheckoutSchema = z.object({
  priceId: z
    .string()
    .min(1, 'Price ID is required')
    .startsWith('price_', 'Invalid Stripe price ID format'),
  teamId: z.number().int().positive('Invalid team ID').optional(),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional(),
});

export const webhookEventSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.record(z.string(), z.any()),
  }),
});

export const subscriptionUpdateSchema = z.object({
  teamId: z.number().int().positive('Invalid team ID'),
  stripeSubscriptionId: z.string().min(1, 'Subscription ID is required'),
  stripeProductId: z.string().min(1, 'Product ID is required'),
  planName: z.string().min(1, 'Plan name is required'),
  subscriptionStatus: z.enum([
    'active',
    'trialing',
    'past_due',
    'canceled',
    'unpaid',
    'incomplete',
    'incomplete_expired',
  ]),
});

// Type exports for TypeScript
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type WebhookEventInput = z.infer<typeof webhookEventSchema>;
export type SubscriptionUpdateInput = z.infer<typeof subscriptionUpdateSchema>;

/**
 * Example usage in API route:
 * 
 * import { createCheckoutSchema } from '@/lib/validations/payment';
 * import { stripe } from '@/lib/payments/stripe';
 * 
 * export async function POST(req: Request) {
 *   try {
 *     const body = await req.json();
 *     const data = createCheckoutSchema.parse(body);
 *     
 *     const session = await stripe.checkout.sessions.create({
 *       line_items: [{ price: data.priceId, quantity: 1 }],
 *       mode: 'subscription',
 *       success_url: data.successUrl,
 *       cancel_url: data.cancelUrl,
 *     });
 *     
 *     return Response.json({ url: session.url });
 *   } catch (error) {
 *     if (error instanceof z.ZodError) {
 *       return Response.json({ error: error.errors }, { status: 400 });
 *     }
 *     return Response.json({ error: 'Internal error' }, { status: 500 });
 *   }
 * }
 */