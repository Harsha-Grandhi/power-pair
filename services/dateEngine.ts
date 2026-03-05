import { ACTIVITY_LIBRARY, Activity } from '@/data/activityLibrary';
import { EMOTIONAL_LAYERS, EmotionalLayer } from '@/data/emotionalLayers';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ParsedArchetype {
  emotional: 'Expressive' | 'Reflective';
  conflict: 'Direct' | 'Adaptive';
  affection: 'Romantic' | 'Practical';
  rhythm: 'Structured' | 'Spontaneous';
}

export interface CoupleProfile {
  energy: 'expressive' | 'reflective' | 'mixed';
  conflict: 'direct' | 'adaptive' | 'mixed';
  affection: 'romantic' | 'practical' | 'mixed';
  rhythm: 'structured' | 'spontaneous' | 'mixed';
}

export type TimeSlot = '30min' | '1hr' | '3hrs';

// ── Parsing ──────────────────────────────────────────────────────────────────

const POS1: Record<string, 'Expressive' | 'Reflective'> = { E: 'Expressive', R: 'Reflective' };
const POS2: Record<string, 'Direct' | 'Adaptive'> = { D: 'Direct', A: 'Adaptive' };
const POS3: Record<string, 'Romantic' | 'Practical'> = { R: 'Romantic', P: 'Practical' };
const POS4: Record<string, 'Structured' | 'Spontaneous'> = { S: 'Structured', P: 'Spontaneous' };

export function parseArchetype(code: string): ParsedArchetype {
  if (!code || code.length !== 4) {
    throw new Error('Invalid archetype code: "' + code + '". Expected 4-letter code.');
  }
  const c1 = code[0].toUpperCase();
  const c2 = code[1].toUpperCase();
  const c3 = code[2].toUpperCase();
  const c4 = code[3].toUpperCase();

  const emotional = POS1[c1];
  const conflict = POS2[c2];
  const affection = POS3[c3];
  const rhythm = POS4[c4];

  if (!emotional) throw new Error('Invalid emotional letter: "' + c1 + '"');
  if (!conflict) throw new Error('Invalid conflict letter: "' + c2 + '"');
  if (!affection) throw new Error('Invalid affection letter: "' + c3 + '"');
  if (!rhythm) throw new Error('Invalid rhythm letter: "' + c4 + '"');

  return { emotional, conflict, affection, rhythm };
}

// ── Couple Profile ───────────────────────────────────────────────────────────

export function combineCoupleProfile(p1: ParsedArchetype, p2: ParsedArchetype): CoupleProfile {
  return {
    energy:
      p1.emotional === p2.emotional
        ? (p1.emotional.toLowerCase() as 'expressive' | 'reflective')
        : 'mixed',
    conflict:
      p1.conflict === p2.conflict
        ? (p1.conflict.toLowerCase() as 'direct' | 'adaptive')
        : 'mixed',
    affection:
      p1.affection === p2.affection
        ? (p1.affection.toLowerCase() as 'romantic' | 'practical')
        : 'mixed',
    rhythm:
      p1.rhythm === p2.rhythm
        ? (p1.rhythm.toLowerCase() as 'structured' | 'spontaneous')
        : 'mixed',
  };
}

// ── Activity Filtering & Scoring ─────────────────────────────────────────────

export function filterActivities(
  profile: CoupleProfile,
  timeSlot: TimeSlot
): Activity[] {
  const candidates = ACTIVITY_LIBRARY.filter((a) => a.timeSlots.includes(timeSlot));

  const scored = candidates.map((activity) => {
    let score = 0;

    // Energy dimension
    if (profile.energy === 'expressive') {
      score += activity.energy === 'energetic' ? 3 : activity.energy === 'neutral' ? 1 : 0;
    } else if (profile.energy === 'reflective') {
      score += activity.energy === 'calm' ? 3 : activity.energy === 'neutral' ? 1 : 0;
    } else {
      score += 1; // mixed accepts all
    }

    // Rhythm dimension
    if (profile.rhythm === 'structured') {
      score += activity.structure === 'planned' ? 3 : activity.structure === 'neutral' ? 1 : 0;
    } else if (profile.rhythm === 'spontaneous') {
      score += activity.structure === 'spontaneous' ? 3 : activity.structure === 'neutral' ? 1 : 0;
    } else {
      score += 1;
    }

    // Affection dimension
    if (profile.affection === 'romantic') {
      score += activity.affection === 'romantic' ? 3 : activity.affection === 'neutral' ? 1 : 0;
    } else if (profile.affection === 'practical') {
      score += activity.affection === 'supportive' ? 3 : activity.affection === 'neutral' ? 1 : 0;
    } else {
      score += 1;
    }

    return { activity, score };
  });

  // Sort best first, keep all (even score-0 so we always have ideas)
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.activity);
}

// ── Emotional Layer Filtering ────────────────────────────────────────────────

export function filterEmotionalLayers(profile: CoupleProfile): EmotionalLayer[] {
  if (profile.conflict === 'direct') {
    return EMOTIONAL_LAYERS.filter((l) => l.depth === 'deep');
  }
  if (profile.conflict === 'adaptive') {
    return EMOTIONAL_LAYERS.filter((l) => l.depth === 'light');
  }
  // mixed — return both
  return [...EMOTIONAL_LAYERS];
}

// ── Idea Generation ──────────────────────────────────────────────────────────

const TEMPLATES: Array<(a: string, l: string) => string> = [
  (a, l) => a + ' ' + l + '.',
  (a, l) => 'Try ' + a.toLowerCase() + ' ' + l + '.',
  (a, l) => 'Enjoy ' + a.toLowerCase() + ' together ' + l + '.',
  (a, l) => 'Spend time on ' + a.toLowerCase() + ' ' + l + '.',
  (a, l) => 'How about ' + a.toLowerCase() + ' ' + l + '?',
  (a, l) => 'Surprise each other with ' + a.toLowerCase() + ' ' + l + '.',
  (a, l) => 'Make it special \u2014 ' + a.toLowerCase() + ' ' + l + '.',
  (a, l) => 'Plan a moment: ' + a.toLowerCase() + ' ' + l + '.',
  (a, l) => 'Connect over ' + a.toLowerCase() + ' ' + l + '.',
  (a, l) => 'Share the experience of ' + a.toLowerCase() + ' ' + l + '.',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDateIdea(activity: Activity, layer: EmotionalLayer): string {
  const template = pickRandom(TEMPLATES);
  const raw = template(activity.name, layer.text);
  // Capitalize first letter
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// ── Main Entry Points ────────────────────────────────────────────────────────

export function generateMultipleDates(
  code1: string,
  code2: string,
  timeSlot: TimeSlot,
  count = 20
): string[] {
  const p1 = parseArchetype(code1);
  const p2 = parseArchetype(code2);
  const profile = combineCoupleProfile(p1, p2);
  const activities = filterActivities(profile, timeSlot);
  const layers = filterEmotionalLayers(profile);

  if (activities.length === 0 || layers.length === 0) {
    return [];
  }

  const ideas = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 5; // prevent infinite loop

  while (ideas.size < count && attempts < maxAttempts) {
    const activity = pickRandom(activities);
    const layer = pickRandom(layers);
    ideas.add(generateDateIdea(activity, layer));
    attempts++;
  }

  return Array.from(ideas);
}

export function spinDateWheel(
  code1: string,
  code2: string,
  timeSlot: TimeSlot
): string {
  const ideas = generateMultipleDates(code1, code2, timeSlot, 1);
  return ideas[0] ?? "Go for a walk and enjoy each other's company.";
}
