import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { SWRConfig } from 'swr';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/lib/theme-provider';

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
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const resolvedTheme = theme === 'system' ? systemTheme : theme;
                  document.documentElement.classList.add(resolvedTheme);
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className="min-h-[100dvh] bg-background text-foreground">
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <SWRConfig value={{}}>
              {children}
            </SWRConfig>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
