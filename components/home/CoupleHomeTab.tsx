'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, CoupleCompatibility } from '@/types';
import { fetchCoupleProfiles } from '@/lib/couples';
import { computeCoupleCompatibility } from '@/lib/compatibility';
import LockedReport from '@/components/dashboard/LockedReport';
import { fetchRelationshipStart } from '@/lib/coupleExtra';
import { fetchSpecialDays, daysUntil } from '@/lib/specialDays';
import { getTodayPrompt, fetchStreak, fetchTodayAnswers } from '@/lib/dailyPrompts';
import { fetchChallengesForCouple, Challenge } from '@/lib/challenges';

interface CoupleHomeTabProps {
  coupleId: string;
  currentProfile: UserProfile;
  archetypeName: string;
}

type FetchState = 'loading' | 'waiting' | 'ready';

function daysSince(dateStr: string): number {
  const start = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000);
}

// ── Reusable nav banner ───────────────────────────────────────────────────────
function NavBanner({
  onClick,
  icon,
  label,
  labelColor,
  borderColor,
  gradientFrom,
  gradientTo,
  children,
}: {
  onClick: () => void;
  icon: string;
  label: string;
  labelColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl border ${borderColor} bg-gradient-to-r ${gradientFrom} ${gradientTo}
        p-4 flex items-center gap-3 hover:brightness-110 transition-all duration-200 active:scale-[0.99]`}
    >
      <div className="w-10 h-10 rounded-xl bg-pp-card border border-white/10
        flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] font-semibold tracking-[0.18em] ${labelColor} uppercase`}>
          {label}
        </span>
        {children}
      </div>
      <svg className="w-4 h-4 text-pp-text-muted flex-shrink-0 -rotate-90"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export default function CoupleHomeTab({ coupleId, currentProfile, archetypeName }: CoupleHomeTabProps) {
  const router = useRouter();

  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [partner1, setPartner1] = useState<UserProfile | null>(null);
  const [partner2, setPartner2] = useState<UserProfile | null>(null);
  const [partner1Name, setPartner1Name] = useState<string | null>(null);
  const [compatibility, setCompatibility] = useState<CoupleCompatibility | null>(null);

  // Banner preview data
  const [daysCount, setDaysCount] = useState<number | null>(null);
  const [nextSpecial, setNextSpecial] = useState<{ title: string; daysAway: number } | null>(null);
  const [streak, setStreak] = useState(0);
  const [answeredToday, setAnsweredToday] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    fetchCoupleProfiles(coupleId).then(({ partner1: p1, partner2: p2, partner1Name: name }) => {
      setPartner1(p1);
      setPartner2(p2);
      setPartner1Name(name);
      if (p1 && p2) {
        setCompatibility(computeCoupleCompatibility(p1, p2));
        setFetchState('ready');
      } else {
        setFetchState('waiting');
      }
    });
  }, [coupleId]);

  // Load banner preview data once couple is ready
  useEffect(() => {
    if (fetchState !== 'ready') return;
    const { date } = getTodayPrompt();

    Promise.all([
      fetchRelationshipStart(coupleId),
      fetchSpecialDays(coupleId),
      fetchStreak(coupleId),
      fetchTodayAnswers(coupleId, date),
      fetchChallengesForCouple(coupleId),
    ]).then(([startDate, specialDays, s, todayAnswers, challenges]) => {
      if (startDate) setDaysCount(daysSince(startDate));
      const upcoming = specialDays
        .filter((d) => daysUntil(d.date) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date));
      if (upcoming.length > 0) {
        setNextSpecial({ title: upcoming[0].title, daysAway: daysUntil(upcoming[0].date) });
      }
      setStreak(s);
      setAnsweredToday(todayAnswers.some((a) => a.author_id === currentProfile.id));
      setActiveChallenges(challenges.filter((c) => c.status === 'active'));
    });
  }, [fetchState, coupleId, currentProfile.id]);

  if (fetchState === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (fetchState === 'waiting') {
    return (
      <div className="px-5 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pp-card border border-pp-secondary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🔒</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium tracking-[0.18em] text-pp-accent uppercase">Couple Chemistry</span>
            <p className="text-sm text-white/80 font-medium leading-tight mt-0.5">Waiting for your partner…</p>
            <p className="text-xs text-pp-text-muted mt-0.5">Results unlock once they complete the quiz</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-pp-accent/40 animate-pulse flex-shrink-0" />
        </div>
        <div className="mt-4">
          <LockedReport archetypeName={archetypeName} />
        </div>
      </div>
    );
  }

  if (!compatibility || !partner1 || !partner2) return null;

  const p1Name = partner1Name ?? partner1.introContext.name ?? 'Partner 1';
  const p2Name = partner2.introContext.name ?? 'Partner 2';
  const score = compatibility.overallScore;
  const scoreColor = score >= 80 ? '#34d399' : score >= 60 ? '#F6B17A' : '#7077A1';
  const { prompt } = getTodayPrompt();

  return (
    <div className="px-5 pb-6 space-y-3 pt-3">

      {/* ── Couple Chemistry ─────────────────────────────────────────────── */}
      <NavBanner
        onClick={() => router.push(`/couple/${coupleId}`)}
        icon="💑"
        label="Couple Chemistry"
        labelColor="text-pp-accent"
        borderColor="border-pp-accent/30"
        gradientFrom="from-pp-accent/8"
        gradientTo="to-pp-secondary/8"
      >
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-white/85 font-medium leading-tight truncate">
            {p1Name} &amp; {p2Name}
          </p>
          <span className="text-base font-bold font-display ml-2 flex-shrink-0"
            style={{ color: scoreColor }}>
            {score}%
          </span>
        </div>
      </NavBanner>

      {/* ── Days Together ────────────────────────────────────────────────── */}
      <NavBanner
        onClick={() => router.push('/days-together')}
        icon="❤️"
        label="Days Together"
        labelColor="text-rose-300"
        borderColor="border-rose-400/25"
        gradientFrom="from-rose-400/8"
        gradientTo="to-pp-accent/6"
      >
        {daysCount !== null ? (
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-display text-2xl font-bold text-white leading-none">
              {daysCount.toLocaleString()}
            </span>
            <span className="text-xs text-pp-text-muted">days</span>
          </div>
        ) : (
          <p className="text-sm text-white/50 mt-0.5">Tap to set your start date</p>
        )}
      </NavBanner>

      {/* ── Special Days ─────────────────────────────────────────────────── */}
      <NavBanner
        onClick={() => router.push('/special-days')}
        icon="🗓"
        label="Special Days"
        labelColor="text-purple-300"
        borderColor="border-purple-400/25"
        gradientFrom="from-purple-400/8"
        gradientTo="to-pp-secondary/6"
      >
        {nextSpecial ? (
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-sm text-white/85 font-medium leading-tight truncate">{nextSpecial.title}</p>
            <span className={`text-xs font-semibold ml-2 flex-shrink-0 ${
              nextSpecial.daysAway === 0 ? 'text-emerald-400' :
              nextSpecial.daysAway <= 7 ? 'text-pp-accent' : 'text-white/50'
            }`}>
              {nextSpecial.daysAway === 0 ? 'Today! 🎉' :
               nextSpecial.daysAway === 1 ? 'Tomorrow' :
               `In ${nextSpecial.daysAway}d`}
            </span>
          </div>
        ) : (
          <p className="text-sm text-white/50 mt-0.5">Tap to add upcoming dates</p>
        )}
      </NavBanner>

      {/* ── Daily Prompt ─────────────────────────────────────────────────── */}
      <NavBanner
        onClick={() => router.push('/daily-prompt')}
        icon="💬"
        label="Daily Prompt"
        labelColor="text-pp-accent"
        borderColor="border-pp-accent/25"
        gradientFrom="from-pp-accent/8"
        gradientTo="to-amber-400/6"
      >
        <div className="mt-0.5 space-y-1">
          <p className="text-sm text-white/80 leading-snug line-clamp-2">{prompt}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs">🔥</span>
            <span className="text-xs text-pp-text-muted">{streak}-day streak</span>
            {answeredToday ? (
              <span className="text-[10px] text-emerald-400 font-medium ml-auto">✓ Answered</span>
            ) : (
              <span className="text-[10px] text-pp-accent font-medium ml-auto">Answer now →</span>
            )}
          </div>
        </div>
      </NavBanner>

      {/* ── Challenges ───────────────────────────────────────────────────── */}
      <NavBanner
        onClick={() => router.push('/challenges')}
        icon="⚡"
        label="Challenges"
        labelColor="text-red-400"
        borderColor="border-red-400/25"
        gradientFrom="from-red-400/8"
        gradientTo="to-pp-accent/6"
      >
        {activeChallenges.length > 0 ? (
          <div className="mt-0.5 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-red-400">
                {activeChallenges.length} active {activeChallenges.length === 1 ? 'challenge' : 'challenges'}
              </span>
            </div>
            {activeChallenges.slice(0, 2).map((c) => (
              <p key={c.id} className="text-xs text-white/70 leading-snug truncate">
                · {c.challenge_text}
              </p>
            ))}
            {activeChallenges.length > 2 && (
              <p className="text-[10px] text-pp-text-muted">+{activeChallenges.length - 2} more</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-white/50 mt-0.5">No active challenges — send one!</p>
        )}
      </NavBanner>

    </div>
  );
}
