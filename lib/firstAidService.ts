import cardsData from '@/lib/first-aid-data/relationship_cards.json';

// ---------- Types ----------

export interface WhatToSay {
  [key: string]: string;
}

export interface Bucket {
  bucket: string;
  bucket_name: string;
  covers: string[];
  why_this_moment_matters: string;
  understanding_feelings: string;
  what_they_need: string;
  what_to_say: WhatToSay;
  what_to_do: string[];
  small_gesture: string;
  what_not_to_do: string[];
  closing_affirmation: string;
}

export interface SituationCard {
  situation_id: number;
  situation: string;
  category: string;
  buckets: Bucket[];
}

// ---------- Data ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cards: SituationCard[] = cardsData as any as SituationCard[];

const cardMap = new Map<number, SituationCard>();
for (const c of cards) cardMap.set(c.situation_id, c);

// ---------- Functions ----------

export function getAllSituations(): SituationCard[] {
  return cards;
}

export function getSituationById(id: number): SituationCard | undefined {
  return cardMap.get(id);
}

export function searchSituations(query: string): SituationCard[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const words = q.split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return [];

  const scored = cards.map(c => {
    const text = (c.situation + ' ' + c.category).toLowerCase();
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) score++;
    }
    return { card: c, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.card);
}

function archetypeToBucket(archetypeCode: string): string {
  return archetypeCode.substring(0, 2).toUpperCase();
}

export function getCardForSituation(
  situationId: number,
  archetypeCode: string | null
): Bucket | null {
  const card = cardMap.get(situationId);
  if (!card) return null;

  if (!archetypeCode) {
    return card.buckets[0];
  }

  const bucketKey = archetypeToBucket(archetypeCode);
  const bucket = card.buckets.find(b => b.bucket === bucketKey);
  return bucket || card.buckets[0];
}

// ---------- Full search flow ----------

export function searchAndGetCard(
  query: string,
  archetypeCode: string | null
): { situation: SituationCard | null; bucket: Bucket | null } {
  const results = searchSituations(query);
  if (results.length === 0) return { situation: null, bucket: null };

  const situation = results[0];
  const bucket = getCardForSituation(situation.situation_id, archetypeCode);
  return { situation, bucket };
}

// ---------- Sample situations for landing ----------

export function getSampleSituations(): SituationCard[] {
  return cards.slice(0, 4);
}
