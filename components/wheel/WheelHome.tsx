'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WheelIdea } from '@/lib/wheelIdeas';
import { DATE_IDEA_CATALOG } from '@/data/dateIdeaCatalog';
import { CommunityIdea } from '@/lib/wheelIdeas';
import { DateDuration } from '@/lib/dateIdeas';
import { DateRecord } from '@/lib/dates';

interface WheelHomeProps {
  wheelIdeas: WheelIdea[];
  communityIdeas: CommunityIdea[];
  savedDates: DateRecord[];
  currentUserId: string;
  onExplore: () => void;
  onSpin: (ideas: WheelIdea[], filterLabel: string) => void;
  onRemove: (idea: WheelIdea) => void;
  removingId: string | null;
  datesLoaded: boolean;
}

type DurationFilter = 'all' | '30 min' | '1 hr' | '3 hrs';

function getIdeaDisplay(idea: WheelIdea, communityIdeas: CommunityIdea[]): { title: string; description: string; emoji: string } {
  if (idea.source_type === 'catalog' && idea.source_id) {
    const cat = DATE_IDEA_CATALOG.find((c) => c.id === idea.source_id);
    if (cat) return { title: cat.title, description: cat.description, emoji: cat.emoji };
  }
  if (idea.source_type === 'community' && idea.source_id) {
    const comm = communityIdeas.find((c) => c.id === idea.source_id);
    if (comm) return { title: comm.title, description: comm.description, emoji: '💡' };
  }
  return {
    title: idea.custom_title ?? 'Custom Idea',
    description: idea.custom_description ?? '',
    emoji: '✨',
  };
}

export default function WheelHome({
  wheelIdeas,
  communityIdeas,
  savedDates,
  currentUserId,
  onExplore,
  onSpin,
  onRemove,
  removingId,
  datesLoaded,
}: WheelHomeProps) {
  const router = useRouter();
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');

  const filteredIdeas = durationFilter === 'all'
    ? wheelIdeas
    : wheelIdeas.filter((i) => i.duration === durationFilter);

  const canSpin = filteredIdeas.length >= 3;
  const filterLabel = durationFilter === 'all' ? 'All ideas' : `${durationFilter} dates`;

  return (
    <div className="px-5 py-5 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-xs text-pp-text-muted uppercase tracking-widest">Date Ideas</p>
        <h2 className="font-display text-2xl text-white">Spin the Wheel 🎡</h2>
        <p className="text-sm text-pp-text-muted">
          Add ideas you love, then spin to decide your next date.
        </p>
      </div>

      {/* Spin section */}
      <div className="rounded-2xl border border-pp-accent/20 bg-pp-accent/5 p-4 space-y-3">
        {/* Duration filter */}
        <div className="flex gap-2">
          {(['all', '30 min', '1 hr', '3 hrs'] as DurationFilter[]).map((d) => (
            <button
              key={d}
              onClick={() => setDurationFilter(d)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                durationFilter === d
                  ? 'bg-pp-accent text-pp-bg-dark'
                  : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
              }`}
            >
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-pp-text-muted">
            {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''} on your wheel
          </span>
          {!canSpin && (
            <span className="text-[10px] text-pp-accent">Need at least 3</span>
          )}
        </div>

        <button
          onClick={() => canSpin && onSpin(filteredIdeas, filterLabel)}
          disabled={!canSpin}
          className="w-full py-4 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-base
            transition-all duration-200 active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed
            enabled:hover:bg-pp-accent/90"
        >
          🎡 Spin the Wheel
        </button>
      </div>

      {/* Explore button */}
      <button
        onClick={onExplore}
        className="w-full py-3.5 rounded-2xl border border-white/15 text-white font-medium text-sm
          hover:border-white/30 hover:bg-white/3 transition-all duration-200 active:scale-[0.98]
          flex items-center justify-center gap-2"
      >
        <span>🔍</span> Explore Ideas
      </button>

      {/* My wheel ideas */}
      {wheelIdeas.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">On Your Wheel</p>
          {wheelIdeas.map((idea) => {
            const display = getIdeaDisplay(idea, communityIdeas);
            const canRemove = idea.added_by_user_id === currentUserId;
            const isRemoving = removingId === idea.id;
            return (
              <div key={idea.id} className="p-3 rounded-xl border border-white/8 bg-white/3 flex items-start gap-3">
                <span className="text-lg mt-0.5 flex-shrink-0">{display.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-semibold leading-snug">{display.title}</p>
                  <p className="text-xs text-white/50 leading-snug mt-0.5 line-clamp-1">{display.description}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-pp-text-muted">
                    {idea.duration}
                  </span>
                </div>
                {canRemove && (
                  <button
                    onClick={() => !isRemoving && onRemove(idea)}
                    disabled={isRemoving}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                      text-pp-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    {isRemoving ? (
                      <div className="w-3 h-3 rounded-full border border-pp-text-muted border-t-transparent animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Saved dates */}
      {!datesLoaded ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
        </div>
      ) : savedDates.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Your Dates</p>
          {savedDates.map((d) => {
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
        </div>
      ) : null}
    </div>
  );
}
