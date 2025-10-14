import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CandidateMatches from './candidate-matches';

export default async function MatchesPage({
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
      <Suspense fallback={<div>Loading...</div>}>
        <CandidateMatches positionId={parseInt(id)} />
      </Suspense>
    </div>
  );
}
