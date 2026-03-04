// ─── Journey Progress — Supabase CRUD ─────────────────────────────────────────
//
// Required Supabase tables (run these SQL statements in Supabase SQL Editor):
//
// CREATE TABLE power_pair_journey_enrollments (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   couple_id TEXT NOT NULL,
//   journey_id TEXT NOT NULL,
//   started_at TIMESTAMPTZ DEFAULT NOW(),
//   completed_at TIMESTAMPTZ,
//   current_day INTEGER DEFAULT 1,
//   streak INTEGER DEFAULT 0,
//   badge_earned BOOLEAN DEFAULT FALSE,
//   last_completed_date DATE,
//   UNIQUE(couple_id, journey_id)
// );
//
// CREATE TABLE power_pair_journey_days (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   couple_id TEXT NOT NULL,
//   journey_id TEXT NOT NULL,
//   day_number INTEGER NOT NULL,
//   partner1_solo_response TEXT,
//   partner2_solo_response TEXT,
//   partner1_checkboxes JSONB DEFAULT '[]',
//   partner2_checkboxes JSONB DEFAULT '[]',
//   conversation_notes TEXT,
//   day_completed BOOLEAN DEFAULT FALSE,
//   completed_at TIMESTAMPTZ,
//   daily_summary TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE(couple_id, journey_id, day_number)
// );

import { getCheckboxLabelsForDay, getJourneyById } from './journeys';

export interface JourneyEnrollment {
  id: string;
  couple_id: string;
  journey_id: string;
  started_at: string;
  completed_at: string | null;
  current_day: number;
  streak: number;
  badge_earned: boolean;
  last_completed_date: string | null;
}

export interface DayProgress {
  id: string;
  couple_id: string;
  journey_id: string;
  day_number: number;
  partner1_solo_response: string | null;
  partner2_solo_response: string | null;
  partner1_checkboxes: boolean[];
  partner2_checkboxes: boolean[];
  conversation_notes: string | null;
  day_completed: boolean;
  completed_at: string | null;
  daily_summary: string | null;
  created_at: string;
}

async function getSupabase() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  try {
    const { supabase } = await import('./supabase');
    return supabase;
  } catch {
    return null;
  }
}

// ─── Enrollment ────────────────────────────────────────────────────────────────

export async function getEnrollment(
  coupleId: string,
  journeyId: string
): Promise<JourneyEnrollment | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_journey_enrollments')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .maybeSingle();

    if (error) return null;
    return data as JourneyEnrollment | null;
  } catch {
    return null;
  }
}

export async function getAllEnrollments(
  coupleId: string
): Promise<JourneyEnrollment[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('power_pair_journey_enrollments')
      .select('*')
      .eq('couple_id', coupleId);

    if (error) return [];
    return (data ?? []) as JourneyEnrollment[];
  } catch {
    return [];
  }
}

export async function startJourney(
  coupleId: string,
  journeyId: string
): Promise<JourneyEnrollment | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_journey_enrollments')
      .upsert(
        { couple_id: coupleId, journey_id: journeyId, current_day: 1, streak: 0 },
        { onConflict: 'couple_id,journey_id' }
      )
      .select()
      .single();

    if (error) { console.error('[Journey] startJourney error:', error); return null; }
    return data as JourneyEnrollment;
  } catch (e) {
    console.error('[Journey] startJourney exception:', e);
    return null;
  }
}

export async function advanceToNextDay(
  coupleId: string,
  journeyId: string,
  completedDay: number,
  totalDays: number
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  const isComplete = completedDay >= totalDays;
  const today = new Date().toISOString().split('T')[0];

  try {
    // Fetch current streak first
    const { data: current } = await sb
      .from('power_pair_journey_enrollments')
      .select('streak')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .single();

    const newStreak = (current?.streak ?? 0) + 1;

    const { error } = await sb
      .from('power_pair_journey_enrollments')
      .update({
        current_day: Math.min(completedDay + 1, totalDays),
        streak: newStreak,
        last_completed_date: today,
        completed_at: isComplete ? new Date().toISOString() : null,
        badge_earned: isComplete,
      })
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId);

    return !error;
  } catch {
    return false;
  }
}

// ─── Day Progress ──────────────────────────────────────────────────────────────

export async function getDayProgress(
  coupleId: string,
  journeyId: string,
  dayNumber: number
): Promise<DayProgress | null> {
  const sb = await getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('power_pair_journey_days')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber)
      .maybeSingle();

    if (error) return null;
    if (!data) return null;

    return {
      ...data,
      partner1_checkboxes: Array.isArray(data.partner1_checkboxes) ? data.partner1_checkboxes : [],
      partner2_checkboxes: Array.isArray(data.partner2_checkboxes) ? data.partner2_checkboxes : [],
    } as DayProgress;
  } catch {
    return null;
  }
}

export async function getAllDayProgressForJourney(
  coupleId: string,
  journeyId: string
): Promise<DayProgress[]> {
  const sb = await getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from('power_pair_journey_days')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .order('day_number', { ascending: true });

    if (error) return [];
    return ((data ?? []) as DayProgress[]).map((d) => ({
      ...d,
      partner1_checkboxes: Array.isArray(d.partner1_checkboxes) ? d.partner1_checkboxes : [],
      partner2_checkboxes: Array.isArray(d.partner2_checkboxes) ? d.partner2_checkboxes : [],
    }));
  } catch {
    return [];
  }
}

