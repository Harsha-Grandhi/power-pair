'use client';

import React, { useEffect } from 'react';
import { UserProfile } from '@/types';
import ArchetypeCard from '@/components/dashboard/ArchetypeCard';
import DimensionCard from '@/components/dashboard/DimensionCard';
import { JOURNEYS } from '@/lib/journeys';

interface EarnedBadge {
  journey_id: string;
  badge_earned: boolean;
}

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onReset: () => void;
  earnedBadges?: EarnedBadge[];
}

export default function ProfileDrawer({ open, onClose, profile, onReset, earnedBadges }: ProfileDrawerProps) {
  const { archetypeResult, dimensionScores, introContext } = profile;
  const { primary } = archetypeResult;

  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer — slides in from right */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-pp-bg-dark border-l border-white/8
          flex flex-col transition-transform duration-350 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div
          className="px-5 pt-12 pb-6 border-b border-white/8"
          style={{
            background: `linear-gradient(135deg, ${primary.gradientFrom}18 0%, transparent 100%)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/8 flex items-center justify-center
              text-pp-text-muted hover:text-white hover:bg-white/12 transition-colors"
          >
            ✕
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-card"
              style={{
                background: `radial-gradient(circle, ${primary.gradientTo}25, ${primary.gradientFrom}12)`,
                borderColor: `${primary.color}40`,
              }}
            >
              <span className="text-4xl">{primary.emoji}</span>
            </div>

            <div>
              {introContext.name && (
                <h2 className="font-display text-xl text-white font-semibold">
                  {introContext.name}
                </h2>
              )}
              <p className="text-sm font-medium mt-0.5" style={{ color: primary.color }}>
                {primary.name}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-24">
          {/* Archetype card */}
          <ArchetypeCard result={archetypeResult} />

          {/* Dimensions */}
          <div>
            <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-3">
              4 Dimensions
            </p>
            <div className="space-y-2">
              {dimensionScores.map((dim, i) => (
                <DimensionCard key={dim.id} dimension={dim} index={i} />
              ))}
            </div>
          </div>

          {/* Strengths & Growth */}
          <div className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
            <p className="text-xs text-pp-text-muted uppercase tracking-widest">
              Strengths &amp; Growth Edge
            </p>
            <div className="space-y-1.5">
              {primary.strengths.map((s) => (
                <div key={s} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                  <span className="text-emerald-400 text-xs">✦</span>
                  <span className="text-sm text-white/85">{s}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {primary.growthAreas.map((g) => (
                <div key={g} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-pp-accent/8 border border-pp-accent/15">
                  <span className="text-pp-accent text-xs">◆</span>
                  <span className="text-sm text-white/85">{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Badges */}
          {earnedBadges && earnedBadges.some((b) => b.badge_earned) && (
            <div>
              <p className="text-xs text-pp-text-muted uppercase tracking-widest mb-3">
                Journey Badges
              </p>
              <div className="flex flex-wrap gap-2">
                {earnedBadges
                  .filter((b) => b.badge_earned)
                  .map((b) => {
                    const journey = JOURNEYS.find((j) => j.id === b.journey_id);
                    if (!journey) return null;
                    return (
                      <div
                        key={b.journey_id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm"
                        style={{
                          background: `${journey.badge.color}10`,
                          borderColor: `${journey.badge.color}30`,
                        }}
                        title={journey.title}
                      >
                        <span>{journey.badge.emoji}</span>
                        <span className="text-xs text-white/70">{journey.badge.label}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
