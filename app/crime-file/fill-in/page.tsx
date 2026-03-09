'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { fetchCrimeFileAnswers, saveCrimeFileAnswers, CrimeFileAnswers } from '@/lib/crimeFile';
import {
  crimeFileSections,
  TOTAL_QUESTIONS,
  countAnswered,
  countAnsweredInSection,
} from '@/lib/crimeFileQuestions';

export default function CrimeFileFillInPage() {
  const router = useRouter();
  const { state, authLoading } = useApp();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<CrimeFileAnswers>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestAnswers = useRef<CrimeFileAnswers>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !authLoading && !state.profile) router.replace('/');
  }, [mounted, authLoading, state.profile, router]);

  useEffect(() => {
    if (!mounted || !state.coupleId || !state.profile) return;
    fetchCrimeFileAnswers(state.coupleId, state.profile.id).then((data) => {
      setAnswers(data);
      latestAnswers.current = data;
      setLoading(false);
    });
  }, [mounted, state.coupleId, state.profile]);

  const doSave = useCallback(async (toSave: CrimeFileAnswers) => {
    if (!state.coupleId || !state.profile) return;
    setSaveStatus('saving');
    const ok = await saveCrimeFileAnswers(state.coupleId, state.profile.id, toSave);
    setSaveStatus(ok ? 'saved' : 'idle');
    if (ok) {
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [state.coupleId, state.profile]);

  const handleChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      latestAnswers.current = next;
      return next;
    });

    // Debounced auto-save
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      doSave(latestAnswers.current);
    }, 800);
  }, [doSave]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        // Fire save synchronously-ish on cleanup
        if (state.coupleId && state.profile) {
          saveCrimeFileAnswers(state.coupleId, state.profile.id, latestAnswers.current);
        }
      }
    };
  }, [state.coupleId, state.profile]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-dvh bg-pp-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!state.profile || !state.coupleId) return null;

  const totalAnswered = countAnswered(answers);

  return (
    <div className="min-h-dvh bg-pp-bg-dark">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-pp-bg-dark/95 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3 space-y-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-pp-text-muted hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="font-display text-base text-white font-semibold">Fill In Your File</h1>
              <p className="text-[10px] text-pp-text-muted">{totalAnswered}/{TOTAL_QUESTIONS} answered</p>
            </div>
            <div className="flex items-center gap-1.5">
              {saveStatus === 'saving' && (
                <span className="text-[10px] text-pp-text-muted animate-pulse">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-[10px] text-emerald-400">Saved ✓</span>
              )}
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300"
              style={{ width: `${(totalAnswered / TOTAL_QUESTIONS) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          crimeFileSections.map((section) => {
            const sectionAnswered = countAnsweredInSection(answers, section);
            return (
              <div key={section.id} className="space-y-3">
                {/* Section header */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.emoji}</span>
                  <h2 className="font-display text-base text-white font-semibold">{section.name}</h2>
                  <span className="text-[10px] text-pp-text-muted ml-auto">
                    {sectionAnswered}/{section.questions.length}
                  </span>
                </div>
                {/* Section progress */}
                <div className="w-full h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400/60 transition-all duration-300"
                    style={{ width: `${(sectionAnswered / section.questions.length) * 100}%` }}
                  />
                </div>
                {/* Questions */}
                <div className="space-y-2">
                  {section.questions.map((q) => (
                    <div key={q.id} className="rounded-xl border border-white/8 bg-pp-card/40 p-3">
                      <label className="block text-[11px] text-pp-text-muted mb-1.5">{q.label}</label>
                      <input
                        type="text"
                        value={answers[q.id] ?? ''}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        placeholder="Tap to answer..."
                        className="w-full bg-transparent text-sm text-white placeholder:text-white/20
                          focus:outline-none border-b border-transparent focus:border-cyan-400/40 pb-1 transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
