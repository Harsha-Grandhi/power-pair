'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { fetchCoupleProfiles } from '@/lib/couples';
import { fetchCrimeFileBoth, CrimeFileAnswers } from '@/lib/crimeFile';
import { countAnswered, TOTAL_QUESTIONS } from '@/lib/crimeFileQuestions';

export default function CrimeFileHomePage() {
  const router = useRouter();
  const { state } = useApp();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [myName, setMyName] = useState('You');
  const [partnerName, setPartnerName] = useState('Partner');
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [myCount, setMyCount] = useState(0);
  const [partnerCount, setPartnerCount] = useState(0);

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
      // Determine me vs partner by matching profile IDs — not isInvited flag
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
      if (them) setPartnerId(them.id);

      // Match answer counts by profile ID
      setMyCount(countAnswered(allAnswers[myId] ?? {}));
      const themId = them?.id;
      if (themId && allAnswers[themId]) {
        setPartnerCount(countAnswered(allAnswers[themId]));
      }

      setLoading(false);
    }).catch(() => setLoading(false));
  }, [mounted, state.coupleId, state.profile]);

  if (!mounted) return null;

  if (!state.profile || !state.coupleId) return null;

  const totalBoth = TOTAL_QUESTIONS * 2;
  const combinedCount = myCount + partnerCount;
  const combinedPct = Math.round((combinedCount / totalBoth) * 100);

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
          <div>
            <h1 className="font-display text-lg text-white font-semibold">Partner in Crime File 🕵️</h1>
            <p className="text-[11px] text-pp-text-muted">All the evidence you need to love them right</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">
        {/* Overall progress */}
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/8 to-teal-400/6 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">Combined Progress</span>
            <span className="text-sm font-bold text-cyan-300">{combinedPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500"
              style={{ width: `${combinedPct}%` }}
            />
          </div>
          <p className="text-xs text-pp-text-muted">{combinedCount} of {totalBoth} questions answered between both of you</p>
        </div>

        {/* Profile cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* My card */}
          <div className="rounded-2xl border border-cyan-400/20 bg-pp-card/60 p-4 space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border-2 border-cyan-400/30 flex items-center justify-center">
                <span className="text-2xl">🕵️</span>
              </div>
              <p className="text-sm font-semibold text-white text-center truncate w-full">{myName}</p>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-pp-text-muted">Progress</span>
                <span className="text-[10px] font-semibold text-cyan-300">{myCount}/{TOTAL_QUESTIONS}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${(myCount / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => router.push('/crime-file/fill-in')}
                className="w-full py-2 rounded-xl bg-cyan-400 text-pp-bg-dark text-xs font-semibold
                  hover:bg-cyan-300 transition-all active:scale-[0.98]"
              >
                Fill In
              </button>
              <button
                onClick={() => router.push(`/crime-file/view?target=me`)}
                className="w-full py-2 rounded-xl border border-white/10 text-white/70 text-xs font-medium
                  hover:border-white/20 hover:text-white transition-all active:scale-[0.98]"
              >
                View File
              </button>
            </div>
          </div>

          {/* Partner card */}
          <div className="rounded-2xl border border-teal-400/20 bg-pp-card/60 p-4 space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-400/20 border-2 border-teal-400/30 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-sm font-semibold text-white text-center truncate w-full">{partnerName}</p>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-pp-text-muted">Progress</span>
                <span className="text-[10px] font-semibold text-teal-300">{partnerCount}/{TOTAL_QUESTIONS}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-400 transition-all duration-500"
                  style={{ width: `${(partnerCount / TOTAL_QUESTIONS) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/crime-file/view?target=partner`)}
                className="w-full py-2 rounded-xl border border-teal-400/40 text-teal-300 text-xs font-semibold
                  hover:bg-teal-400/10 transition-all active:scale-[0.98]"
              >
                View File
              </button>
              {partnerCount === 0 && (
                <p className="text-[10px] text-pp-text-muted text-center">Waiting for {partnerName} to fill in...</p>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
