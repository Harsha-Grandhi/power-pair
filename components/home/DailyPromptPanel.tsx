'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import {
  getTodayPrompt,
  fetchTodayAnswers,
  submitAnswer,
  fetchStreak,
  PromptAnswer,
} from '@/lib/dailyPrompts';

interface Props {
  coupleId: string;
  currentProfile: UserProfile;
}

export default function DailyPromptPanel({ coupleId, currentProfile }: Props) {
  const { prompt, date } = getTodayPrompt();
  const authorId = currentProfile.id;
  const authorName = currentProfile.introContext.name ?? 'You';

  const [answers, setAnswers] = useState<PromptAnswer[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revealPartner, setRevealPartner] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchTodayAnswers(coupleId, date),
      fetchStreak(coupleId),
    ]).then(([ans, s]) => {
      setAnswers(ans);
      setStreak(s);
      setLoading(false);
    });
  }, [coupleId, date]);

  const myAnswer = answers.find((a) => a.author_id === authorId);
  const partnerAnswer = answers.find((a) => a.author_id !== authorId);

  const handleSubmit = async () => {
    if (!text.trim() || submitting || myAnswer) return;
    setSubmitting(true);
    const result = await submitAnswer(coupleId, authorId, authorName, date, text.trim());
    if (result) {
      setAnswers((prev) => [...prev, result]);
      setStreak((s) => s + (s === 0 ? 1 : 0)); // optimistic bump only on first of day
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-1">
      {/* Streak bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{streak}-day streak</p>
            <p className="text-[10px] text-pp-text-muted">Keep answering daily</p>
          </div>
        </div>
        <div className="text-[10px] text-pp-text-muted uppercase tracking-wider">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}
        </div>
      </div>

      {/* Today's prompt card */}
      <div className="rounded-2xl border border-pp-accent/25 bg-pp-accent/6 p-4 space-y-4">
        <div>
          <p className="text-[10px] text-pp-accent uppercase tracking-[0.18em] mb-2">Today's Question</p>
          <p className="text-sm text-white/90 leading-relaxed font-medium">{prompt}</p>
        </div>

        {/* My answer section */}
        {!myAnswer ? (
          <div className="space-y-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your answer…"
              rows={3}
              className="w-full bg-transparent text-sm text-white/85 placeholder:text-pp-text-muted
                resize-none focus:outline-none leading-relaxed border-t border-white/8 pt-3"
            />
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              className="w-full py-2.5 rounded-xl bg-pp-accent text-pp-bg-dark text-sm font-semibold
                disabled:opacity-40 transition-all active:scale-[0.97]"
            >
              {submitting ? 'Submitting…' : 'Submit Answer →'}
            </button>
          </div>
        ) : (
          <div className="border-t border-white/8 pt-3 space-y-1">
            <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">Your answer</p>
            <p className="text-sm text-white/80 leading-relaxed">{myAnswer.answer}</p>
          </div>
        )}
      </div>

      {/* Partner answer section */}
      {myAnswer && (
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
          {partnerAnswer ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">
                  {partnerAnswer.author_name}'s answer
                </p>
                {!revealPartner && (
                  <button
                    onClick={() => setRevealPartner(true)}
                    className="text-xs text-pp-accent hover:text-pp-accent/80 transition-colors font-medium"
                  >
                    Reveal →
                  </button>
                )}
              </div>
              {revealPartner ? (
                <p className="text-sm text-white/80 leading-relaxed">{partnerAnswer.answer}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-3/4 bg-pp-accent/30 rounded-full" />
                  </div>
                  <p className="text-xs text-pp-text-muted">tap to reveal</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pp-accent/50 animate-pulse flex-shrink-0" />
              <p className="text-sm text-pp-text-muted">
                Waiting for your partner to answer… they'll be notified.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hint when not answered yet but partner has */}
      {!myAnswer && partnerAnswer && (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/6 p-3 flex items-center gap-2">
          <span className="text-base">👀</span>
          <p className="text-xs text-emerald-300">
            Your partner already answered! Answer to see what they said.
          </p>
        </div>
      )}
    </div>
  );
}
