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
import { DateDuration, getDateIdeasForCouple } from '@/lib/dateIdeas';
import { createDate, fetchDatesForCouple, DateRecord } from '@/lib/dates';
import { fetchCoupleProfiles } from '@/lib/couples';

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
  const [creatingDate, setCreatingDate] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !state.profile) router.replace('/');
  }, [mounted, state.profile, router]);

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
          if (partner) setPartnerArchetype(partner.archetypeResult.primary.name);
        });
      }
    }
  }, [activeTab, state.coupleId, savedDates.length, datesLoading, partnerArchetype, state.isInvited]);

  if (!mounted || !state.profile) return null;

  const { profile } = state;
  const { archetypeResult, introContext } = profile;
  const { primary } = archetypeResult;
  const { coupleId } = state;

  const handleReset = () => {
    resetApp();
    router.replace('/');
  };

  // ── Wheel handlers ───────────────────────────────────────────────────────────

  const handleSelectDuration = useCallback((duration: DateDuration) => {
    if (!coupleId || !profile) return;

    // We don't know partner's archetype from context — use primary as both if no couple data
    // In reality fetchCoupleProfiles would give partner's archetype; for now we use what we have
    // The CoupleHomeTab already fetches partners — here we pass profile's archetype as p1
    // and use a placeholder for p2 until we have both. We filter just by p1 archetype pattern.
    setSelectedDuration(duration);
    setWheelStep('spin');
  }, [coupleId, profile]);

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
      router.push(`/date/${newDate.id}`);
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
      const p2Name = partnerArchetype ?? primary.name;
      const ideas = getDateIdeasForCouple(primary.name, p2Name, selectedDuration);
      const fallback = ['Cook together', 'Go for a walk', 'Watch a movie', 'Play a board game', 'Have a picnic', 'Visit a café', 'Write letters to each other', 'Star gaze'];

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
            {savedDates.map((d) => (
              <button
                key={d.id}
                onClick={() => router.push(`/date/${d.id}`)}
                className="w-full text-left p-4 rounded-2xl border border-white/8 bg-white/3
                  hover:border-white/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pp-card border border-pp-secondary/20
                    flex items-center justify-center flex-shrink-0 text-lg">
                    {d.status === 'completed' ? '✅' : '💑'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 font-medium leading-snug line-clamp-2">
                      {d.date_idea}
                    </p>
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
            ))}
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
      <div className="px-5 py-6 space-y-5">
        <div className="pt-2 space-y-1">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Match</p>
          <h2 className="font-display text-2xl text-white">Couple Chemistry</h2>
          <p className="text-sm text-pp-text-muted leading-relaxed">
            Invite your partner to unlock your compatibility breakdown.
          </p>
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
      case 'journeys':  return renderPlaceholder('🗺️', 'Journeys', 'Guided growth paths for you and your partner.');
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
      />
    </>
  );
}
