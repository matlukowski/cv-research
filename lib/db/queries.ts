import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, teamMembers, teams, users } from './schema';
import { auth } from '@clerk/nextjs/server';

// Ensure there is a DB user for the current Clerk user. If not, create one
// and return it. This bridges Clerk auth with your existing DB schema.
export async function getUser() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  // Best-effort extraction of email/name from session claims; fall back to synthetic email
  const claimedEmail = (sessionClaims as any)?.email as string | undefined;
  const name = ((sessionClaims as any)?.name as string | undefined) || undefined;
  const email = claimedEmail || `user-${userId}@clerk.local`;

  // Try to find a matching user by email and not soft-deleted
  const found = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (found.length > 0) {
    return found[0];
  }

  // Create a minimal user record compatible with the current schema
  const [created] = await db
    .insert(users)
    .values({ email, name, passwordHash: 'clerk', role: 'owner' })
    .returning();

  return created ?? null;
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) return null;

  // Does the user already belong to a team?
  const existing = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: { id: true, name: true, email: true }
              }
            }
          }
        }
      }
    }
  });

  if (existing?.team) return existing.team;

  // Create a default team and add the user as owner
  const [createdTeam] = await db
    .insert(teams)
    .values({ name: `${user.email}'s Team` })
    .returning();

  await db.insert(teamMembers).values({
    teamId: createdTeam.id,
    userId: user.id,
    role: 'owner'
  });

  return createdTeam;
}
