import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import PositionsList from './positions-list';

export default async function PositionsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stanowiska pracy</h1>
          <p className="text-muted-foreground mt-2">
            Zarządzaj ogłoszeniami i znajdź idealnych kandydatów
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/positions/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Dodaj stanowisko
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PositionsList />
      </Suspense>
    </div>
  );
}
