'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { fetchCoupleProfiles } from '@/lib/couples';
import { fetchCrimeFileBoth, saveCrimeFileAnswers, CrimeFileAnswers } from '@/lib/crimeFile';
import {
  crimeFileSections,
  TOTAL_QUESTIONS,
  countAnswered,
  countAnsweredInSection,
} from '@/lib/crimeFileQuestions';

type CrimeTab = 'me' | 'partner';

export default function CrimeFileHomePage() {
  const router = useRouter();
  const { state } = useApp();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CrimeTab>('me');

  const [myName, setMyName] = useState('You');
  const [partnerName, setPartnerName] = useState('Partner');
  const [myAnswers, setMyAnswers] = useState<CrimeFileAnswers>({});
  const [partnerAnswers, setPartnerAnswers] = useState<CrimeFileAnswers>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestAnswers = useRef<CrimeFileAnswers>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !state.profile) router.replace('/');
  }, [mounted, state.profile, router]);

  useEffect(() => {
    if (!mounted || !state.coupleId || !state.profile) return;

    const coupleId = state.coupleId;
    const myId = state.profile.id;

    Promise.all([
      fetchCoupleProfiles(coupleId),
      fetchCrimeFileBoth(coupleId),
    ]).then(([{ partner1, partner2, partner1Name }, allAnswers]) => {
      const iAmP1 = partner1?.id === myId;
      const me = iAmP1 ? partner1 : partner2;
      const them = iAmP1 ? partner2 : partner1;
      const meName = iAmP1
        ? (partner1Name ?? me?.introContext.name ?? 'You')
        : (me?.introContext.name ?? 'You');
      const themName = iAmP1
        ? (them?.introContext.name ?? 'Partner')
        : (partner1Name ?? them?.introContext.name ?? 'Partner');

      setMyName(meName);
      setPartnerName(themName);

      const myData = allAnswers[myId] ?? {};
      setMyAnswers(myData);
      latestAnswers.current = myData;

      const themId = them?.id;
      if (themId && allAnswers[themId]) {
        setPartnerAnswers(allAnswers[themId]);
      }

      setLoading(false);
    }).catch(() => setLoading(false));
  }, [mounted, state.coupleId, state.profile]);

  // Auto-save logic
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
    setMyAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      latestAnswers.current = next;
      return next;
    });

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
        if (state.coupleId && state.profile) {
          saveCrimeFileAnswers(state.coupleId, state.profile.id, latestAnswers.current);
        }
      }
    };
  }, [state.coupleId, state.profile]);

  if (!mounted) return null;
  if (!state.profile || !state.coupleId) return null;

  const myCount = countAnswered(myAnswers);
  const partnerCount = countAnswered(partnerAnswers);

  // Partner tab: filter to only sections with answered questions
  const partnerSectionsWithAnswers = crimeFileSections
    .map((section) => ({
      ...section,
      answeredQuestions: section.questions.filter(
        (q) => partnerAnswers[q.id] && partnerAnswers[q.id].trim().length > 0
      ),
    }))
    .filter((s) => s.answeredQuestions.length > 0);

  return (
    <div className="min-h-dvh bg-pp-bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-pp-bg-dark/95 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-pp-text-muted hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="font-display text-lg text-white font-semibold">Partner in Crime File 🕵️</h1>
              <p className="text-[11px] text-pp-text-muted">All the evidence you need to love them right</p>
            </div>
            {activeTab === 'me' && (
              <div className="flex items-center gap-1.5">
                {saveStatus === 'saving' && (
                  <span className="text-[10px] text-pp-text-muted animate-pulse">Saving...</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-[10px] text-emerald-400">Saved ✓</span>
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('me')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'me'
                  ? 'bg-cyan-400 text-pp-bg-dark'
                  : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
              }`}
            >
              {myName} ({myCount}/{TOTAL_QUESTIONS})
            </button>
            <button
              onClick={() => setActiveTab('partner')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'partner'
                  ? 'bg-teal-400 text-pp-bg-dark'
                  : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
              }`}
            >
              {partnerName} ({partnerCount}/{TOTAL_QUESTIONS})
            </button>
          </div>

          {/* Progress bar for active tab */}
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                activeTab === 'me'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400'
                  : 'bg-gradient-to-r from-teal-400 to-cyan-400'
              }`}
              style={{
                width: `${((activeTab === 'me' ? myCount : partnerCount) / TOTAL_QUESTIONS) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        ) : activeTab === 'me' ? (
          /* ── My Tab: All questions, editable ── */
          crimeFileSections.map((section) => {
            const sectionAnswered = countAnsweredInSection(myAnswers, section);
            return (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.emoji}</span>
                  <h2 className="font-display text-base text-white font-semibold">{section.name}</h2>
                  <span className="text-[10px] text-pp-text-muted ml-auto">
                    {sectionAnswered}/{section.questions.length}
                  </span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400/60 transition-all duration-300"
                    style={{ width: `${(sectionAnswered / section.questions.length) * 100}%` }}
                  />
                </div>
                <div className="space-y-2">
                  {section.questions.map((q) => (
                    <div key={q.id} className="rounded-xl border border-white/8 bg-pp-card/40 p-3">
                      <label className="block text-[11px] text-pp-text-muted mb-1.5">{q.label}</label>
                      <input
                        type="text"
                        value={myAnswers[q.id] ?? ''}
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
        ) : (
          /* ── Partner Tab: Only answered questions, read-only ── */
          partnerCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-pp-card border border-teal-400/20 flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl text-white">No answers yet</h3>
                <p className="text-sm text-pp-text-muted">
                  {partnerName} hasn&apos;t filled in any answers yet. Once they do, you&apos;ll see their responses here.
                </p>
              </div>
            </div>
          ) : (
            partnerSectionsWithAnswers.map((section) => (
              <div key={section.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{section.emoji}</span>
                  <h2 className="font-display text-base text-white font-semibold">{section.name}</h2>
                  <span className="text-[10px] text-pp-text-muted ml-auto">
                    {section.answeredQuestions.length} answer{section.answeredQuestions.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-0">
                  {section.answeredQuestions.map((q, i) => (
                    <div key={q.id}>
                      <div className="py-3">
                        <p className="text-[11px] text-pp-text-muted mb-1">{q.label}</p>
                        <p className="text-sm text-white font-medium">{partnerAnswers[q.id]}</p>
                      </div>
                      {i < section.answeredQuestions.length - 1 && (
                        <div className="border-b border-white/6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
