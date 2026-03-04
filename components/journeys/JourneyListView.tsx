'use client';

import React from 'react';
import { JOURNEYS, Journey } from '@/lib/journeys';
import { JourneyEnrollment } from '@/lib/journeyProgress';

interface JourneyListViewProps {
  enrollments: JourneyEnrollment[];
  coupleId: string | null;
  onSelect: (journey: Journey) => void;
}

function difficultyColor(difficulty: string): string {
  if (difficulty.includes('High')) return 'text-red-400 border-red-400/30 bg-red-400/8';
  if (difficulty.includes('Moderate')) return 'text-amber-400 border-amber-400/30 bg-amber-400/8';
  return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/8';
}

export default function JourneyListView({ enrollments, coupleId, onSelect }: JourneyListViewProps) {
  const enrollmentMap = new Map(enrollments.map((e) => [e.journey_id, e]));

  return (
    <div className="px-5 py-5 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs text-pp-text-muted uppercase tracking-widest">Growth Paths</p>
        <h2 className="font-display text-2xl text-white">Relationship Journeys</h2>
        <p className="text-sm text-pp-text-muted leading-relaxed">
          10-day guided experiences to deepen your connection, one milestone at a time.
        </p>
      </div>

      {!coupleId && (
        <div className="rounded-2xl border border-pp-secondary/25 bg-pp-secondary/8 p-4 flex items-start gap-3">
          <span className="text-lg flex-shrink-0">🔗</span>
          <p className="text-sm text-pp-text-muted leading-relaxed">
            Connect with your partner first to start journeys together and track shared progress.
          </p>
        </div>
      )}

      {/* Journey cards */}
      <div className="space-y-3">
        {JOURNEYS.map((journey) => {
          const enrollment = enrollmentMap.get(journey.id);
          const isStarted = !!enrollment;
          const isCompleted = enrollment?.badge_earned ?? false;
          const currentDay = enrollment?.current_day ?? 1;
          const streak = enrollment?.streak ?? 0;

          return (
            <button
              key={journey.id}
              onClick={() => onSelect(journey)}
              className="w-full text-left rounded-2xl border border-white/8 bg-white/3 p-4
                hover:border-white/20 hover:bg-white/5 transition-all duration-200 active:scale-[0.99]"
            >
              <div className="flex items-start gap-4">
                {/* Badge / Number */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border text-xl"
                  style={{
                    background: `${journey.badge.color}12`,
                    borderColor: `${journey.badge.color}30`,
                  }}
                >
                  {isCompleted ? '🏅' : journey.badge.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-pp-text-muted uppercase tracking-widest mb-0.5">
                        Journey {journey.number}
                      </p>
                      <h3 className="text-sm font-semibold text-white leading-snug">
                        {journey.title}
                      </h3>
                      <p className="text-xs text-pp-text-muted mt-0.5 leading-relaxed line-clamp-2">
                        {journey.subtitle}
                      </p>
                    </div>
                    <span className="text-pp-text-muted text-sm flex-shrink-0">→</span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${difficultyColor(journey.difficulty)}`}>
                      {journey.difficulty}
                    </span>
                    <span className="text-[10px] text-pp-text-muted">
                      {journey.duration} days
                    </span>
                    {isStarted && !isCompleted && (
                      <>
                        <span className="text-pp-text-muted/40 text-[10px]">·</span>
                        <span className="text-[10px] text-pp-accent font-medium">
                          Day {currentDay} of {journey.duration}
                        </span>
                        {streak > 0 && (
                          <>
                            <span className="text-pp-text-muted/40 text-[10px]">·</span>
                            <span className="text-[10px] text-amber-400">
                              🔥 {streak}-day streak
                            </span>
                          </>
                        )}
                      </>
                    )}
                    {isCompleted && (
                      <>
                        <span className="text-pp-text-muted/40 text-[10px]">·</span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          ✓ Completed · {journey.badge.label}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Progress bar if started */}
                  {isStarted && !isCompleted && (
                    <div className="mt-2.5 h-1 rounded-full bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${((currentDay - 1) / journey.duration) * 100}%`,
                          backgroundColor: journey.badge.color,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
