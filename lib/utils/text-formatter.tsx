import React from 'react';

/**
 * Formatuje tekst rozpoznając listy, nagłówki i sekcje
 * Konwertuje plain text na sformatowany JSX
 */
export function formatText(text: string): React.ReactElement {
  if (!text || text.trim() === '') {
    return <div className="text-sm text-muted-foreground italic">Brak danych</div>;
  }

  const lines = text.split('\n');
  const elements: React.ReactElement[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let lineIndex = 0;

  const flushList = () => {
    if (currentList) {
      const ListTag = currentList.type === 'ul' ? 'ul' : 'ol';
      elements.push(
        <ListTag key={`list-${lineIndex}`} className="ml-4 mb-3 space-y-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="text-sm text-muted-foreground leading-relaxed">
              {item}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Pusta linia
    if (trimmedLine === '') {
      flushList();
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Wykrywanie nagłówków (WIELKIE LITERY lub zakończone dwukropkiem)
    const isHeader =
      (trimmedLine === trimmedLine.toUpperCase() &&
       trimmedLine.length > 3 &&
       /^[A-ZĄĆĘŁŃÓŚŹŻ\s]+:?$/.test(trimmedLine)) ||
      (trimmedLine.endsWith(':') && trimmedLine.length < 50);

    if (isHeader) {
      flushList();
      elements.push(
        <h4 key={`header-${i}`} className="font-semibold text-base mt-4 mb-2 text-foreground">
          {trimmedLine}
        </h4>
      );
      continue;
    }

    // Wykrywanie listy punktowanej (-, *, •)
    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      lineIndex = i;
      continue;
    }

    // Wykrywanie listy numerowanej (1., 2., 3.)
    const numberedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberedMatch[1]);
      lineIndex = i;
      continue;
    }

    // Zwykły tekst
    flushList();
    elements.push(
      <p key={`text-${i}`} className="text-sm text-muted-foreground leading-relaxed mb-2">
        {trimmedLine}
      </p>
    );
  }

  // Flush ostatniej listy
  flushList();

  return <div className="space-y-1">{elements}</div>;
}

/**
 * Komponent do wyświetlania sformatowanego tekstu
 */
export function FormattedText({ text }: { text: string | null }) {
  if (!text) {
    return <div className="text-sm text-muted-foreground italic">Brak danych</div>;
  }

  return formatText(text);
}
