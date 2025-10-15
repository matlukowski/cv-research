'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { StatusBadge } from '@/components/status-badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { EmptyState } from '@/components/empty-state';
import { StatCard, StatCardGrid } from '@/components/stat-card';
import { Mail, RefreshCw, FileText, Loader2, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SyncStatus {
  connected: boolean;
  email?: string;
  lastSyncAt?: string;
  syncFromDate?: string | null;
  totalCVs: number;
  pendingCVs: number;
  processedCVs: number;
}

interface CV {
  id: number;
  fileName: string;
  emailFrom: string;
  emailSubject: string;
  status: string;
  uploadedAt: string;
  aiValidationScore?: number;
}

export default function CVDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [orphanedCount, setOrphanedCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCleaningOrphaned, setIsCleaningOrphaned] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [syncFromDate, setSyncFromDate] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSyncStatus();
    fetchCVs();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/gmail/sync');
      const data = await response.json();
      setSyncStatus(data.status);

      // Prefill syncFromDate if already set in database
      if (data.status?.syncFromDate) {
        const date = new Date(data.status.syncFromDate);
        setSyncFromDate(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
      }
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const fetchCVs = async () => {
    try {
      const response = await fetch('/api/cvs');
      if (response.ok) {
        const data = await response.json();
        setCvs(data.cvs || []);
        setOrphanedCount(data.orphanedCount || 0);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const handleConnectGmail = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/gmail/connect');
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się połączyć z Gmail',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleSyncCVs = async () => {
    // Validate that syncFromDate is provided
    if (!syncFromDate) {
      toast({
        title: 'Brak daty synchronizacji',
        description: 'Wybierz datę, od której mają być pobierane wiadomości',
        variant: 'destructive',
      });
      return;
    }

    // Validate that date is not in the future
    const selectedDate = new Date(syncFromDate);
    if (selectedDate > new Date()) {
      toast({
        title: 'Nieprawidłowa data',
        description: 'Data synchronizacji nie może być w przyszłości',
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    try {
      const response = await fetch('/api/gmail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxResults: 50,
          syncFromDate: syncFromDate, // Send date in YYYY-MM-DD format
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Synchronizacja zakończona',
          description: `Pobrano ${data.result.newCVs} nowych CV z ${data.result.totalMessages} wiadomości`,
        });
        fetchSyncStatus();
        fetchCVs();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error syncing:', error);
      toast({
        title: 'Błąd synchronizacji',
        description: error.message || 'Nie udało się zsynchronizować CV',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteAllCVs = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/cvs', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        // Server returned an error status
        const errorMessage = data.error || 'Nie udało się usunąć CV';
        const errorDetails = data.details ? `: ${data.details}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
      }

      if (data.success) {
        toast({
          title: 'Usunięto wszystkie CV',
          description: `Usunięto ${data.deletedCount} CV i ${data.filesDeleted} plików`,
        });
        setShowDeleteDialog(false);
        fetchSyncStatus();
        fetchCVs();
      } else {
        throw new Error(data.error || 'Nie udało się usunąć CV');
      }
    } catch (error: any) {
      console.error('Error deleting CVs:', error);
      toast({
        title: 'Błąd usuwania',
        description: error.message || 'Nie udało się usunąć CV',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCleanOrphanedCVs = async () => {
    setIsCleaningOrphaned(true);
    try {
      const response = await fetch('/api/cvs/orphaned', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Nie udało się wyczyścić rekordów';
        const errorDetails = data.details ? `: ${data.details}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
      }

      if (data.success) {
        toast({
          title: 'Wyczyszczono rekordy',
          description: `Usunięto ${data.deletedCount} rekordów CV bez plików`,
        });
        fetchSyncStatus();
        fetchCVs();
      } else {
        throw new Error(data.error || 'Nie udało się wyczyścić rekordów');
      }
    } catch (error: any) {
      console.error('Error cleaning orphaned CVs:', error);
      toast({
        title: 'Błąd czyszczenia',
        description: error.message || 'Nie udało się wyczyścić rekordów',
        variant: 'destructive',
      });
    } finally {
      setIsCleaningOrphaned(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status połączenia Gmail</CardTitle>
          <CardDescription>
            {syncStatus?.connected
              ? `Połączono z: ${syncStatus.email}`
              : 'Nie połączono z Gmail'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {!syncStatus?.connected ? (
              <Button
                onClick={handleConnectGmail}
                disabled={isConnecting}
                className="gap-2"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Połącz z Gmail
              </Button>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <label htmlFor="syncFromDate" className="text-sm font-medium">
                    Synchronizuj wiadomości od daty: <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="syncFromDate"
                    type="date"
                    value={syncFromDate}
                    onChange={(e) => setSyncFromDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                  {!syncFromDate && (
                    <p className="text-sm text-muted-foreground">
                      Wybierz datę początkową, aby zapobiec pobieraniu przestarzałych CV
                    </p>
                  )}
                  {syncFromDate && syncStatus?.syncFromDate && (
                    <p className="text-sm text-muted-foreground">
                      Aktualna data w bazie: {new Date(syncStatus.syncFromDate).toLocaleDateString('pl-PL')}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSyncCVs}
                  disabled={isSyncing || !syncFromDate}
                  className="gap-2 w-fit"
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Synchronizuj CV
                </Button>
              </div>
            )}
          </div>

          {syncStatus?.connected && (
            <StatCardGrid columns={3} className="mt-4">
              <StatCard
                title="Wszystkie CV"
                value={syncStatus.totalCVs}
                color="primary"
              />
              <StatCard
                title="Oczekujące"
                value={syncStatus.pendingCVs}
                color="warning"
              />
              <StatCard
                title="Przetworzone"
                value={syncStatus.processedCVs}
                color="success"
              />
            </StatCardGrid>
          )}

          {syncStatus?.lastSyncAt && (
            <p className="text-sm text-muted-foreground mt-4">
              Ostatnia synchronizacja:{' '}
              {new Date(syncStatus.lastSyncAt).toLocaleString('pl-PL')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* CVs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista CV</CardTitle>
              <CardDescription>
                {cvs.length === 0
                  ? 'Brak CV. Rozpocznij synchronizację z Gmail.'
                  : `Znaleziono ${cvs.length} CV`}
                {orphanedCount > 0 && (
                  <span className="text-warning ml-2">
                    ({orphanedCount} rekordów bez plików)
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {orphanedCount > 0 && (
                <Button
                  onClick={handleCleanOrphanedCVs}
                  variant="outline"
                  size="sm"
                  disabled={isCleaningOrphaned}
                  className="gap-2"
                >
                  {isCleaningOrphaned ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Wyczyść rekordy ({orphanedCount})
                </Button>
              )}
              {cvs.length > 0 && (
                <Button
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Usuń wszystkie
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {cvs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa pliku</TableHead>
                  <TableHead>Od</TableHead>
                  <TableHead>Temat</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cvs.map((cv) => (
                  <TableRow key={cv.id}>
                    <TableCell className="font-medium">{cv.fileName}</TableCell>
                    <TableCell className="text-sm">{cv.emailFrom}</TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {cv.emailSubject}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={cv.status as any} showIcon />
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(cv.uploadedAt).toLocaleDateString('pl-PL')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          window.open(`/api/cvs/${cv.id}/download`, '_blank');
                        }}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={FileText}
              title="Brak CV"
              description="Rozpocznij synchronizację z Gmail aby automatycznie pobrać CV z wiadomości"
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usunąć wszystkie CV?</DialogTitle>
            <DialogDescription>
              Ta akcja nie może być cofnięta. Zostaną usunięte wszystkie CV ({cvs.length}) wraz z plikami z dysku.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Anuluj
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllCVs}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Usuwanie...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Usuń wszystkie
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
