import { generateMultipleDates, TimeSlot, DateIdea } from '@/services/dateEngine';
import { ARCHETYPES } from '@/lib/archetypes';

export type DateDuration = '30 min' | '1 hr' | '3 hrs';

export type { DateIdea };

const DURATION_TO_SLOT: Record<DateDuration, TimeSlot> = {
  '30 min': '30min',
  '1 hr':   '1hr',
  '3 hrs':  '3hrs',
};

/**
 * Look up an archetype code by name.
 * Falls back to 'EDRS' if not found so the engine still works.
 */
function codeFromName(name: string): string {
  const match = ARCHETYPES.find(
    (a) => a.name.toLowerCase() === name.toLowerCase()
  );
  return match?.code ?? 'EDRS';
}

/**
 * Returns date ideas matching the couple's archetype pair and chosen duration.
 * Accepts archetype NAMES (for backward-compat) or 4-letter CODES.
 * Returns ideas shuffled so the wheel feels fresh each time.
 */
export function getDateIdeasForCouple(
  p1: string,
  p2: string,
  duration: DateDuration
): DateIdea[] {
  // Detect whether we received a code (4 uppercase letters) or a name
  const code1 = p1.length === 4 && /^[A-Z]{4}$/.test(p1) ? p1 : codeFromName(p1);
  const code2 = p2.length === 4 && /^[A-Z]{4}$/.test(p2) ? p2 : codeFromName(p2);
  const slot = DURATION_TO_SLOT[duration];

  return generateMultipleDates(code1, code2, slot);
}

export const DURATION_LABELS: Record<DateDuration, string> = {
  '30 min':  '30 Minutes',
  '1 hr':    '1 Hour',
  '3 hrs':   '3 Hours',
};

export const DURATION_ICONS: Record<DateDuration, string> = {
  '30 min':  '\u26A1',
  '1 hr':    '\u2615',
  '3 hrs':   '\uD83C\uDF19',
};

export const DURATION_DESCRIPTIONS: Record<DateDuration, string> = {
  '30 min':  'Quick & sweet \u2014 perfect for a busy day',
  '1 hr':    'A proper date with time to connect',
  '3 hrs':   'Deep, memorable, and immersive',
};
