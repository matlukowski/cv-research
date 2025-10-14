'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Briefcase, MapPin, Users, Trash2, Edit } from 'lucide-react';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    router.push(`/dashboard/positions/${position.id}/matches`);
  };

  const handleEditClick = (e: React.MouseEvent, position: JobPosition) => {
    e.stopPropagation();
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleEditNavigate = () => {
    if (selectedPosition) {
      router.push(`/dashboard/positions/${selectedPosition.id}/edit`);
    }
  };

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (positions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Brak stanowisk</h3>
          <p className="text-muted-foreground text-center mb-4">
            Rozpocznij od dodania pierwszego stanowiska pracy
          </p>
          <Button asChild>
            <Link href="/dashboard/positions/new">Dodaj stanowisko</Link>
          </Button>
        </CardContent>
      </Card>
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
              <Badge variant={position.status === 'active' ? 'default' : 'secondary'}>
                {position.status === 'active' ? 'Aktywne' : position.status}
              </Badge>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPosition?.title}</DialogTitle>
            <DialogDescription>
              Szczegóły stanowiska pracy
            </DialogDescription>
          </DialogHeader>

          {selectedPosition && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <Badge variant={selectedPosition.status === 'active' ? 'default' : 'secondary'}>
                  {selectedPosition.status === 'active' ? 'Aktywne' : selectedPosition.status}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Opis</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedPosition.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Wymagania</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedPosition.requirements}
                </p>
              </div>

              {selectedPosition.responsibilities && (
                <div>
                  <h4 className="font-semibold mb-2">Obowiązki</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedPosition.responsibilities}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {selectedPosition.location && (
                  <div>
                    <h4 className="font-semibold mb-2">Lokalizacja</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedPosition.location}
                    </p>
                  </div>
                )}

                {selectedPosition.employmentType && (
                  <div>
                    <h4 className="font-semibold mb-2">Typ zatrudnienia</h4>
                    <Badge variant="outline">{selectedPosition.employmentType}</Badge>
                  </div>
                )}
              </div>

              {selectedPosition.salaryRange && (
                <div>
                  <h4 className="font-semibold mb-2">Widełki płacowe</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedPosition.salaryRange}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Zamknij
            </Button>
            <Button onClick={handleEditNavigate}>
              Edytuj stanowisko
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
