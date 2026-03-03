'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import BottomNav, { AppTab } from '@/components/layout/BottomNav';
import ProfileDrawer from '@/components/layout/ProfileDrawer';
import CoupleHomeTab from '@/components/home/CoupleHomeTab';
import LockedReport from '@/components/dashboard/LockedReport';

export default function DashboardPage() {
  const router = useRouter();
  const { state, resetApp } = useApp();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !state.profile) router.replace('/');
  }, [mounted, state.profile, router]);

  if (!mounted || !state.profile) return null;

  const { profile } = state;
  const { archetypeResult, introContext } = profile;
  const { primary } = archetypeResult;
  const { coupleId } = state;

  const handleReset = () => {
    resetApp();
    router.replace('/');
  };

  // ── Tab content ─────────────────────────────────────────────────────────────

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
    // No couple yet — show invite section
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
      case 'home':
        return renderHome();
      case 'wheel':
        return renderPlaceholder('🎡', 'Spin the Wheel', 'Relationship prompts and conversation starters.');
      case 'journeys':
        return renderPlaceholder('🗺️', 'Journeys', 'Guided growth paths for you and your partner.');
      case 'counselor':
        return renderPlaceholder('💬', 'AI Coach', 'Personalised relationship guidance powered by AI.');
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
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-pp-accent/15 border border-pp-accent/30 flex items-center justify-center">
                <span className="text-xs">💑</span>
              </div>
              <span className="font-display text-base text-white font-semibold">Power Pair</span>
            </div>

            {/* Profile button — top right */}
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

        {/* Tab content */}
        <div className="relative z-10 max-w-lg mx-auto w-full">
          {renderTab()}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      {/* Profile drawer */}
      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onReset={handleReset}
      />
    </>
  );
}
