'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/button';
import { CircleIcon, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, useUser, useClerk } from '@clerk/nextjs';

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Pricing
        </Link>
        <Link href="/sign-up">
          <Button variant="outline" className="rounded-full text-sm">
            Sign Up
          </Button>
        </Link>
        <SignInButton mode="redirect" afterSignInUrl="/dashboard" asChild>
          <Button variant="ghost" className="rounded-full">Sign in</Button>
        </SignInButton>
      </>
    );
  }

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
          <AvatarFallback>
            {(user.fullName || user.primaryEmailAddress?.emailAddress || 'U')
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="flex flex-col gap-1">
        <DropdownMenuItem className="cursor-pointer">
          <Link href="/dashboard" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="w-full flex-1 cursor-pointer"
          onClick={() => {
            signOut({ redirectUrl: '/' });
          }}
        >
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">Your SaaS</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
