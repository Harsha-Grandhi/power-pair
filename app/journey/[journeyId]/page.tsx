'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { getJourneyById, JourneyDay, Journey } from '@/lib/journeys';
import {
  JourneyEnrollment,
  DayProgress,
  getEnrollment,
  getAllDayProgressForJourney,
  startJourney,
  getDayProgress,
  saveSoloResponse,
  saveCheckboxes,
  saveConversationNotes,
  completeDayProgress,
  advanceToNextDay,
  generateDailySummary,
} from '@/lib/journeyProgress';
import DayView from '@/components/journeys/DayView';
import { fetchCoupleProfiles } from '@/lib/couples';

export default function JourneyPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useApp();
  const journeyId = params.journeyId as string;

  const journey = getJourneyById(journeyId);

  const [mounted, setMounted] = useState(false);
  const [enrollment, setEnrollment] = useState<JourneyEnrollment | null>(null);
  const [dayProgressMap, setDayProgressMap] = useState<Map<number, DayProgress>>(new Map());
  const [activeDay, setActiveDay] = useState<number>(1);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState('');
  const notesTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const coupleId = state.coupleId;
  const isPartner2 = state.isInvited;
  const myName = state.profile?.introContext.name ?? '';

  // Fetch partner name
  useEffect(() => {
    if (!coupleId) return;
    fetchCoupleProfiles(coupleId).then(({ partner1, partner2 }) => {
      const partner = isPartner2 ? partner1 : partner2;
      if (partner) setPartnerName(partner.introContext.name ?? '');
    });
  }, [coupleId, isPartner2]);

  // Load enrollment + day progress
  useEffect(() => {
    if (!mounted || !coupleId || !journeyId) {
      setLoading(false);
      return;
    }

    Promise.all([
      getEnrollment(coupleId, journeyId),
      getAllDayProgressForJourney(coupleId, journeyId),
    ]).then(([enroll, days]) => {
      setEnrollment(enroll);
      const map = new Map<number, DayProgress>();
      days.forEach((d) => map.set(d.day_number, d));
      setDayProgressMap(map);

      if (enroll) {
        setActiveDay(enroll.current_day);
      }
      setLoading(false);
    });
  }, [mounted, coupleId, journeyId]);

  // Refresh day progress when activeDay changes
  const refreshDay = useCallback(async (dayNum: number) => {
    if (!coupleId) return;
    const fresh = await getDayProgress(coupleId, journeyId, dayNum);
    if (fresh) {
      setDayProgressMap((prev) => {
        const next = new Map(prev);
        next.set(dayNum, fresh);
        return next;
      });
    }
  }, [coupleId, journeyId]);

  const handleStart = useCallback(async () => {
    if (!coupleId || isStarting) return;
    setIsStarting(true);
    const enroll = await startJourney(coupleId, journeyId);
    if (enroll) {
      setEnrollment(enroll);
      setActiveDay(1);
    }
    setIsStarting(false);
  }, [coupleId, journeyId, isStarting]);

  const handleSoloSubmit = useCallback(async (response: string) => {
    if (!coupleId) return;
    await saveSoloResponse(coupleId, journeyId, activeDay, isPartner2, response);
    await refreshDay(activeDay);
  }, [coupleId, journeyId, activeDay, isPartner2, refreshDay]);

  const handleCheckboxChange = useCallback(async (checkboxes: boolean[]) => {
    if (!coupleId) return;
    await saveCheckboxes(coupleId, journeyId, activeDay, isPartner2, checkboxes);
    await refreshDay(activeDay);
  }, [coupleId, journeyId, activeDay, isPartner2, refreshDay]);

  const handleNotesChange = useCallback((notes: string) => {
    // Debounced save
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(async () => {
      if (coupleId) {
        await saveConversationNotes(coupleId, journeyId, activeDay, notes);
      }
    }, 1000);
  }, [coupleId, journeyId, activeDay]);

  const handleNotesBlur = useCallback(async (notes: string) => {
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    if (coupleId) {
      await saveConversationNotes(coupleId, journeyId, activeDay, notes);
    }
  }, [coupleId, journeyId, activeDay]);

  const handleMarkComplete = useCallback(async () => {
    if (!coupleId || !journey || isCompleting) return;
    setIsCompleting(true);

    const day = journey.days.find((d) => d.day === activeDay);
    const progress = dayProgressMap.get(activeDay) ?? null;

    if (!day) { setIsCompleting(false); return; }

    const summary = generateDailySummary(
      day.title,
      myName,
      partnerName,
      isPartner2 ? progress?.partner2_solo_response ?? null : progress?.partner1_solo_response ?? null,
      isPartner2 ? progress?.partner1_solo_response ?? null : progress?.partner2_solo_response ?? null,
    );

    await completeDayProgress(coupleId, journeyId, activeDay, summary);
    await advanceToNextDay(coupleId, journeyId, activeDay, journey.duration);

    // Refresh everything
    const [enroll, allDays] = await Promise.all([
      getEnrollment(coupleId, journeyId),
      getAllDayProgressForJourney(coupleId, journeyId),
    ]);

    if (enroll) setEnrollment(enroll);
    const map = new Map<number, DayProgress>();
    allDays.forEach((d) => map.set(d.day_number, d));
    setDayProgressMap(map);

    // If not last day, advance to next
    if (activeDay < journey.duration) {
      setActiveDay(activeDay + 1);
    }

    setIsCompleting(false);
  }, [coupleId, journey, journeyId, activeDay, isCompleting, dayProgressMap, myName, partnerName, isPartner2]);

  if (!mounted || !state.profile) return null;
  if (!journey) {
    return (
      <div className="min-h-dvh bg-pp-bg-dark flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <p className="text-white/60">Journey not found</p>
          <button onClick={() => router.back()} className="text-pp-accent text-sm underline">Go back</button>
        </div>
      </div>
    );
  }

  const activeDayData = journey.days.find((d) => d.day === activeDay);
  const activeDayProgress = dayProgressMap.get(activeDay) ?? null;
  const currentEnrolledDay = enrollment?.current_day ?? 1;
  const isJourneyComplete = enrollment?.badge_earned ?? false;

  return (
    <div className="min-h-dvh bg-pp-bg-dark pb-10">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ backgroundColor: journey.badge.color }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center
              text-white/60 hover:text-white hover:bg-white/12 transition-colors flex-shrink-0"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-pp-text-muted uppercase tracking-widest">Journey {journey.number}</p>
            <h1 className="text-sm font-semibold text-white truncate">{journey.title}</h1>
          </div>
          {enrollment && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {enrollment.streak > 0 && (
                <span className="text-xs text-amber-400 font-medium">🔥 {enrollment.streak}</span>
              )}
              {isJourneyComplete && (
                <span className="text-base" title={journey.badge.label}>🏅</span>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto w-full px-5 pt-5 space-y-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            {/* Journey Summary */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border flex-shrink-0"
                  style={{ background: `${journey.badge.color}12`, borderColor: `${journey.badge.color}30` }}
                >
                  {isJourneyComplete ? '🏅' : journey.badge.emoji}
                </div>
                <div>
                  <h2 className="font-display text-lg text-white font-semibold leading-snug">
                    {journey.title}
                  </h2>
                  <p className="text-xs text-pp-text-muted">{journey.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-white/65 leading-relaxed">{journey.description}</p>
              <div className="flex items-center gap-3 text-xs text-pp-text-muted">
                <span>{journey.duration} days</span>
                <span className="text-white/20">·</span>
                <span>{journey.difficulty}</span>
                <span className="text-white/20">·</span>
                <span>{journey.category}</span>
              </div>
            </div>

            {/* Not started */}
            {!enrollment && (
              <div className="space-y-3">
                {!coupleId && (
                  <div className="rounded-2xl border border-amber-400/25 bg-amber-400/6 p-4">
                    <p className="text-sm text-amber-300/80 leading-relaxed">
                      Connect with your partner first to start this journey and track shared progress.
                    </p>
                  </div>
                )}
                <button
                  onClick={handleStart}
                  disabled={isStarting || !coupleId}
                  className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.98]
                    disabled:opacity-50 disabled:cursor-not-allowed text-pp-bg-dark"
                  style={{ backgroundColor: journey.badge.color }}
                >
                  {isStarting ? 'Starting…' : `Begin Journey`}
                </button>
              </div>
            )}

            {/* Completed badge */}
            {isJourneyComplete && (
              <div
                className="rounded-2xl p-5 text-center space-y-2 border"
                style={{ background: `${journey.badge.color}10`, borderColor: `${journey.badge.color}30` }}
              >
                <p className="text-3xl">🏅</p>
                <p className="font-display text-lg text-white">{journey.badge.label}</p>
                <p className="text-sm text-pp-text-muted">
                  You and {partnerName || 'your partner'} completed this journey together.
                </p>
                <p className="text-xs text-pp-text-muted">
                  {enrollment?.streak} days · Badge earned
                </p>
              </div>
            )}

            {/* Day Map */}
            {enrollment && (
              <div className="space-y-2">
                <p className="text-xs text-pp-text-muted uppercase tracking-widest">Day Map</p>
                <div className="flex items-center gap-0 overflow-x-auto pb-1 -mx-1 px-1">
                  {journey.days.map((d, idx) => {
                    const progress = dayProgressMap.get(d.day);
                    const isCompleted = progress?.day_completed ?? false;
                    const isCurrent = d.day === currentEnrolledDay && !isJourneyComplete;
                    const isLocked = d.day > currentEnrolledDay && !isJourneyComplete;
                    const isActive = d.day === activeDay;

                    return (
                      <React.Fragment key={d.day}>
                        <button
                          onClick={() => !isLocked && setActiveDay(d.day)}
                          disabled={isLocked}
                          className="flex flex-col items-center gap-1 flex-shrink-0 px-1"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                              ${isActive ? 'scale-110 ring-2 ring-white/20' : ''}
                              ${isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : isCurrent
                                  ? 'border-pp-accent text-pp-accent bg-pp-accent/10'
                                  : isLocked
                                    ? 'border-white/15 text-white/20 bg-white/3'
                                    : 'border-white/30 text-white/60 bg-white/5'
                              }`}
                          >
                            {isCompleted ? '✓' : d.day}
                          </div>
                          <span className={`text-[9px] ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                            D{d.day}
                          </span>
                        </button>

                        {/* Connector line */}
                        {idx < journey.days.length - 1 && (
                          <div className={`w-3 h-0.5 flex-shrink-0 mt-[-8px] rounded-full
                            ${dayProgressMap.get(d.day)?.day_completed ? 'bg-emerald-500/50' : 'bg-white/10'}`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Day Content */}
            {enrollment && activeDayData && (
              <div className="space-y-3">
                {/* Day header */}
                <div className="space-y-0.5">
                  <p className="text-xs text-pp-text-muted uppercase tracking-widest">{activeDayData.phase}</p>
                  <h3 className="font-display text-xl text-white">
                    Day {activeDayData.day}: {activeDayData.title}
                  </h3>
                </div>

                {/* Locked day */}
                {activeDay > currentEnrolledDay && !isJourneyComplete ? (
                  <div className="rounded-2xl border border-white/8 bg-white/3 p-6 text-center space-y-2">
                    <p className="text-2xl">🔒</p>
                    <p className="text-sm text-white/60">Complete Day {activeDay - 1} first to unlock this day.</p>
                  </div>
                ) : (
                  <DayView
                    day={activeDayData}
                    progress={activeDayProgress}
                    isPartner2={isPartner2}
                    partnerName={partnerName}
                    myName={myName}
                    onSoloSubmit={handleSoloSubmit}
                    onCheckboxChange={handleCheckboxChange}
                    onNotesChange={handleNotesChange}
                    onNotesBlur={handleNotesBlur}
                    onMarkComplete={handleMarkComplete}
                    isCompleting={isCompleting}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
