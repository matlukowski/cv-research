import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'SaaS Boilerplate - Next.js, Clerk, Stripe',
  description: 'Modern SaaS starter with authentication, payments, and team management. Built with Next.js 15, Clerk, Stripe, and PostgreSQL.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
      >
        <body className="min-h-[100dvh] bg-gray-50">
          <SWRConfig value={{}}>
            {children}
          </SWRConfig>
        </body>
      </html>
    </ClerkProvider>
  );
}
