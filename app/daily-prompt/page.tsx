'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import DailyPromptPanel from '@/components/home/DailyPromptPanel';
import {
  fetchAnswersHistory,
  getPromptForDate,
  PromptAnswer,
} from '@/lib/dailyPrompts';

type DayGroup = {
  date: string;
  prompt: string;
  answers: PromptAnswer[];
};

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function DailyPromptPage() {
  const router = useRouter();
  const { state } = useApp();
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<DayGroup[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && !state.profile) router.replace('/');
  }, [mounted, state.profile, router]);

  useEffect(() => {
    if (!state.coupleId) return;
    fetchAnswersHistory(state.coupleId).then((answers) => {
      // Group by date, skip today (handled by DailyPromptPanel)
      const today = new Date().toISOString().split('T')[0];
      const byDate: Record<string, PromptAnswer[]> = {};
      for (const a of answers) {
        if (a.prompt_date === today) continue;
        if (!byDate[a.prompt_date]) byDate[a.prompt_date] = [];
        byDate[a.prompt_date].push(a);
      }
      const groups: DayGroup[] = Object.entries(byDate)
        .sort(([a], [b]) => b.localeCompare(a)) // newest first
        .map(([date, ans]) => ({ date, prompt: getPromptForDate(date), answers: ans }));
      setHistory(groups);
      setHistoryLoading(false);
    });
  }, [state.coupleId]);

  if (!mounted || !state.profile || !state.coupleId) return null;

  return (
    <main className="min-h-dvh bg-pp-bg-dark pb-10">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pp-accent/8 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-amber-400/6 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center
              justify-center text-pp-text-muted hover:text-white transition-colors"
          >
            ←
          </button>
          <span className="text-lg">💬</span>
          <span className="font-display text-base text-white font-semibold">Daily Prompt</span>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-5 py-6 space-y-8">
        {/* Today's prompt */}
        <DailyPromptPanel coupleId={state.coupleId} currentProfile={state.profile} />

        {/* History */}
        {!historyLoading && history.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/8" />
              <p className="text-xs text-pp-text-muted uppercase tracking-widest">Previous Prompts</p>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            {history.map((group) => (
              <div
                key={group.date}
                className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-pp-text-muted uppercase tracking-wider">
                    {formatDateLabel(group.date)}
                  </p>
                  <p className="text-[10px] text-pp-text-muted/50">{group.date}</p>
                </div>

                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  {group.prompt}
                </p>

                <div className="space-y-2 pt-1 border-t border-white/6">
                  {group.answers.map((a) => {
                    const isMe = a.author_id === state.profile!.id;
                    return (
                      <div key={a.id} className="space-y-0.5">
                        <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">
                          {isMe ? 'You' : a.author_name}
                        </p>
                        <p className="text-sm text-white/75 leading-relaxed">{a.answer}</p>
                      </div>
                    );
                  })}
                  {group.answers.length < 2 && (
                    <p className="text-xs text-pp-text-muted/50 italic">
                      {group.answers.length === 0
                        ? 'No one answered this day.'
                        : 'Only one partner answered this day.'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!historyLoading && history.length === 0 && (
          <p className="text-center text-sm text-pp-text-muted py-4">
            Previous prompts will appear here after you both answer.
          </p>
        )}
      </div>
    </main>
  );
}
