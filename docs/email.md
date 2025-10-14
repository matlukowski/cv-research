# 📧 Email Setup Guide

Complete guide for setting up and using the email system with Resend.

## Quick Start

### 1. Get Resend API Key

1. Sign up at [Resend](https://resend.com/)
2. Go to [API Keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy and add to `.env`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```

### 2. Verify Your Domain

To send emails from your own domain:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records to your domain provider:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **DMARC Record** (TXT)
5. Wait for verification (~5 minutes)
6. Update `.env`:
   ```env
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### 3. Test Email Sending

```typescript
import { sendWelcomeEmail } from '@/lib/email/send';

// Send test email
await sendWelcomeEmail({
  to: 'test@example.com',
  userName: 'Test User',
  dashboardUrl: 'http://localhost:3000/dashboard'
});
```

## Available Email Functions

### Welcome Email

Sent when a new user signs up.

```typescript
import { sendWelcomeEmail } from '@/lib/email/send';

await sendWelcomeEmail({
  to: string,           // Recipient email
  userName: string,     // User's name
  dashboardUrl: string  // Dashboard URL
});
```

**When to trigger:**
- After successful user registration
- In your Clerk webhook handler (`user.created` event)

### Team Invitation Email

Sent when a user is invited to join a team.

```typescript
import { sendTeamInvitationEmail } from '@/lib/email/send';

await sendTeamInvitationEmail({
  to: string,              // Invitee email
  inviterName: string,     // Who sent the invitation
  teamName: string,        // Team name
  invitationUrl: string    // Invitation acceptance URL
});
```

**When to trigger:**
- When team owner invites new member
- In your invite creation API route

### Password Reset Email

Sent when user requests password reset.

```typescript
import { sendPasswordResetEmail } from '@/lib/email/send';

await sendPasswordResetEmail({
  to: string,        // User email
  userName: string,  // User's name
  resetUrl: string   // Password reset URL
});
```

**When to trigger:**
- On password reset request
- Note: If using Clerk, this is handled automatically

### Subscription Confirmation Email

Sent after successful subscription payment.

```typescript
import { sendSubscriptionConfirmationEmail } from '@/lib/email/send';

await sendSubscriptionConfirmationEmail({
  to: string,           // User email
  userName: string,     // User's name
  planName: string,     // Subscription plan name
  dashboardUrl: string  // Dashboard URL
});
```

**When to trigger:**
- After Stripe checkout success
- In your Stripe webhook handler (`checkout.session.completed`)

## Email Templates

Templates are located in `lib/email/templates.tsx` and use React components with inline styles.

### Customizing Templates

1. Open `lib/email/templates.tsx`
2. Find the template you want to customize
3. Modify the JSX and styles
4. Test your changes

Example customization:

```tsx
// Change the welcome email heading color
export const WelcomeEmailTemplate: React.FC<EmailTemplateProps> = ({
  userName,
  actionUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <h1 style={{ color: '#6366f1' }}> {/* Changed from #333 to purple */}
      Welcome to Our SaaS, {userName}! 🎉
    </h1>
    {/* ... rest of template */}
  </div>
);
```

### Adding New Templates

1. Create new template in `lib/email/templates.tsx`:

```tsx
interface NewTemplateProps {
  userName: string;
  customData: string;
}

export const NewEmailTemplate: React.FC<NewTemplateProps> = ({
  userName,
  customData
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
    <h1>Custom Email</h1>
    <p>Hello {userName}</p>
    <p>{customData}</p>
  </div>
);
```

2. Create sending function in `lib/email/send.tsx`:

```tsx
export async function sendNewEmail({
  to,
  userName,
  customData,
}: {
  to: string;
  userName: string;
  customData: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Your Custom Subject',
      react: NewEmailTemplate({ userName, customData }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
```

## Integration Examples

### Clerk Webhook Integration

Handle user creation and send welcome email:

```typescript
// app/api/webhooks/clerk/route.ts
import { sendWelcomeEmail } from '@/lib/email/send';

export async function POST(req: Request) {
  const evt = await req.json();
  
  if (evt.type === 'user.created') {
    await sendWelcomeEmail({
      to: evt.data.email_addresses[0].email_address,
      userName: evt.data.first_name || 'there',
      dashboardUrl: `${process.env.BASE_URL}/dashboard`
    });
  }
  
  return Response.json({ received: true });
}
```

### Stripe Webhook Integration

Send confirmation after successful payment:

```typescript
// app/api/stripe/webhook/route.ts
import { sendSubscriptionConfirmationEmail } from '@/lib/email/send';

export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(/* ... */);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Get user details from your database
    const user = await getUserById(session.client_reference_id);
    
    await sendSubscriptionConfirmationEmail({
      to: user.email,
      userName: user.name,
      planName: session.line_items[0].description,
      dashboardUrl: `${process.env.BASE_URL}/dashboard`
    });
  }
  
  return Response.json({ received: true });
}
```

### Team Invitation Integration

```typescript
// app/api/team/invite/route.ts
import { sendTeamInvitationEmail } from '@/lib/email/send';

export async function POST(req: Request) {
  const { email, teamId } = await req.json();
  
  const user = await getUser();
  const team = await getTeamById(teamId);
  
  // Create invitation in database
  const invitation = await createInvitation({ email, teamId });
  
  // Send invitation email
  await sendTeamInvitationEmail({
    to: email,
    inviterName: user.name,
    teamName: team.name,
    invitationUrl: `${process.env.BASE_URL}/invite/${invitation.id}`
  });
  
  return Response.json({ success: true });
}
```

## Testing

### Local Testing

During development, use Resend's test mode:

```env
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx  # Use test API key
RESEND_FROM_EMAIL=onboarding@resend.dev  # Use resend.dev domain
```

All emails will be sent but marked as test emails in Resend dashboard.

### Preview Emails

Use Resend's email preview feature:

```typescript
// Create a test route: app/api/email/preview/route.ts
import { WelcomeEmailTemplate } from '@/lib/email/templates';
import { render } from '@react-email/render';

export async function GET() {
  const html = render(
    WelcomeEmailTemplate({
      userName: 'Test User',
      actionUrl: 'http://localhost:3000/dashboard'
    })
  );
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

Visit `http://localhost:3000/api/email/preview` to see the email.

## Best Practices

### 1. Error Handling

Always handle email errors gracefully:

```typescript
const result = await sendWelcomeEmail({...});

if (!result.success) {
  // Log error but don't block user flow
  console.error('Failed to send welcome email:', result.error);
  // Continue with registration process
}
```

### 2. Rate Limiting

Resend has rate limits:
- **Free tier**: 100 emails/day
- **Paid tier**: Higher limits based on plan

Track email sends to avoid hitting limits.

### 3. Email Validation

Validate emails before sending:

```typescript
import { z } from 'zod';

const emailSchema = z.string().email();

if (!emailSchema.safeParse(email).success) {
  throw new Error('Invalid email address');
}
```

### 4. Unsubscribe Links

Add unsubscribe links to marketing emails:

```tsx
<p style={{ fontSize: '12px', color: '#999' }}>
  <a href={`${baseUrl}/unsubscribe?email=${email}`}>
    Unsubscribe
  </a>
</p>
```

### 5. Email Logging

Log all email sends for debugging:

```typescript
await db.insert(emailLogs).values({
  to: email,
  type: 'welcome',
  status: 'sent',
  sentAt: new Date()
});
```

## Troubleshooting

### Emails not sending

1. **Check API key**: Verify `RESEND_API_KEY` is correct
2. **Verify domain**: Ensure domain is verified in Resend
3. **Check logs**: Review Resend dashboard for errors
4. **Rate limits**: Check if you've hit rate limits

### Emails going to spam

1. **Verify domain**: Complete SPF, DKIM, DMARC setup
2. **Warm up domain**: Start with low volume, gradually increase
3. **Avoid spam triggers**: Don't use ALL CAPS, excessive exclamation marks
4. **Include unsubscribe**: Add unsubscribe links

### Template not rendering

1. **Check React syntax**: Ensure JSX is valid
2. **Inline styles only**: Use inline styles, not CSS classes
3. **Test locally**: Use preview route to debug

## Migration from Other Services

### From SendGrid

1. Replace SendGrid client with Resend
2. Convert SendGrid templates to React components
3. Update API keys in environment variables
4. Test all email types

### From Postmark

1. Replace Postmark client with Resend
2. Convert email templates to React
3. Update domain verification
4. Test thoroughly

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Status Page](https://status.resend.com/)
- [Resend Discord](https://discord.gg/resend)