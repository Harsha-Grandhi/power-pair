'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, CoupleCompatibility } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { fetchCoupleProfiles, fetchPairingCode, linkByPairingCode } from '@/lib/couples';
import { computeCoupleCompatibility } from '@/lib/compatibility';
import LockedReport from '@/components/dashboard/LockedReport';
import { fetchRelationshipStart } from '@/lib/coupleExtra';
import { fetchSpecialDays, daysUntil } from '@/lib/specialDays';
import { getTodayPrompt, fetchStreak, fetchTodayAnswers } from '@/lib/dailyPrompts';
import { fetchChallengesForCouple, Challenge } from '@/lib/challenges';

// ── localStorage cache helpers ──────────────────────────────────────────────
const COUPLE_CACHE_KEY = 'pp_couple_cache';

interface CoupleCache {
  coupleId: string;
  partner1: UserProfile | null;
  partner2: UserProfile | null;
  partner1Name: string | null;
  bannerData: {
    daysCount: number | null;
    nextSpecial: { title: string; daysAway: number } | null;
    streak: number;
    answeredToday: boolean;
    activeChallenges: { id: string; challenge_text: string; status: string }[];
  } | null;
  cachedAt: number;
}

function loadCoupleCache(coupleId: string): CoupleCache | null {
  try {
    const raw = localStorage.getItem(COUPLE_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as CoupleCache;
    if (cache.coupleId !== coupleId) return null;
    return cache;
  } catch { return null; }
}

function saveCoupleCache(cache: CoupleCache): void {
  try {
    localStorage.setItem(COUPLE_CACHE_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

export function clearCoupleCache(): void {
  try { localStorage.removeItem(COUPLE_CACHE_KEY); } catch { /* ignore */ }
}

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
  const { setCoupleId } = useApp();

  // Try to restore from cache immediately (no network)
  const cached = typeof window !== 'undefined' ? loadCoupleCache(coupleId) : null;
  const hasCachedCouple = !!(cached?.partner1 && cached?.partner2);

  const [fetchState, setFetchState] = useState<FetchState>(hasCachedCouple ? 'ready' : 'loading');
  const [partner1, setPartner1] = useState<UserProfile | null>(cached?.partner1 ?? null);
  const [partner2, setPartner2] = useState<UserProfile | null>(cached?.partner2 ?? null);
  const [partner1Name, setPartner1Name] = useState<string | null>(cached?.partner1Name ?? null);
  const [compatibility, setCompatibility] = useState<CoupleCompatibility | null>(() => {
    if (cached?.partner1 && cached?.partner2) {
      const n1 = cached.partner1Name ?? cached.partner1.introContext.name ?? 'Partner 1';
      const n2 = cached.partner2.introContext.name ?? 'Partner 2';
      return computeCoupleCompatibility(cached.partner1, cached.partner2, n1, n2);
    }
    return null;
  });

  // Banner preview data — restore from cache
  const cb = cached?.bannerData;
  const [daysCount, setDaysCount] = useState<number | null>(cb?.daysCount ?? null);
  const [nextSpecial, setNextSpecial] = useState<{ title: string; daysAway: number } | null>(cb?.nextSpecial ?? null);
  const [streak, setStreak] = useState(cb?.streak ?? 0);
  const [answeredToday, setAnsweredToday] = useState(cb?.answeredToday ?? false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>(
    (cb?.activeChallenges as Challenge[]) ?? []
  );

  // Pairing code state
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [linkCode, setLinkCode] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Fetch couple profiles — from Supabase (background sync if cached)
  useEffect(() => {
    fetchCoupleProfiles(coupleId)
      .then(({ partner1: p1, partner2: p2, partner1Name: name }) => {
        setPartner1(p1);
        setPartner2(p2);
        setPartner1Name(name);
        if (p1 && p2) {
          const n1 = name ?? p1.introContext.name ?? 'Partner 1';
          const n2 = p2.introContext.name ?? 'Partner 2';
          setCompatibility(computeCoupleCompatibility(p1, p2, n1, n2));
          setFetchState('ready');
          // Update cache
          saveCoupleCache({
            coupleId, partner1: p1, partner2: p2, partner1Name: name,
            bannerData: null, cachedAt: Date.now(),
          });
        } else {
          setFetchState('waiting');
        }
      })
      .catch(() => {
        // Only fall to waiting if we have no cached data
        if (!hasCachedCouple) setFetchState('waiting');
      });
  }, [coupleId, hasCachedCouple]);

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
      const newDaysCount = startDate ? daysSince(startDate) : null;
      const upcoming = specialDays
        .filter((d) => daysUntil(d.date) >= 0)
        .sort((a, b) => a.date.localeCompare(b.date));
      const newNextSpecial = upcoming.length > 0
        ? { title: upcoming[0].title, daysAway: daysUntil(upcoming[0].date) }
        : null;
      const newStreak = s;
      const newAnsweredToday = todayAnswers.some((a) => a.author_id === currentProfile.id);
      const newActiveChallenges = challenges.filter((c) => c.status === 'active');

      setDaysCount(newDaysCount);
      if (newNextSpecial) setNextSpecial(newNextSpecial);
      setStreak(newStreak);
      setAnsweredToday(newAnsweredToday);
      setActiveChallenges(newActiveChallenges);

      // Update cache with banner data
      const existing = loadCoupleCache(coupleId);
      if (existing) {
        saveCoupleCache({
          ...existing,
          bannerData: {
            daysCount: newDaysCount,
            nextSpecial: newNextSpecial,
            streak: newStreak,
            answeredToday: newAnsweredToday,
            activeChallenges: newActiveChallenges,
          },
          cachedAt: Date.now(),
        });
      }
    });
  }, [fetchState, coupleId, currentProfile.id]);

  useEffect(() => {
    if (fetchState === 'waiting') {
      fetchPairingCode(coupleId).then(code => setPairingCode(code));
    }
  }, [fetchState, coupleId]);

  const handleLinkPartner = async () => {
    if (!linkCode.trim() || linkLoading) return;
    setLinkError('');
    setLinkLoading(true);
    const { coupleId: newCoupleId, error } = await linkByPairingCode(linkCode.trim(), currentProfile.id, coupleId);
    setLinkLoading(false);
    if (newCoupleId) {
      setCoupleId(newCoupleId);
      setLinkSuccess(true);
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setLinkError(error ?? 'Something went wrong. Please try again.');
    }
  };

  if (fetchState === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (fetchState === 'waiting') {
    return (
      <div className="px-5 py-6 space-y-4">
        {/* Status banner */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pp-card border border-pp-secondary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{'💑'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium tracking-[0.18em] text-pp-accent uppercase">Couple Chemistry</span>
            <p className="text-sm text-white/80 font-medium leading-tight mt-0.5">Connect with your partner</p>
            <p className="text-xs text-pp-text-muted mt-0.5">Share your code or enter theirs to unlock results</p>
          </div>
        </div>

        {/* Your pairing code */}
        {pairingCode && (
          <div className="rounded-2xl border border-pp-accent/25 bg-pp-accent/5 p-4 space-y-3">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Pairing Code</p>
            <div className="flex items-center gap-1.5">
              {pairingCode.split('').map((ch, i) => (
                <span key={i} className="w-9 h-11 rounded-lg bg-pp-card border border-white/15 flex items-center justify-center font-mono text-lg font-bold text-pp-accent">
                  {ch}
                </span>
              ))}
              <button
                onClick={() => {
                  if (navigator.clipboard) navigator.clipboard.writeText(pairingCode);
                }}
                className="ml-auto px-3 py-1.5 rounded-lg border border-pp-accent/30 text-pp-accent text-xs font-medium hover:bg-pp-accent/10 transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-[11px] text-pp-text-muted leading-relaxed">
              Share this code with your partner so they can link their quiz results with yours.
            </p>
          </div>
        )}

        {/* Link partner's code */}
        <div className="rounded-2xl border border-white/10 bg-pp-card/40 p-4 space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Have your partner's code?</p>
          {linkSuccess ? (
            <div className="flex items-center gap-2 py-2">
              <span className="text-lg">{'✅'}</span>
              <p className="text-sm text-emerald-400 font-medium">Linked! Loading your couple results...</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => { setLinkCode(e.target.value.toUpperCase()); setLinkError(''); }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white font-mono tracking-widest text-center placeholder:text-pp-text-muted/40 placeholder:tracking-normal focus:outline-none focus:border-pp-accent/40 transition-colors"
                />
                <button
                  onClick={handleLinkPartner}
                  disabled={linkCode.length < 6 || linkLoading}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    linkCode.length >= 6 && !linkLoading
                      ? 'bg-pp-accent text-pp-bg-dark hover:bg-pp-accent/90'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {linkLoading ? '...' : 'Link'}
                </button>
              </div>
              {linkError && (
                <p className="text-xs text-red-400">{linkError}</p>
              )}
            </>
          )}
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
