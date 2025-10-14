'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { StatusBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Briefcase, MapPin, Users, Trash2, Edit, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/dialog';
import { FormattedText } from '@/lib/utils/text-formatter';

interface JobPosition {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string | null;
  location: string | null;
  employmentType: string | null;
  salaryRange: string | null;
  status: string;
  createdAt: string;
}

export default function PositionsList() {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    employmentType: 'full-time',
    salaryRange: '',
    status: 'active',
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions');
      if (response.ok) {
        const data = await response.json();
        setPositions(data.positions || []);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć to stanowisko?')) {
      return;
    }

    try {
      const response = await fetch(`/api/positions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Sukces',
          description: 'Stanowisko zostało usunięte',
        });
        fetchPositions();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć stanowiska',
        variant: 'destructive',
      });
    }
  };

  const handleCardClick = (position: JobPosition) => {
    setSelectedPosition(position);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, position: JobPosition) => {
    e.stopPropagation();
    setSelectedPosition(position);
    setEditFormData({
      title: position.title || '',
      description: position.description || '',
      requirements: position.requirements || '',
      responsibilities: position.responsibilities || '',
      location: position.location || '',
      employmentType: position.employmentType || 'full-time',
      salaryRange: position.salaryRange || '',
      status: position.status || 'active',
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedPosition) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/positions/${selectedPosition.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        toast({
          title: 'Sukces',
          description: 'Stanowisko zostało zaktualizowane',
        });
        setIsEditDialogOpen(false);
        fetchPositions();
      } else {
        throw new Error('Failed to update position');
      }
    } catch (error) {
      console.error('Error updating position:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować stanowiska',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Ładowanie stanowisk..." />;
  }

  if (positions.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Brak stanowisk"
        description="Rozpocznij od dodania pierwszego stanowiska pracy aby znaleźć idealnych kandydatów"
        action={{
          label: "Dodaj stanowisko",
          onClick: () => router.push('/dashboard/positions/new')
        }}
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {positions.map((position) => (
          <Card
            key={position.id}
            className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(position)}
          >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="line-clamp-2">{position.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  {position.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {position.location}
                    </span>
                  )}
                </CardDescription>
              </div>
              <StatusBadge status={position.status as any} showIcon />
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {position.description}
            </p>
            {position.employmentType && (
              <Badge variant="outline" className="mb-4">
                {position.employmentType}
              </Badge>
            )}
            <div className="flex gap-2 mt-auto">
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/dashboard/positions/${position.id}/matches`);
                }}
              >
                <Users className="h-4 w-4" />
                Kandydaci
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => handleEditClick(e, position)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(position.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>

      {/* Modal podglądu - po kliknięciu na kartę */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedPosition?.title}</DialogTitle>
            <DialogDescription>
              Pełny podgląd stanowiska pracy
            </DialogDescription>
          </DialogHeader>

          {selectedPosition && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedPosition.status as any} showIcon />
                {selectedPosition.employmentType && (
                  <Badge variant="outline">{selectedPosition.employmentType}</Badge>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-base mb-3 text-foreground">Opis stanowiska</h4>
                <FormattedText text={selectedPosition.description} />
              </div>

              <div>
                <h4 className="font-semibold text-base mb-3 text-foreground">Wymagania</h4>
                <FormattedText text={selectedPosition.requirements} />
              </div>

              {selectedPosition.responsibilities && (
                <div>
                  <h4 className="font-semibold text-base mb-3 text-foreground">Obowiązki</h4>
                  <FormattedText text={selectedPosition.responsibilities} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2">
                {selectedPosition.location && (
                  <div>
                    <h4 className="font-semibold mb-2">Lokalizacja</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedPosition.location}
                    </p>
                  </div>
                )}

                {selectedPosition.salaryRange && (
                  <div>
                    <h4 className="font-semibold mb-2">Widełki płacowe</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedPosition.salaryRange}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Zamknij
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (selectedPosition) {
                  router.push(`/dashboard/positions/${selectedPosition.id}/matches`);
                }
              }}
            >
              Zobacz kandydatów
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal edycji - po kliknięciu przycisku edytuj */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj stanowisko</DialogTitle>
            <DialogDescription>
              Wprowadź zmiany w ogłoszeniu o pracę
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tytuł stanowiska *</Label>
              <Input
                id="edit-title"
                name="title"
                value={editFormData.title}
                onChange={handleFormChange}
                placeholder="np. Senior Full-Stack Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Opis stanowiska *</Label>
              <textarea
                id="edit-description"
                name="description"
                value={editFormData.description}
                onChange={handleFormChange}
                placeholder="Opisz stanowisko..."
                required
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requirements">Wymagania *</Label>
              <textarea
                id="edit-requirements"
                name="requirements"
                value={editFormData.requirements}
                onChange={handleFormChange}
                placeholder="Wypisz wymagania dla kandydatów..."
                required
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-responsibilities">Obowiązki</Label>
              <textarea
                id="edit-responsibilities"
                name="responsibilities"
                value={editFormData.responsibilities}
                onChange={handleFormChange}
                placeholder="Opisz obowiązki na stanowisku..."
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Lokalizacja</Label>
                <Input
                  id="edit-location"
                  name="location"
                  value={editFormData.location}
                  onChange={handleFormChange}
                  placeholder="np. Warszawa / Remote"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-employmentType">Typ zatrudnienia</Label>
                <select
                  id="edit-employmentType"
                  name="employmentType"
                  value={editFormData.employmentType}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="full-time">Pełny etat</option>
                  <option value="part-time">Część etatu</option>
                  <option value="contract">Kontrakt</option>
                  <option value="temporary">Tymczasowe</option>
                  <option value="internship">Staż</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salaryRange">Widełki płacowe</Label>
                <Input
                  id="edit-salaryRange"
                  name="salaryRange"
                  value={editFormData.salaryRange}
                  onChange={handleFormChange}
                  placeholder="np. 10 000 - 15 000 PLN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="active">Aktywne</option>
                  <option value="draft">Szkic</option>
                  <option value="closed">Zamknięte</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Anuluj
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving} className="gap-2">
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Zapisz zmiany
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
