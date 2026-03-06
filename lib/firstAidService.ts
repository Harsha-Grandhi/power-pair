import pillsData from '@/lib/first-aid-data/pills.json';
import situationsData from '@/lib/first-aid-data/situations.json';
import recMapData from '@/lib/first-aid-data/recommendation-map.json';
import modifiersData from '@/lib/first-aid-data/personality-modifiers.json';

// ---------- Types ----------

export interface Pill {
  id: string;
  title: string;
  category: string;
  situation: string;
  emotion_tags: string[];
  context_tags: string[];
  trigger_tags: string[];
  primary_need: string;
  secondary_need: string;
  strategy: string;
  intensity: string;
  phase: string;
  why_this_moment_matters: string;
  feelings: string[];
  needs: string[];
  what_to_say: string[];
  what_to_do: string[];
  small_gesture: string;
  what_not_to_do: string[];
  reminder: string;
}

export interface Situation {
  id: string;
  category: string;
  situation: string;
}

interface RecMapEntry {
  situation_id: string;
  recommended_pills: string[];
}

export interface PersonalityModifier {
  tone: string;
  what_to_say_style: string;
  what_to_do_style: string;
}

export interface ResolvedPill extends Pill {
  personalityModifier?: PersonalityModifier;
}

// ---------- Lookup maps (built once) ----------

const pills: Pill[] = pillsData as Pill[];
const situations: Situation[] = situationsData as Situation[];
const recMap: RecMapEntry[] = recMapData as RecMapEntry[];
const modifiers: Record<string, PersonalityModifier> = modifiersData as Record<string, PersonalityModifier>;

const pillMap = new Map<string, Pill>();
for (const p of pills) pillMap.set(p.id, p);

const recMapBySituation = new Map<string, string[]>();
for (const r of recMap) recMapBySituation.set(r.situation_id, r.recommended_pills);

// ---------- Core functions ----------

export function getPillsByCategory(categoryId: string): Pill[] {
  return pills.filter(p => p.category === categoryId);
}

export function getPillById(pillId: string): Pill | undefined {
  return pillMap.get(pillId);
}

export function searchSituations(query: string): Situation[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return [];

  const scored = situations.map(s => {
    const text = s.situation.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) score++;
    }
    return { situation: s, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.situation);
}

export function findClosestSituation(query: string): Situation | null {
  const results = searchSituations(query);
  return results.length > 0 ? results[0] : null;
}

export function getRecommendedPills(situationId: string): Pill[] {
  const pillIds = recMapBySituation.get(situationId);
  if (!pillIds) return [];
  return pillIds.map(id => pillMap.get(id)).filter(Boolean) as Pill[];
}

export function resolvePersonalityModifiers(
  pill: Pill,
  archetypeCode: string | null
): ResolvedPill {
  if (!archetypeCode || !modifiers[archetypeCode]) {
    return { ...pill };
  }
  return { ...pill, personalityModifier: modifiers[archetypeCode] };
}

// ---------- Full search flow ----------

export function searchAndRecommend(
  query: string,
  archetypeCode: string | null
): { situation: Situation | null; pills: ResolvedPill[] } {
  const situation = findClosestSituation(query);
  if (!situation) return { situation: null, pills: [] };

  const recommended = getRecommendedPills(situation.id);
  const resolved = recommended.map(p => resolvePersonalityModifiers(p, archetypeCode));

  return { situation, pills: resolved };
}

// ---------- Sample pills for landing ----------

const SAMPLE_IDS = ['pill_001', 'pill_010', 'pill_025', 'pill_050'];

export function getSamplePills(): Pill[] {
  return SAMPLE_IDS.map(id => pillMap.get(id)).filter(Boolean) as Pill[];
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  for (const p of pills) cats.add(p.category);
  return Array.from(cats);
}
