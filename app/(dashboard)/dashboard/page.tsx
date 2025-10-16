import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/card';
import { StatCard, StatCardGrid } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db/drizzle';
import { cvs, jobPositions, candidates, gmailConnections } from '@/lib/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { FileText, Briefcase, Users, Mail, TrendingUp, CheckCircle2 } from 'lucide-react';

async function getDashboardStats(teamId: number) {
  try {
    // Pobierz liczbę CV
    const cvCount = await db.select({ count: count() })
      .from(cvs)
      .where(eq(cvs.teamId, teamId));

    // Pobierz liczbę UNIKALNYCH kandydatów którzy mają CV w systemie
    // (nie liczy kandydatów których CV zostały usunięte)
    const cvWithCandidates = await db
      .select({ candidateId: cvs.candidateId })
      .from(cvs)
      .where(eq(cvs.teamId, teamId));

    // Zlicz unikalne candidateId (pomijając null)
    const uniqueCandidateIds = new Set(
      cvWithCandidates
        .map(c => c.candidateId)
        .filter(id => id !== null)
    );

    const candidateCount = uniqueCandidateIds.size;

    // Pobierz liczbę aktywnych stanowisk
    const activePositionsCount = await db.select({ count: count() })
      .from(jobPositions)
      .where(and(
        eq(jobPositions.teamId, teamId),
        eq(jobPositions.status, 'active')
      ));

    // Sprawdź status połączenia Gmail
    const gmailConnection = await db.select()
      .from(gmailConnections)
      .where(and(
        eq(gmailConnections.teamId, teamId),
        eq(gmailConnections.isActive, true)
      ))
      .limit(1);

    return {
      cvCount: cvCount[0]?.count || 0,
      candidateCount: candidateCount,
      activePositionsCount: activePositionsCount[0]?.count || 0,
      gmailConnected: gmailConnection.length > 0,
      gmailEmail: gmailConnection[0]?.email || null,
      lastSync: gmailConnection[0]?.lastSyncAt || null
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      cvCount: 0,
      candidateCount: 0,
      activePositionsCount: 0,
      gmailConnected: false,
      gmailEmail: null,
      lastSync: null
    };
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // TODO: Get teamId from user session or context
  // For now, using a placeholder. You'll need to implement proper team context
  const teamId = 1;

  const stats = await getDashboardStats(teamId);

  return (
    <main className="flex-1 p-4 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Przegląd systemu zarządzania CV i rekrutacji
        </p>
      </div>

      <StatCardGrid columns={4}>
        <StatCard
          title="CV w systemie"
          value={stats.cvCount}
          subtitle="Wszystkie CV"
          icon={FileText}
          color="primary"
        />
        <StatCard
          title="Kandydaci"
          value={stats.candidateCount}
          subtitle="W bazie danych"
          icon={Users}
          color="secondary"
        />
        <StatCard
          title="Aktywne stanowiska"
          value={stats.activePositionsCount}
          subtitle="Otwarte rekrutacje"
          icon={Briefcase}
          color="accent"
        />
        <StatCard
          title="Status Gmail"
          value={stats.gmailConnected ? 'Połączony' : 'Nie połączony'}
          subtitle={stats.gmailConnected ? stats.gmailEmail?.substring(0, 25) || '' : 'Skonfiguruj połączenie'}
          icon={stats.gmailConnected ? CheckCircle2 : Mail}
          color={stats.gmailConnected ? 'success' : 'warning'}
        />
      </StatCardGrid>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Szybkie akcje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/cvs">
                <FileText className="mr-2 h-4 w-4" />
                Zarządzaj CV
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/positions/new">
                <Briefcase className="mr-2 h-4 w-4" />
                Dodaj nowe stanowisko
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/positions">
                <Users className="mr-2 h-4 w-4" />
                Przeglądaj stanowiska
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ostatnia aktywność</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  System jest gotowy do pracy
                </span>
              </li>
              {stats.gmailConnected && stats.lastSync && (
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Ostatnia synchronizacja Gmail: {new Date(stats.lastSync).toLocaleDateString('pl-PL')}
                  </span>
                </li>
              )}
              {!stats.gmailConnected && (
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    Połącz konto Gmail aby automatycznie importować CV
                  </span>
                </li>
              )}
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  System CV Research działa poprawnie
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
