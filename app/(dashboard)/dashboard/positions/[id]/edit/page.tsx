import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import EditPositionForm from './edit-position-form';

export default async function EditPositionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edytuj stanowisko</h1>
        <p className="text-muted-foreground mt-2">
          Zaktualizuj informacje o stanowisku pracy
        </p>
      </div>

      <Suspense fallback={<div>Ładowanie...</div>}>
        <EditPositionForm positionId={id} />
      </Suspense>
    </div>
  );
}
