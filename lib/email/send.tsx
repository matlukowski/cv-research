import { resend, FROM_EMAIL } from './client';
import {
  WelcomeEmailTemplate,
  TeamInvitationEmailTemplate,
  PasswordResetEmailTemplate,
  SubscriptionConfirmationEmailTemplate,
} from './templates';

export async function sendWelcomeEmail({
  to,
  userName,
  dashboardUrl,
}: {
  to: string;
  userName: string;
  dashboardUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Welcome to Our SaaS Platform! 🎉',
      react: <WelcomeEmailTemplate userName={userName} actionUrl={dashboardUrl} />,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendTeamInvitationEmail({
  to,
  inviterName,
  teamName,
  invitationUrl,
}: {
  to: string;
  inviterName: string;
  teamName: string;
  invitationUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `You've been invited to join ${teamName}`,
      react: <TeamInvitationEmailTemplate
        inviterName={inviterName}
        teamName={teamName}
        invitationUrl={invitationUrl}
        recipientEmail={to}
      />,
    });

    if (error) {
      console.error('Error sending invitation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: {
  to: string;
  userName: string;
  resetUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Reset Your Password',
      react: <PasswordResetEmailTemplate userName={userName} resetUrl={resetUrl} />,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}

export async function sendSubscriptionConfirmationEmail({
  to,
  userName,
  planName,
  dashboardUrl,
}: {
  to: string;
  userName: string;
  planName: string;
  dashboardUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Subscription Confirmed! 🎉',
      react: <SubscriptionConfirmationEmailTemplate
        userName={userName}
        planName={planName}
        dashboardUrl={dashboardUrl}
      />,
    });

    if (error) {
      console.error('Error sending subscription confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending subscription confirmation email:', error);
    return { success: false, error };
  }
}