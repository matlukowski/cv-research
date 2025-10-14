import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CVDashboard from './cv-dashboard';

export default async function CVsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CV Manager</h1>
        <p className="text-muted-foreground mt-2">
          Zarządzaj CV kandydatów z automatyczną synchronizacją z Gmail
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CVDashboard />
      </Suspense>
    </div>
  );
}
