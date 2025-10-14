import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'AI CV Match - AI-Powered Applicant Tracking System',
  description: 'Inteligentny system ATS z automatyczną analizą CV przez AI i dopasowaniem kandydatów do stanowisk. Zbieraj CV z Gmail, analizuj przez GPT i znajdź idealnych kandydatów.'
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
        className={manrope.className}
      >
        <body className="min-h-[100dvh] bg-background text-foreground">
          <SWRConfig value={{}}>
            {children}
          </SWRConfig>
        </body>
      </html>
    </ClerkProvider>
  );
}
