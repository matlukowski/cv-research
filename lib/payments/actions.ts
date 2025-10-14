'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { getTeamForUser } from '@/lib/db/queries';
import { auth } from '@clerk/nextjs/server';

export const checkoutAction = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const team = await getTeamForUser();
  const priceId = formData.get('priceId') as string;
  if (!priceId) return;
  await createCheckoutSession({ team, priceId });
};

export const customerPortalAction = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const team = await getTeamForUser();
  if (!team) redirect('/pricing');
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
};
