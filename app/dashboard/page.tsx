'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import BottomNav, { AppTab } from '@/components/layout/BottomNav';
import ProfileDrawer from '@/components/layout/ProfileDrawer';
import CoupleHomeTab, { clearCoupleCache } from '@/components/home/CoupleHomeTab';
import LockedReport from '@/components/dashboard/LockedReport';
import SpinWheel, { SpinWheelIdea } from '@/components/wheel/SpinWheel';
import WheelHome from '@/components/wheel/WheelHome';
import DateIdeaCatalog from '@/components/wheel/DateIdeaCatalog';
import CreateIdeaForm from '@/components/wheel/CreateIdeaForm';
import JourneysTabContainer from '@/components/journeys/JourneysTabContainer';
import { DateDuration } from '@/lib/dateIdeas';
import { createDate, fetchDatesForCouple, DateRecord } from '@/lib/dates';
import { fetchWheelIdeas, addWheelIdea, removeWheelIdea, fetchCommunityIdeas, submitCommunityIdea, WheelIdea, CommunityIdea } from '@/lib/wheelIdeas';
import { DATE_IDEA_CATALOG, CatalogDateIdea } from '@/data/dateIdeaCatalog';
import { fetchCoupleProfiles, fetchPairingCode, linkByPairingCode, resetPartnership } from '@/lib/couples';
import { getAllEnrollments, JourneyEnrollment } from '@/lib/journeyProgress';
import { Journey } from '@/lib/journeys';
import ReflectionHistory from '@/components/coach/ReflectionHistory';

type WheelStep = 'home' | 'explore' | 'create' | 'spin';

