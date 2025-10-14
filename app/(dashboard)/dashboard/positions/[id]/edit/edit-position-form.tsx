'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditPositionFormProps {
  positionId: string;
}

export default function EditPositionForm({ positionId }: EditPositionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    employmentType: 'full-time',
    salaryRange: '',
    status: 'active',
  });

  useEffect(() => {
    fetchPosition();
  }, [positionId]);

  const fetchPosition = async () => {
    try {
      const response = await fetch(`/api/positions/${positionId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.position.title || '',
          description: data.position.description || '',
          requirements: data.position.requirements || '',
          responsibilities: data.position.responsibilities || '',
          location: data.position.location || '',
          employmentType: data.position.employmentType || 'full-time',
          salaryRange: data.position.salaryRange || '',
          status: data.position.status || 'active',
        });
      } else {
        toast({
          title: 'Błąd',
          description: 'Nie udało się pobrać danych stanowiska',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching position:', error);
      toast({
        title: 'Błąd',
        description: 'Wystąpił błąd podczas pobierania danych',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/positions/${positionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Sukces',
          description: 'Stanowisko zostało zaktualizowane',
        });
        router.push('/dashboard/positions');
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
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Szczegóły stanowiska</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tytuł stanowiska *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="np. Senior Full-Stack Developer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis stanowiska *</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Opisz stanowisko..."
              required
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Wymagania *</Label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Wypisz wymagania dla kandydatów..."
              required
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Obowiązki</Label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Opisz obowiązki na stanowisku..."
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lokalizacja</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="np. Warszawa / Remote"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Typ zatrudnienia</Label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
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

          <div className="space-y-2">
            <Label htmlFor="salaryRange">Widełki płacowe</Label>
            <Input
              id="salaryRange"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="np. 10 000 - 15 000 PLN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="active">Aktywne</option>
              <option value="draft">Szkic</option>
              <option value="closed">Zamknięte</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Zapisz zmiany
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
