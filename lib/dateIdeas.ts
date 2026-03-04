import rawIdeas from '@/data/dateIdeas.json';

export type DateDuration = '30 min' | '1 hr' | '3 hrs';

interface RawIdea {
  coupleType: string;
  duration: string;
  idea: string;
}

const ALL_IDEAS = rawIdeas as RawIdea[];

/**
 * Returns date ideas matching the couple's archetype pair and chosen duration.
 * Order of archetypes doesn't matter — both "A + B" and "B + A" are matched.
 * Returns ideas shuffled so the wheel feels fresh each time.
 */
export function getDateIdeasForCouple(
  p1ArchetypeName: string,
  p2ArchetypeName: string,
  duration: DateDuration
): string[] {
  const combo1 = `${p1ArchetypeName} + ${p2ArchetypeName}`;
  const combo2 = `${p2ArchetypeName} + ${p1ArchetypeName}`;

  const matched = ALL_IDEAS
    .filter(
      (d) =>
        (d.coupleType === combo1 || d.coupleType === combo2) &&
        d.duration === duration
    )
    .map((d) => d.idea);

  // Shuffle so each spin session picks different segments
  return matched.sort(() => Math.random() - 0.5);
}

export const DURATION_LABELS: Record<DateDuration, string> = {
  '30 min':  '30 Minutes',
  '1 hr':    '1 Hour',
  '3 hrs':   '3 Hours',
};

export const DURATION_ICONS: Record<DateDuration, string> = {
  '30 min':  '⚡',
  '1 hr':    '☕',
  '3 hrs':   '🌙',
};

export const DURATION_DESCRIPTIONS: Record<DateDuration, string> = {
  '30 min':  'Quick & sweet — perfect for a busy day',
  '1 hr':    'A proper date with time to connect',
  '3 hrs':   'Deep, memorable, and immersive',
};
