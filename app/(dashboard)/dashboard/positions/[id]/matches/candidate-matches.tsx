'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/button';
import { ScoreBadge } from '@/components/score-badge';
import { MatchQualityBadge } from '@/components/status-badge';
import { EmptyState } from '@/components/empty-state';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Users, Mail, Phone, MapPin, Sparkles, CheckCircle, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExistingMatches();
  }, []);

  const fetchExistingMatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/positions/${positionId}/match`);
      if (response.ok) {
        const data = await response.json();
        if (data.matches.length > 0) {
          setMatches(data.matches);
          setHasSearched(true);
        }
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatch = async () => {
    setIsMatching(true);
    try {
      const response = await fetch(`/api/positions/${positionId}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rematch: hasSearched }),
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches);
        setHasSearched(true);
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

  const getMatchQuality = (score: number): 'excellent' | 'good' | 'medium' | 'low' => {
    if (score >= 86) return 'excellent';
    if (score >= 71) return 'good';
    if (score >= 51) return 'medium';
    return 'low';
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Ładowanie..." />;
  }

  // Initial state or no matches found - show centered button
  if (!hasSearched || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        {!hasSearched ? (
          <EmptyState
            icon={Users}
            title="Znajdź dopasowanych kandydatów"
            description="Nie pobrano jeszcze kandydatów z dostępnych CV. Kliknij przycisk poniżej, aby uruchomić AI i znaleźć najlepiej dopasowanych kandydatów do tego stanowiska."
          />
        ) : (
          <EmptyState
            icon={Users}
            title="Brak dopasowanych kandydatów"
            description="Nie znaleziono kandydatów spełniających wymagania dla tego stanowiska. Spróbuj ponownie lub dodaj więcej CV do systemu."
          />
        )}

        <Button
          onClick={handleMatch}
          disabled={isMatching}
          size="lg"
          className="gap-2"
        >
          {isMatching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Wyszukiwanie kandydatów...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Znajdź kandydatów
            </>
          )}
        </Button>
      </div>
    );
  }

  // Results state - show candidate list
  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dopasowani kandydaci</h2>
          <p className="text-muted-foreground mt-1">
            Znaleziono {matches.length} kandydatów dopasowanych do tego stanowiska
          </p>
        </div>
        <Button
          onClick={handleMatch}
          disabled={isMatching}
          variant="outline"
          className="gap-2"
        >
          {isMatching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Przeliczanie...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Przelicz ponownie
            </>
          )}
        </Button>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        {matches.map((match, index) => {
          const matchQuality = getMatchQuality(match.matchScore);
          return (
            <Card key={match.candidateId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-6">
                    <ScoreBadge
                      score={match.matchScore}
                      size="lg"
                      showLabel={false}
                      animated={true}
                    />
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
                  <MatchQualityBadge quality={matchQuality} score={match.matchScore} />
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
    </div>
  );
}