export async function saveSoloResponse(
  coupleId: string,
  journeyId: string,
  dayNumber: number,
  isPartner2: boolean,
  responses: string[]
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  const column = isPartner2 ? 'partner2_solo_response' : 'partner1_solo_response';
  const response = JSON.stringify(responses);

  // Also auto-check the first checkbox (solo written) for this partner
  const journey = getJourneyById(journeyId);
  const day = journey?.days.find((d) => d.day === dayNumber);
  const checkboxCount = day ? getCheckboxLabelsForDay(day).length : 2;
  const emptyCheckboxes: boolean[] = Array(checkboxCount).fill(false);
  emptyCheckboxes[0] = true; // first checkbox = "I've written my reflection"

  const checkboxColumn = isPartner2 ? 'partner2_checkboxes' : 'partner1_checkboxes';

  try {
    // Upsert the day record
    const { data: existing } = await sb
      .from('power_pair_journey_days')
      .select('id, partner1_checkboxes, partner2_checkboxes')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber)
      .maybeSingle();

    if (existing) {
      // Update existing record
      const currentCheckboxes: boolean[] = Array.isArray(existing[checkboxColumn])
        ? existing[checkboxColumn]
        : emptyCheckboxes;
      // Ensure at least index 0 is checked
      const updatedCheckboxes = [...currentCheckboxes];
      if (updatedCheckboxes.length === 0) updatedCheckboxes.push(...emptyCheckboxes);
      updatedCheckboxes[0] = true;

      const { error } = await sb
        .from('power_pair_journey_days')
        .update({ [column]: response, [checkboxColumn]: updatedCheckboxes })
        .eq('id', existing.id);
      return !error;
    } else {
      // Insert new record
      const { error } = await sb
        .from('power_pair_journey_days')
        .insert({
          couple_id: coupleId,
          journey_id: journeyId,
          day_number: dayNumber,
          [column]: response,
          [checkboxColumn]: emptyCheckboxes,
        });
      return !error;
    }
  } catch {
    return false;
  }
}

export async function saveCheckboxes(
  coupleId: string,
  journeyId: string,
  dayNumber: number,
  isPartner2: boolean,
  checkboxes: boolean[]
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  const column = isPartner2 ? 'partner2_checkboxes' : 'partner1_checkboxes';

  try {
    const { data: existing } = await sb
      .from('power_pair_journey_days')
      .select('id, partner1_checkboxes, partner2_checkboxes')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber)
      .maybeSingle();

    if (existing) {
      const { error } = await sb
        .from('power_pair_journey_days')
        .update({ [column]: checkboxes })
        .eq('id', existing.id);
      return !error;
    } else {
      const { error } = await sb
        .from('power_pair_journey_days')
        .insert({
          couple_id: coupleId,
          journey_id: journeyId,
          day_number: dayNumber,
          [column]: checkboxes,
        });
      return !error;
    }
  } catch {
    return false;
  }
}

export async function saveConversationNotes(
  coupleId: string,
  journeyId: string,
  dayNumber: number,
  notes: string
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { data: existing } = await sb
      .from('power_pair_journey_days')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber)
      .maybeSingle();

    if (existing) {
      const { error } = await sb
        .from('power_pair_journey_days')
        .update({ conversation_notes: notes })
        .eq('id', existing.id);
      return !error;
    } else {
      const { error } = await sb
        .from('power_pair_journey_days')
        .insert({
          couple_id: coupleId,
          journey_id: journeyId,
          day_number: dayNumber,
          conversation_notes: notes,
        });
      return !error;
    }
  } catch {
    return false;
  }
}

export async function completeDayProgress(
  coupleId: string,
  journeyId: string,
  dayNumber: number,
  summary: string
): Promise<boolean> {
  const sb = await getSupabase();
  if (!sb) return false;

  try {
    const { error } = await sb
      .from('power_pair_journey_days')
      .update({
        day_completed: true,
        completed_at: new Date().toISOString(),
        daily_summary: summary,
      })
      .eq('couple_id', coupleId)
      .eq('journey_id', journeyId)
      .eq('day_number', dayNumber);

    return !error;
  } catch {
    return false;
  }
}

// ─── Day Completion Check ──────────────────────────────────────────────────────

export function checkIfDayComplete(
  progress: DayProgress,
  totalCheckboxes: number
): boolean {
  if (progress.day_completed) return true;

  const p1 = progress.partner1_checkboxes;
  const p2 = progress.partner2_checkboxes;

  if (p1.length < totalCheckboxes || p2.length < totalCheckboxes) return false;

  const p1AllChecked = p1.slice(0, totalCheckboxes).every(Boolean);
  const p2AllChecked = p2.slice(0, totalCheckboxes).every(Boolean);

  return p1AllChecked && p2AllChecked;
}

// ─── Daily Summary Generator ───────────────────────────────────────────────────

export function generateDailySummary(
  dayTitle: string,
  partner1Name: string,
  partner2Name: string,
  partner1Response: string | null,
  partner2Response: string | null
): string {
  const p1 = partner1Name || 'Partner 1';
  const p2 = partner2Name || 'Partner 2';

  if (partner1Response && partner2Response) {
    return `${p1} and ${p2} both shared their reflections on "${dayTitle}". You each took the time to look inward — that's a meaningful act of vulnerability. As you move forward, let these insights open the door to deeper understanding. Notice where your perspectives align, and where they differ; both are valuable guides for your conversation.`;
  }

  return `Day ${dayTitle} is now complete. You've taken another step together on this journey. Keep the momentum going — your next day awaits.`;
}
