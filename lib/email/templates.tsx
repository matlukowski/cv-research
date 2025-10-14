import * as React from 'react';

interface EmailTemplateProps {
  userName: string;
  actionUrl?: string;
}

export const WelcomeEmailTemplate: React.FC<EmailTemplateProps> = ({
  userName,
  actionUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
      Welcome to Our SaaS, {userName}! 🎉
    </h1>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      We're excited to have you on board. Your account has been successfully created,
      and you're ready to get started.
    </p>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '30px' }}>
      Here are a few things you can do to get started:
    </p>
    <ul style={{ color: '#555', fontSize: '16px', lineHeight: '1.8', marginBottom: '30px' }}>
      <li>Complete your profile</li>
      <li>Invite team members</li>
      <li>Explore our features</li>
      <li>Start your first project</li>
    </ul>
    {actionUrl && (
      <a
        href={actionUrl}
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        Go to Dashboard
      </a>
    )}
    <p style={{ color: '#777', fontSize: '14px', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      If you have any questions, feel free to reach out to our support team.
    </p>
  </div>
);

interface InvitationEmailProps {
  inviterName: string;
  teamName: string;
  invitationUrl: string;
  recipientEmail: string;
}

export const TeamInvitationEmailTemplate: React.FC<InvitationEmailProps> = ({
  inviterName,
  teamName,
  invitationUrl,
  recipientEmail,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
      You've been invited to join {teamName}
    </h1>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      <strong>{inviterName}</strong> has invited you to join their team on our platform.
    </p>
    <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
      <p style={{ color: '#333', fontSize: '14px', marginBottom: '8px' }}>
        <strong>Team:</strong> {teamName}
      </p>
      <p style={{ color: '#333', fontSize: '14px', marginBottom: '0' }}>
        <strong>Invited by:</strong> {inviterName}
      </p>
    </div>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '30px' }}>
      Click the button below to accept the invitation and join the team:
    </p>
    <a
      href={invitationUrl}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#000',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      Accept Invitation
    </a>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      If you weren't expecting this invitation, you can safely ignore this email.
    </p>
  </div>
);

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export const PasswordResetEmailTemplate: React.FC<PasswordResetEmailProps> = ({
  userName,
  resetUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
      Reset Your Password
    </h1>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      Hi {userName},
    </p>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <a
      href={resetUrl}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#000',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '30px',
      }}
    >
      Reset Password
    </a>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      This link will expire in 1 hour for security reasons.
    </p>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
  </div>
);

interface SubscriptionEmailProps {
  userName: string;
  planName: string;
  dashboardUrl: string;
}

export const SubscriptionConfirmationEmailTemplate: React.FC<SubscriptionEmailProps> = ({
  userName,
  planName,
  dashboardUrl,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
      🎉 Subscription Confirmed!
    </h1>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      Hi {userName},
    </p>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
      Thank you for subscribing to the <strong>{planName}</strong> plan. Your subscription is now active!
    </p>
    <p style={{ color: '#555', fontSize: '16px', lineHeight: '1.5', marginBottom: '30px' }}>
      You now have access to all the premium features included in your plan.
    </p>
    <a
      href={dashboardUrl}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#000',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      Go to Dashboard
    </a>
    <p style={{ color: '#777', fontSize: '14px', marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
      Questions? Contact us at support@yourdomain.com
    </p>
  </div>
);