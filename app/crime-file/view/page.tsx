'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { fetchCoupleProfiles } from '@/lib/couples';
import { fetchCrimeFileBoth, CrimeFileAnswers } from '@/lib/crimeFile';
import { crimeFileSections } from '@/lib/crimeFileQuestions';

export default function CrimeFileViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-pp-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    }>
      <CrimeFileViewContent />
    </Suspense>
  );
}

function CrimeFileViewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get('target') ?? 'me';
  const { state, authLoading } = useApp();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<CrimeFileAnswers>({});
  const [displayName, setDisplayName] = useState('');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !authLoading && !state.profile) router.replace('/');
  }, [mounted, authLoading, state.profile, router]);

  useEffect(() => {
    if (!mounted || !state.coupleId || !state.profile) return;

    const coupleId = state.coupleId;
    const myId = state.profile.id;

    Promise.all([
      fetchCoupleProfiles(coupleId),
      fetchCrimeFileBoth(coupleId),
    ]).then(([{ partner1, partner2, partner1Name }, allAnswers]) => {
      const isP2 = state.isInvited;

      if (target === 'me') {
        const me = isP2 ? partner2 : partner1;
        const meName = isP2
          ? (me?.introContext.name ?? 'You')
          : (partner1Name ?? me?.introContext.name ?? 'You');
        setDisplayName(meName);
        setAnswers(allAnswers[myId] ?? {});
      } else {
        const them = isP2 ? partner1 : partner2;
        const themName = isP2
          ? (partner1Name ?? them?.introContext.name ?? 'Partner')
          : (them?.introContext.name ?? 'Partner');
        setDisplayName(themName);
        const pIds = Object.keys(allAnswers).filter((id) => id !== myId);
        if (pIds.length > 0) {
          setAnswers(allAnswers[pIds[0]]);
        }
      }

      setLoading(false);
    });
  }, [mounted, state.coupleId, state.profile, state.isInvited, target]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-dvh bg-pp-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!state.profile || !state.coupleId) return null;

  const isMe = target === 'me';
  const headerLabel = isMe ? 'Your file 📋' : `${displayName}'s file`;

  // Filter to only sections with at least one answered question
  const sectionsWithAnswers = crimeFileSections
    .map((section) => ({
      ...section,
      answeredQuestions: section.questions.filter(
        (q) => answers[q.id] && answers[q.id].trim().length > 0
      ),
    }))
    .filter((s) => s.answeredQuestions.length > 0);

  const totalAnswered = sectionsWithAnswers.reduce((sum, s) => sum + s.answeredQuestions.length, 0);

  return (
    <div className="min-h-dvh bg-pp-bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <button onClick={() => router.back()} className="text-pp-text-muted hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-display text-base text-white font-semibold">{headerLabel}</h1>
            <p className="text-[10px] text-pp-text-muted">{totalAnswered} answers</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        ) : totalAnswered === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-pp-card border border-cyan-400/20 flex items-center justify-center">
              <span className="text-3xl">🕵️</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl text-white">No answers yet</h3>
              <p className="text-sm text-pp-text-muted">
                {isMe
                  ? "You haven't filled in any answers yet. Tap below to get started!"
                  : `${displayName} hasn't filled in any answers yet.`}
              </p>
            </div>
            {isMe && (
              <button
                onClick={() => router.push('/crime-file/fill-in')}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 text-pp-bg-dark text-sm font-semibold
                  hover:bg-cyan-300 transition-all active:scale-[0.98]"
              >
                Fill In Your File
              </button>
            )}
          </div>
        ) : (
          <>
            {!isMe && (
              <div className="rounded-xl border border-teal-400/20 bg-teal-400/5 px-4 py-2.5 flex items-center gap-2">
                <span className="text-sm">🔍</span>
                <span className="text-xs text-teal-300 font-medium">{displayName}&apos;s file</span>
              </div>
            )}

            {sectionsWithAnswers.map((section) => (
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
                        <p className="text-sm text-white font-medium">{answers[q.id]}</p>
                      </div>
                      {i < section.answeredQuestions.length - 1 && (
                        <div className="border-b border-white/6" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Floating edit button — only on own file */}
      {isMe && totalAnswered > 0 && (
        <div className="fixed bottom-6 right-4 z-40 max-w-lg">
          <button
            onClick={() => router.push('/crime-file/fill-in')}
            className="w-12 h-12 rounded-full bg-cyan-400 text-pp-bg-dark shadow-lg shadow-cyan-400/20
              flex items-center justify-center hover:bg-cyan-300 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
