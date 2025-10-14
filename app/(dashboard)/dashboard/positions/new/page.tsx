import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import NewPositionForm from './new-position-form';

export default async function NewPositionPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nowe stanowisko</h1>
        <p className="text-muted-foreground mt-2">
          Dodaj nowe stanowisko pracy i znajdź idealnych kandydatów
        </p>
      </div>

      <NewPositionForm />
    </div>
  );
}
