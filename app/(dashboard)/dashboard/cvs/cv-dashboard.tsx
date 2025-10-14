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
import { Badge } from '@/components/badge';
import { Mail, RefreshCw, FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleProcessCVs = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/cvs/process', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Przetwarzanie zakończone',
          description: `Przetworzono: ${data.processed}, Błędy: ${data.errors}`,
        });
        fetchSyncStatus();
        fetchCVs();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Error processing CVs:', error);
      toast({
        title: 'Błąd przetwarzania',
        description: error.message || 'Nie udało się przetworzyć CV',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string, score?: number) => {
    switch (status) {
      case 'processed':
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Przetworzono {score && `(${score}%)`}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Oczekuje
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Przetwarzanie
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Odrzucono
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Błąd
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
                {syncStatus.pendingCVs > 0 && (
                  <Button
                    onClick={handleProcessCVs}
                    disabled={isProcessing}
                    variant="secondary"
                    className="gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Przetwórz CV z AI ({syncStatus.pendingCVs})
                  </Button>
                )}
              </>
            )}
          </div>

          {syncStatus?.connected && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Wszystkie CV</p>
                <p className="text-2xl font-bold">{syncStatus.totalCVs}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Oczekujące</p>
                <p className="text-2xl font-bold">{syncStatus.pendingCVs}</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Przetworzone</p>
                <p className="text-2xl font-bold">{syncStatus.processedCVs}</p>
              </div>
            </div>
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
          <CardTitle>Lista CV</CardTitle>
          <CardDescription>
            {cvs.length === 0
              ? 'Brak CV. Rozpocznij synchronizację z Gmail.'
              : `Znaleziono ${cvs.length} CV`}
          </CardDescription>
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
                      {getStatusBadge(cv.status, cv.aiValidationScore)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(cv.uploadedAt).toLocaleDateString('pl-PL')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Brak CV do wyświetlenia</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
