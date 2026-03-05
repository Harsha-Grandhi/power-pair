'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import BottomNav, { AppTab } from '@/components/layout/BottomNav';
import ProfileDrawer from '@/components/layout/ProfileDrawer';
import CoupleHomeTab from '@/components/home/CoupleHomeTab';
import LockedReport from '@/components/dashboard/LockedReport';
import TimeSelector from '@/components/wheel/TimeSelector';
import SpinWheel from '@/components/wheel/SpinWheel';
import JourneyListView from '@/components/journeys/JourneyListView';
import { DateDuration, getDateIdeasForCouple, DateIdea } from '@/lib/dateIdeas';
import { createDate, fetchDatesForCouple, DateRecord } from '@/lib/dates';
import { fetchCoupleProfiles } from '@/lib/couples';
import { getAllEnrollments, JourneyEnrollment } from '@/lib/journeyProgress';
import { Journey } from '@/lib/journeys';

type WheelStep = 'list' | 'time' | 'spin';

export default function DashboardPage() {
  const router = useRouter();
  const { state, resetApp } = useApp();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [profileOpen, setProfileOpen] = useState(false);

  // Wheel state
  const [wheelStep, setWheelStep] = useState<WheelStep>('list');
  const [selectedDuration, setSelectedDuration] = useState<DateDuration | null>(null);
  const [partnerArchetype, setPartnerArchetype] = useState<string | null>(null);
  const [savedDates, setSavedDates] = useState<DateRecord[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [wheelDurationFilter, setWheelDurationFilter] = useState<DateDuration | null>(null);
  const [creatingDate, setCreatingDate] = useState(false);

  // Journeys state
  const [journeyEnrollments, setJourneyEnrollments] = useState<JourneyEnrollment[]>([]);
  const [enrollmentsLoaded, setEnrollmentsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'wheel' || tab === 'journeys' || tab === 'counselor') {
      setActiveTab(tab as AppTab);
    }
  }, []);

  useEffect(() => {
    if (mounted && !state.profile) router.replace('/');
  }, [mounted, state.profile, router]);

  // ── Wheel handlers — must be before early return (Rules of Hooks) ─────────────

  const handleSelectDuration = useCallback((duration: DateDuration) => {
    if (!state.coupleId || !state.profile) return;
    setSelectedDuration(duration);
    setWheelStep('spin');
  }, [state.coupleId, state.profile]);

  // Load saved dates + partner archetype when wheel tab opens
  useEffect(() => {
    if (activeTab === 'wheel' && state.coupleId) {
      if (savedDates.length === 0 && !datesLoading) {
        setDatesLoading(true);
        fetchDatesForCouple(state.coupleId).then((dates) => {
          setSavedDates(dates);
          setDatesLoading(false);
        });
      }
      // Fetch partner's archetype if not yet loaded
      if (!partnerArchetype) {
        fetchCoupleProfiles(state.coupleId!).then(({ partner1, partner2 }) => {
          const isP2 = state.isInvited;
          const partner = isP2 ? partner1 : partner2;
          if (partner) setPartnerArchetype(partner.archetypeResult.primary.code);
        });
      }
    }
  }, [activeTab, state.coupleId, savedDates.length, datesLoading, partnerArchetype, state.isInvited]);

  // Load journey enrollments when journeys tab opens
  useEffect(() => {
    if (activeTab === 'journeys' && state.coupleId && !enrollmentsLoaded) {
      getAllEnrollments(state.coupleId).then((enrollments) => {
        setJourneyEnrollments(enrollments);
        setEnrollmentsLoaded(true);
      });
    }
  }, [activeTab, state.coupleId, enrollmentsLoaded]);

  if (!mounted || !state.profile) return null;

  const { profile } = state;
  const { archetypeResult, introContext } = profile;
  const { primary } = archetypeResult;
  const { coupleId } = state;

  const handleReset = () => {
    resetApp();
    router.replace('/');
  };

  const handleWheelBack = () => {
    setWheelStep('time');
    setSelectedDuration(null);
  };

  const handleConfirmDate = async (idea: string) => {
    if (!coupleId || !selectedDuration || creatingDate) return;
    setCreatingDate(true);
    const newDate = await createDate(coupleId, idea, selectedDuration);
    if (newDate) {
      setSavedDates((prev) => [newDate, ...prev]);
      setWheelStep('list');
      setSelectedDuration(null);
      router.push(`/date/${newDate.id}?from=wheel`);
    }
    setCreatingDate(false);
  };

  // ── Wheel tab rendering ──────────────────────────────────────────────────────

  const renderWheelTab = () => {
    if (!coupleId) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-5">
          <div className="text-4xl">🎡</div>
          <div className="space-y-2">
            <h3 className="font-display text-xl text-white">Spin the Wheel</h3>
            <p className="text-sm text-pp-text-muted leading-relaxed">
              Connect with your partner first to unlock personalised date ideas based on your archetypes.
            </p>
          </div>
        </div>
      );
    }

    if (wheelStep === 'time') {
      return (
        <TimeSelector
          onSelect={handleSelectDuration}
        />
      );
    }

    if (wheelStep === 'spin' && selectedDuration) {
      const p2Code = partnerArchetype ?? primary.code;
      const ideas = getDateIdeasForCouple(primary.code, p2Code, selectedDuration);
      const fallback: DateIdea[] = [
        { title: 'Cook Together', description: 'Make a simple meal together and enjoy the process.' },
        { title: 'Go for a Walk', description: 'Take a stroll and enjoy each other\'s company.' },
        { title: 'Movie Night', description: 'Pick a movie and watch it together with some snacks.' },
        { title: 'Game Night', description: 'Play a board game and get a little competitive.' },
        { title: 'Picnic Date', description: 'Pack some treats and head to the park.' },
        { title: 'Caf\u00E9 Hop', description: 'Visit a new caf\u00E9 and try something different.' },
        { title: 'Love Letters', description: 'Write heartfelt letters to each other.' },
        { title: 'Star Gaze', description: 'Find a cozy spot and look up at the night sky together.' },
      ];

      return (
        <SpinWheel
          ideas={ideas.length > 0 ? ideas : fallback}
          duration={selectedDuration}
          onBack={handleWheelBack}
          onConfirm={handleConfirmDate}
        />
      );
    }

    // Default: list of saved dates + new spin button
    return (
      <div className="px-5 py-5 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Date Ideas</p>
          <h2 className="font-display text-2xl text-white">Spin the Wheel</h2>
          <p className="text-sm text-pp-text-muted">
            Personalised date ideas based on your couple archetypes.
          </p>
        </div>

        {/* New spin button */}
        <button
          onClick={() => setWheelStep('time')}
          className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
            hover:bg-pp-accent/90 transition-all duration-200 active:scale-[0.98]"
        >
          🎡 Spin for a Date Idea
        </button>

        {/* Saved dates */}
        {datesLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
          </div>
        ) : savedDates.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Dates</p>
            {/* Duration filter tabs */}
            <div className="flex gap-2">
              {(['30 min', '1 hr', '3 hrs'] as DateDuration[]).map((dur) => (
                <button
                  key={dur}
                  onClick={() => setWheelDurationFilter(wheelDurationFilter === dur ? null : dur)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                    wheelDurationFilter === dur
                      ? 'bg-pp-accent text-pp-bg-dark'
                      : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
            {(() => {
              const filteredDates = wheelDurationFilter ? savedDates.filter((d) => d.duration === wheelDurationFilter) : savedDates;
              return filteredDates.length > 0 ? (
                <>
                  {filteredDates.map((d) => {
                    const colonIdx = d.date_idea.indexOf(': ');
                    const dateTitle = colonIdx > -1 ? d.date_idea.slice(0, colonIdx) : d.date_idea;
                    const dateDesc = colonIdx > -1 ? d.date_idea.slice(colonIdx + 2) : '';
                    return (
                    <button
                      key={d.id}
                      onClick={() => router.push(`/date/${d.id}?from=wheel`)}
                      className="w-full text-left p-4 rounded-2xl border border-white/8 bg-white/3
                        hover:border-white/20 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pp-card border border-pp-secondary/20
                          flex items-center justify-center flex-shrink-0 text-lg">
                          {d.status === 'completed' ? '✅' : '💑'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-semibold leading-snug">{dateTitle}</p>
                          {dateDesc && (
                            <p className="text-xs text-white/55 leading-snug mt-0.5 line-clamp-2">{dateDesc}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-pp-text-muted">{d.duration}</span>
                            <span className="text-pp-text-muted/40">·</span>
                            <span className={`text-xs ${d.status === 'completed' ? 'text-emerald-400' : 'text-pp-secondary'}`}>
                              {d.status === 'completed' ? 'Completed' : 'Planned'}
                            </span>
                          </div>
                        </div>
                        <span className="text-pp-text-muted text-sm flex-shrink-0">→</span>
                      </div>
                    </button>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-pp-text-muted">No dates for this duration yet.</p>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-pp-text-muted">No dates planned yet. Spin the wheel!</p>
          </div>
        )}
      </div>
    );
  };

  // ── Tab routing ──────────────────────────────────────────────────────────────

  const renderHome = () => {
    if (coupleId) {
      return (
        <CoupleHomeTab
          coupleId={coupleId}
          currentProfile={profile}
          archetypeName={primary.name}
        />
      );
    }
    return (
      <div className="px-5 py-6 space-y-4">
        {/* Static banner — no couple yet */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pp-card border border-pp-secondary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💑</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium tracking-[0.18em] text-pp-accent uppercase">
              Couple Chemistry
            </span>
            <p className="text-sm text-white/80 font-medium mt-0.5 leading-tight">Invite your partner</p>
            <p className="text-xs text-pp-text-muted mt-0.5">Unlock your compatibility breakdown together</p>
          </div>
          <div className="text-pp-text-muted/40 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <LockedReport archetypeName={primary.name} />
      </div>
    );
  };

  const renderPlaceholder = (emoji: string, title: string, subtitle: string) => (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-pp-card border border-pp-secondary/25 flex items-center justify-center">
        <span className="text-3xl">{emoji}</span>
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl text-white">{title}</h3>
        <p className="text-sm text-pp-text-muted">{subtitle}</p>
      </div>
      <span className="text-xs px-3 py-1 rounded-full border border-pp-secondary/30 text-pp-secondary">
        Coming Soon
      </span>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'home':      return renderHome();
      case 'wheel':     return renderWheelTab();
      case 'journeys':  return (
        <JourneyListView
          enrollments={journeyEnrollments}
          coupleId={coupleId ?? null}
          onSelect={(journey: Journey) => router.push(`/journey/${journey.id}?from=journeys`)}
        />
      );
      case 'counselor': return renderPlaceholder('💬', 'AI Coach', 'Personalised relationship guidance powered by AI.');
    }
  };

  return (
    <>
      <main className="relative min-h-dvh bg-pp-bg-dark overflow-x-hidden pb-20">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: primary.color }}
          />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-pp-secondary/10 blur-3xl" />
        </div>

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
          <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pp-accent/15 border border-pp-accent/30 flex items-center justify-center">
                <span className="text-xs">💑</span>
              </div>
              <span className="font-display text-base text-white font-semibold">Power Pair</span>
            </div>

            <button
              onClick={() => setProfileOpen(true)}
              className="flex flex-col items-center gap-0.5 group focus:outline-none"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
                  group-hover:scale-105 group-active:scale-95"
                style={{
                  background: `radial-gradient(circle, ${primary.gradientTo}25, ${primary.gradientFrom}12)`,
                  borderColor: `${primary.color}50`,
                }}
              >
                <span className="text-lg">{primary.emoji}</span>
              </div>
              {introContext.name && (
                <span className="text-[9px] text-pp-text-muted group-hover:text-white/70 transition-colors leading-none">
                  {introContext.name.split(' ')[0]}
                </span>
              )}
            </button>
          </div>
        </header>

        <div className="relative z-10 max-w-lg mx-auto w-full">
          {renderTab()}
        </div>
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onReset={handleReset}
        earnedBadges={journeyEnrollments}
      />
    </>
  );
}
