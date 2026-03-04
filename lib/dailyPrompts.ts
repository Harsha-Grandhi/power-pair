// ── Static prompt pool — rotated by day-of-year ──────────────────────────────

const PROMPTS: string[] = [
  "What's something your partner does that always makes you smile?",
  "Describe your perfect day together in three words.",
  "What's a memory from early in your relationship that you treasure?",
  "What's one thing you wish you could do more of together?",
  "What quality in your partner do you admire the most?",
  "What's something new you'd love to try together this year?",
  "When do you feel most loved by your partner?",
  "What's a small thing your partner does that means a lot to you?",
  "What song reminds you of your relationship and why?",
  "What's one thing you've learned about yourself through this relationship?",
  "What's a dream you both share?",
  "What's something your partner has taught you?",
  "If you could relive one moment with your partner, what would it be?",
  "What does home feel like to you?",
  "What's the funniest thing that's happened between you two?",
  "What do you love most about how you two communicate?",
  "What's one way your partner makes your life better every day?",
  "What's a challenge you've overcome together that made you stronger?",
  "Where would your dream trip together be?",
  "What does 'feeling understood' look like to you in a relationship?",
  "What's a goal you're rooting for your partner to achieve?",
  "What makes you feel safe in this relationship?",
  "How do you like to show love, and how do you like to receive it?",
  "What's one thing you want to appreciate more about your partner?",
  "What's the best advice someone has ever given you about relationships?",
  "What's one ritual or habit you'd love to build together?",
  "What's something your partner said that you'll never forget?",
  "What do you look forward to most in your future together?",
  "What's your favourite way to spend a quiet evening together?",
  "What's one thing your partner does that you find endlessly attractive?",
];

export function getTodayPrompt(): { prompt: string; date: string } {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86400000);
  const prompt = PROMPTS[dayOfYear % PROMPTS.length];
  const date = today.toISOString().split('T')[0];
  return { prompt, date };
}

export function getPromptForDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return PROMPTS[dayOfYear % PROMPTS.length];
}

// ── Supabase types + CRUD ────────────────────────────────────────────────────

export interface PromptAnswer {
  id: string;
  couple_id: string;
  prompt_date: string; // YYYY-MM-DD
  author_id: string;
  author_name: string;
  answer: string;
  answered_at: string;
}

async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const { supabase } = await import('./supabase');
  return supabase;
}

/** Fetch all answers for today's prompt for this couple. */
export async function fetchTodayAnswers(coupleId: string, date: string): Promise<PromptAnswer[]> {
  const sb = await getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from('power_pair_prompt_answers')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('prompt_date', date);
    if (error) return [];
    return (data ?? []) as PromptAnswer[];
  } catch {
    return [];
  }
}

export async function submitAnswer(
  coupleId: string,
  authorId: string,
  authorName: string,
  promptDate: string,
  answer: string
): Promise<PromptAnswer | null> {
  const sb = await getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('power_pair_prompt_answers')
      .insert({ couple_id: coupleId, author_id: authorId, author_name: authorName, prompt_date: promptDate, answer })
      .select()
      .single();
    if (error) return null;
    return data as PromptAnswer;
  } catch {
    return null;
  }
}

/** Fetch all answers across all dates for history view. */
export async function fetchAnswersHistory(coupleId: string, limit = 60): Promise<PromptAnswer[]> {
  const sb = await getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from('power_pair_prompt_answers')
      .select('*')
      .eq('couple_id', coupleId)
      .order('prompt_date', { ascending: false })
      .order('answered_at', { ascending: true })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as PromptAnswer[];
  } catch {
    return [];
  }
}

/**
 * Compute streak: number of consecutive days (ending today) where both partners answered.
 * We fetch the last 60 days of answers and check backwards.
 */
export async function fetchStreak(coupleId: string): Promise<number> {
  const sb = await getSupabase();
  if (!sb) return 0;
  try {
    const { data, error } = await sb
      .from('power_pair_prompt_answers')
      .select('author_id, prompt_date')
      .eq('couple_id', coupleId)
      .order('prompt_date', { ascending: false })
      .limit(120); // 60 days × 2 partners max
    if (error || !data) return 0;

    // Group by date → set of author_ids
    const byDate: Record<string, Set<string>> = {};
    for (const row of data as { author_id: string; prompt_date: string }[]) {
      if (!byDate[row.prompt_date]) byDate[row.prompt_date] = new Set();
      byDate[row.prompt_date].add(row.author_id);
    }

    // Walk backwards from today, count days where at least 1 person answered
    // (streak breaks only if nobody answered)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (byDate[key] && byDate[key].size > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  } catch {
    return 0;
  }
}
