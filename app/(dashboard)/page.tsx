import { redirect } from 'next/navigation';

export default function HomePage() {
  // Przekieruj bezpośrednio do CV Manager
  redirect('/dashboard/cvs');
}
