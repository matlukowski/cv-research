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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
    setIsSyncing(true);
    try {
      const response = await fetch('/api/gmail/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxResults: 50 }),
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

      if (data.success) {
        toast({
          title: 'Usunięto wszystkie CV',
          description: `Usunięto ${data.deletedCount} CV i ${data.filesDeleted} plików`,
        });
        setShowDeleteDialog(false);
        fetchSyncStatus();
        fetchCVs();
      } else {
        throw new Error(data.error);
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
              <>
                <Button
                  onClick={handleSyncCVs}
                  disabled={isSyncing}
                  className="gap-2"
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Synchronizuj CV
                </Button>
              </>
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
              </CardDescription>
            </div>
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