export default function DashboardPage() {
  const router = useRouter();
  const { state, authLoading, resetApp, softReset, setCoupleId } = useApp();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [profileOpen, setProfileOpen] = useState(false);

  // Wheel state
  const [wheelStep, setWheelStep] = useState<WheelStep>('home');
  const [partnerArchetype, setPartnerArchetype] = useState<string | null>(null);
  const [savedDates, setSavedDates] = useState<DateRecord[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [datesLoaded, setDatesLoaded] = useState(false);
  const [creatingDate, setCreatingDate] = useState(false);
  const [wheelIdeas, setWheelIdeas] = useState<WheelIdea[]>([]);
  const [wheelIdeasLoaded, setWheelIdeasLoaded] = useState(false);
  const [communityIdeas, setCommunityIdeas] = useState<CommunityIdea[]>([]);
  const [spinIdeas, setSpinIdeas] = useState<SpinWheelIdea[]>([]);
  const [spinFilterLabel, setSpinFilterLabel] = useState('All ideas');
  const [addingWheelId, setAddingWheelId] = useState<string | null>(null);
  const [removingWheelId, setRemovingWheelId] = useState<string | null>(null);
  const [creatingIdea, setCreatingIdea] = useState(false);

  // Journeys state
  const [journeyEnrollments, setJourneyEnrollments] = useState<JourneyEnrollment[]>([]);
  const [enrollmentsLoaded, setEnrollmentsLoaded] = useState(false);

  // Pairing code state
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [linkCode, setLinkCode] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [resettingPartnership, setResettingPartnership] = useState(false);
  const [partnershipResetSuccess, setPartnershipResetSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'wheel' || tab === 'journeys' || tab === 'counselor') {
      setActiveTab(tab as AppTab);
    }
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && !state.profile) router.replace('/');
  }, [mounted, authLoading, state.profile, router]);

  // ── Wheel handlers — must be before early return (Rules of Hooks) ─────────────

  // Load saved dates, wheel ideas, and community ideas when wheel tab opens
  useEffect(() => {
    if (activeTab === 'wheel' && state.coupleId) {
      if (!datesLoaded && !datesLoading) {
        setDatesLoading(true);
        fetchDatesForCouple(state.coupleId).then((dates) => {
          setSavedDates(dates);
          setDatesLoading(false);
          setDatesLoaded(true);
        });
      }
      if (!wheelIdeasLoaded) {
        fetchWheelIdeas(state.coupleId).then((ideas) => {
          setWheelIdeas(ideas);
          setWheelIdeasLoaded(true);
        });
        fetchCommunityIdeas().then(setCommunityIdeas);
      }
      // Fetch partner's archetype if not yet loaded
      if (!partnerArchetype) {
        fetchCoupleProfiles(state.coupleId!).then(({ partner1, partner2 }) => {
          const myId = state.profile?.id;
          const partner = partner1?.id === myId ? partner2 : partner1;
          if (partner) setPartnerArchetype(partner.archetypeResult.primary.code);
        });
      }
    }
  }, [activeTab, state.coupleId, datesLoaded, datesLoading, partnerArchetype, wheelIdeasLoaded, state.profile?.id]);

  // Load journey enrollments when journeys tab opens
  useEffect(() => {
    if (activeTab === 'journeys' && state.coupleId && !enrollmentsLoaded) {
      getAllEnrollments(state.coupleId).then((enrollments) => {
        setJourneyEnrollments(enrollments);
        setEnrollmentsLoaded(true);
      });
    }
  }, [activeTab, state.coupleId, enrollmentsLoaded]);

  // Fetch pairing code for solo users
  useEffect(() => {
    if (mounted && state.coupleId && !partnerArchetype) {
      fetchPairingCode(state.coupleId).then(code => setPairingCode(code));
    }
  }, [mounted, state.coupleId, partnerArchetype]);

  if (!mounted || authLoading) {
    return (
      <div className="min-h-dvh bg-pp-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!state.profile) return null;

  const { profile } = state;
  const { archetypeResult, introContext } = profile;
  const { primary } = archetypeResult;
  const { coupleId } = state;

  const handleReset = () => {
    resetApp();
    router.replace('/');
  };

  const handleSignOut = async () => {
    const { signOut } = await import('@/lib/auth');
    await signOut();
    // Clear in-memory state so landing page doesn't redirect back.
    // localStorage is preserved — profile restores on next login.
    softReset();
    router.replace('/');
  };

  const handleResetPartnership = async () => {
    if (!coupleId || !profile) return;
    setResettingPartnership(true);
    const newCoupleId = await resetPartnership(
      profile.id,
      coupleId,
      profile.introContext.name ?? null
    );
    setResettingPartnership(false);
    if (newCoupleId) {
      setCoupleId(newCoupleId);
      // Reset local partner-related state instead of full page reload
      clearCoupleCache();
      setPartnerArchetype(null);
      setPairingCode(null);
      setDatesLoaded(false);
      setSavedDates([]);
      setWheelIdeas([]);
      setWheelIdeasLoaded(false);
      setCommunityIdeas([]);
      setWheelStep('home');
      setEnrollmentsLoaded(false);
      setJourneyEnrollments([]);
      setLinkCode('');
      setLinkSuccess(false);
      setLinkError('');
      // Close drawer and show success message
      setProfileOpen(false);
      setPartnershipResetSuccess(true);
      // Fetch new pairing code
      fetchPairingCode(newCoupleId).then(code => setPairingCode(code));
    }
  };

  const handleWheelBack = () => {
    setWheelStep('home');
  };

  const handleConfirmDate = async (idea: string) => {
    if (!coupleId || creatingDate) return;
    setCreatingDate(true);
    const newDate = await createDate(coupleId, idea, '1 hr');
    if (newDate) {
      setSavedDates((prev) => [newDate, ...prev]);
      setWheelStep('home');
      router.push(`/date/${newDate.id}?from=wheel`);
    }
    setCreatingDate(false);
  };

  // Resolve a WheelIdea to a display title/description
  const resolveWheelIdea = (idea: WheelIdea): SpinWheelIdea => {
    if (idea.source_type === 'catalog' && idea.source_id) {
      const cat = DATE_IDEA_CATALOG.find((c) => c.id === idea.source_id);
      if (cat) return { title: cat.title, description: cat.description };
    }
    if (idea.source_type === 'community' && idea.source_id) {
      const comm = communityIdeas.find((c) => c.id === idea.source_id);
      if (comm) return { title: comm.title, description: comm.description };
    }
    return { title: idea.custom_title ?? 'Custom Idea', description: idea.custom_description ?? '' };
  };

  const handleSpin = (ideas: WheelIdea[], filterLabel: string) => {
    setSpinIdeas(ideas.map(resolveWheelIdea));
    setSpinFilterLabel(filterLabel);
    setWheelStep('spin');
  };

  const handleAddCatalogIdea = async (idea: CatalogDateIdea) => {
    if (!coupleId || !profile) return;
    setAddingWheelId(`catalog:${idea.id}`);
    const added = await addWheelIdea(coupleId, profile.id, {
      source_type: 'catalog',
      source_id: idea.id,
      duration: idea.duration,
    });
    if (added) setWheelIdeas((prev) => [added, ...prev]);
    setAddingWheelId(null);
  };

  const handleAddCommunityIdea = async (idea: CommunityIdea) => {
    if (!coupleId || !profile) return;
    setAddingWheelId(`community:${idea.id}`);
    const added = await addWheelIdea(coupleId, profile.id, {
      source_type: 'community',
      source_id: idea.id,
      duration: idea.duration,
    });
    if (added) setWheelIdeas((prev) => [added, ...prev]);
    setAddingWheelId(null);
  };

  const handleRemoveWheelIdea = async (idea: WheelIdea) => {
    if (!profile) return;
    setRemovingWheelId(idea.id);
    const ok = await removeWheelIdea(idea.id, profile.id);
    if (ok) setWheelIdeas((prev) => prev.filter((i) => i.id !== idea.id));
    setRemovingWheelId(null);
  };

  const handleCreateIdea = async (data: {
    title: string;
    description: string;
    duration: DateDuration;
    shareWithCommunity: boolean;
  }) => {
    if (!coupleId || !profile) return;
    setCreatingIdea(true);

    // If sharing, submit to community first
    if (data.shareWithCommunity) {
      const community = await submitCommunityIdea(
        coupleId,
        profile.id,
        profile.introContext.name ?? null,
        data.title,
        data.description,
        data.duration
      );
      if (community) {
        setCommunityIdeas((prev) => [community, ...prev]);
        // Add community idea to wheel
        const added = await addWheelIdea(coupleId, profile.id, {
          source_type: 'community',
          source_id: community.id,
          duration: data.duration,
        });
        if (added) setWheelIdeas((prev) => [added, ...prev]);
      }
    } else {
      // Custom idea, wheel only
      const added = await addWheelIdea(coupleId, profile.id, {
        source_type: 'custom',
        custom_title: data.title,
        custom_description: data.description,
        duration: data.duration,
      });
      if (added) setWheelIdeas((prev) => [added, ...prev]);
    }

    setCreatingIdea(false);
    setWheelStep('home');
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
              Connect with your partner first to explore date ideas and spin the wheel together.
            </p>
          </div>
        </div>
      );
    }

    if (wheelStep === 'explore') {
      return (
        <DateIdeaCatalog
          wheelIdeas={wheelIdeas}
          communityIdeas={communityIdeas}
          onAddCatalogIdea={handleAddCatalogIdea}
          onAddCommunityIdea={handleAddCommunityIdea}
          onBack={handleWheelBack}
          onCreate={() => setWheelStep('create')}
          addingId={addingWheelId}
        />
      );
    }

    if (wheelStep === 'create') {
      return (
        <CreateIdeaForm
          onSubmit={handleCreateIdea}
          onBack={() => setWheelStep('explore')}
          submitting={creatingIdea}
        />
      );
    }

    if (wheelStep === 'spin') {
      return (
        <SpinWheel
          ideas={spinIdeas}
          filterLabel={spinFilterLabel}
          onBack={handleWheelBack}
          onConfirm={handleConfirmDate}
        />
      );
    }

    // Default: home
    return (
      <WheelHome
        wheelIdeas={wheelIdeas}
        communityIdeas={communityIdeas}
        savedDates={savedDates}
        currentUserId={profile.id}
        onExplore={() => setWheelStep('explore')}
        onSpin={handleSpin}
        onRemove={handleRemoveWheelIdea}
        removingId={removingWheelId}
        datesLoaded={datesLoaded}
      />
    );
  };

  // ── Tab routing ──────────────────────────────────────────────────────────────

  const renderHome = () => {
    const resetBanner = partnershipResetSuccess ? (
      <div className="mx-5 mt-4 mb-0 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4 flex items-start gap-3">
        <span className="text-xl mt-0.5">✅</span>
        <div className="flex-1">
          <p className="text-sm text-emerald-400 font-semibold">Partnership Reset</p>
          <p className="text-xs text-pp-text-muted mt-1 leading-relaxed">
            You&apos;ve been disconnected from your previous partner. Share your new pairing code below to connect with someone new.
          </p>
        </div>
        <button
          onClick={() => setPartnershipResetSuccess(false)}
          className="text-pp-text-muted hover:text-white transition-colors text-sm mt-0.5"
        >
          ✕
        </button>
      </div>
    ) : null;

    if (coupleId) {
      return (
        <>
          {resetBanner}
          <CoupleHomeTab
            coupleId={coupleId}
            currentProfile={profile}
            archetypeName={primary.name}
          />
        </>
      );
    }
    const handleLinkPartner = async () => {
      if (!linkCode.trim() || linkLoading) return;
      setLinkError('');
      setLinkLoading(true);
      const { coupleId: newCoupleId, error } = await linkByPairingCode(linkCode.trim(), profile.id, coupleId ?? null);
      setLinkLoading(false);
      if (newCoupleId) {
        setLinkSuccess(true);
        // Reload the page to show couple results
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setLinkError(error ?? 'Something went wrong. Please try again.');
      }
    };

    return (
      <div className="px-5 py-6 space-y-4">
        {resetBanner && <div className="-mx-5 -mt-6">{resetBanner}</div>}
        {/* Invite banner */}
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-pp-card border border-pp-secondary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{'💑'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium tracking-[0.18em] text-pp-accent uppercase">
              Couple Chemistry
            </span>
            <p className="text-sm text-white/80 font-medium mt-0.5 leading-tight">Connect with your partner</p>
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
        <JourneysTabContainer
          enrollments={journeyEnrollments}
          coupleId={coupleId ?? null}
          userId={profile.id}
          partnerArchetypeCode={partnerArchetype}
          onSelectJourney={(journey: Journey) => router.push(`/journey/${journey.id}?from=journeys`)}
        />
      );
      case 'counselor': return <ReflectionHistory userId={state.profile?.id ?? ''} coupleId={coupleId ?? null} />;
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
        onSignOut={handleSignOut}
        onResetPartnership={handleResetPartnership}
        isResettingPartnership={resettingPartnership}
        hasCoupleId={!!coupleId}
        earnedBadges={journeyEnrollments}
      />
    </>
  );
}
