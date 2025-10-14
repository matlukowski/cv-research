'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { Badge } from '@/components/badge';
import { Users, Loader2, Mail, Phone, MapPin, Sparkles, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface JobPosition {
  id: number;
  title: string;
  description: string;
}

interface MatchResult {
  candidateId: number;
  candidateName: string;
  matchScore: number;
  aiAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  email?: string;
  phone?: string;
  location?: string;
}

export default function CandidateMatches({ positionId }: { positionId: number }) {
  const [position, setPosition] = useState<JobPosition | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosition();
    fetchExistingMatches();
  }, []);

  const fetchPosition = async () => {
    try {
      const response = await fetch(`/api/positions/${positionId}`);
      if (response.ok) {
        const data = await response.json();
        setPosition(data.position);
      }
    } catch (error) {
      console.error('Error fetching position:', error);
    }
  };

  const fetchExistingMatches = async () => {
    try {
      const response = await fetch(`/api/positions/${positionId}/match`);
      if (response.ok) {
        const data = await response.json();
        if (data.matches.length > 0) {
          setMatches(data.matches);
          setHasResults(true);
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleMatch = async (rematch: boolean = false) => {
    setIsMatching(true);
    try {
      const response = await fetch(`/api/positions/${positionId}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rematch }),
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
        setHasResults(true);
        toast({
          title: 'Matchowanie zakończone',
          description: `Znaleziono ${data.totalMatches} dopasowanych kandydatów`,
        });
      } else {
        throw new Error('Failed to match');
      }
    } catch (error: any) {
      console.error('Error matching:', error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się dopasować kandydatów',
        variant: 'destructive',
      });
    } finally {
      setIsMatching(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Doskonale dopasowany', variant: 'default' as const };
    if (score >= 60) return { text: 'Dobrze dopasowany', variant: 'default' as const };
    if (score >= 40) return { text: 'Średnio dopasowany', variant: 'secondary' as const };
    return { text: 'Słabo dopasowany', variant: 'destructive' as const };
  };

  if (!position) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{position.title}</h1>
          <p className="text-muted-foreground mt-2">
            {hasResults
              ? `Znaleziono ${matches.length} dopasowanych kandydatów`
              : 'Znajdź idealnych kandydatów za pomocą AI'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleMatch(false)}
            disabled={isMatching}
            className="gap-2"
          >
            {isMatching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {hasResults ? 'Odśwież' : 'Znajdź kandydatów'}
          </Button>
          {hasResults && (
            <Button
              onClick={() => handleMatch(true)}
              disabled={isMatching}
              variant="outline"
              className="gap-2"
            >
              Przelicz ponownie
            </Button>
          )}
        </div>
      </div>

      {/* Position Description */}
      <Card>
        <CardHeader>
          <CardTitle>Opis stanowiska</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{position.description}</p>
        </CardContent>
      </Card>

      {/* Matches Results */}
      {matches.length === 0 && hasResults && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Brak dopasowanych kandydatów</h3>
            <p className="text-muted-foreground text-center">
              Nie znaleziono kandydatów spełniających wymagania
            </p>
          </CardContent>
        </Card>
      )}

      {matches.length > 0 && (
        <div className="space-y-4">
          {matches.map((match, index) => {
            const scoreBadge = getScoreBadge(match.matchScore);
            return (
              <Card key={match.candidateId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-16 h-16 rounded-full ${getScoreColor(
                          match.matchScore
                        )}`}
                      >
                        <span className="text-2xl font-bold">
                          {match.matchScore}
                        </span>
                      </div>
                      <div>
                        <CardTitle>
                          #{index + 1} {match.candidateName}
                        </CardTitle>
                        <CardDescription className="mt-1 space-y-1">
                          {match.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {match.email}
                            </div>
                          )}
                          {match.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {match.phone}
                            </div>
                          )}
                          {match.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.location}
                            </div>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Podsumowanie AI</h4>
                    <p className="text-sm text-muted-foreground">{match.summary}</p>
                  </div>

                  {/* Strengths */}
                  {match.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Mocne strony
                      </h4>
                      <ul className="space-y-1">
                        {match.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground ml-6">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {match.weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <X className="h-4 w-4 text-red-600" />
                        Do poprawy
                      </h4>
                      <ul className="space-y-1">
                        {match.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground ml-6">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Detailed Analysis */}
                  <div className="border-t pt-4">
                    <details>
                      <summary className="font-semibold text-sm cursor-pointer hover:text-primary">
                        Szczegółowa analiza AI
                      </summary>
                      <p className="text-sm text-muted-foreground mt-2">
                        {match.aiAnalysis}
                      </p>
                    </details>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/positions">Powrót do listy stanowisk</Link>
        </Button>
      </div>
    </div>
  );
}
