'use client';

import React, { useState, useMemo } from 'react';
import { DATE_IDEA_CATALOG, CATALOG_CATEGORIES, CatalogDateIdea, CatalogCategory } from '@/data/dateIdeaCatalog';
import { CommunityIdea, WheelIdea } from '@/lib/wheelIdeas';
import { DateDuration } from '@/lib/dateIdeas';

type SourceTab = 'curated' | 'community';

interface DateIdeaCatalogProps {
  wheelIdeas: WheelIdea[];
  communityIdeas: CommunityIdea[];
  onAddCatalogIdea: (idea: CatalogDateIdea) => void;
  onAddCommunityIdea: (idea: CommunityIdea) => void;
  onBack: () => void;
  onCreate: () => void;
  addingId: string | null;
}

const DURATION_FILTERS: { label: string; value: DateDuration | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '30 min', value: '30 min' },
  { label: '1 hr', value: '1 hr' },
  { label: '3 hrs', value: '3 hrs' },
];

export default function DateIdeaCatalog({
  wheelIdeas,
  communityIdeas,
  onAddCatalogIdea,
  onAddCommunityIdea,
  onBack,
  onCreate,
  addingId,
}: DateIdeaCatalogProps) {
  const [sourceTab, setSourceTab] = useState<SourceTab>('curated');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CatalogCategory | 'all'>('all');
  const [durationFilter, setDurationFilter] = useState<DateDuration | 'all'>('all');

  // Build set of already-added source IDs for quick lookup
  const addedSourceIds = useMemo(() => {
    const set = new Set<string>();
    for (const w of wheelIdeas) {
      if (w.source_id) set.add(`${w.source_type}:${w.source_id}`);
    }
    return set;
  }, [wheelIdeas]);

  const isOnWheel = (type: 'catalog' | 'community', id: string) =>
    addedSourceIds.has(`${type}:${id}`);

  // Filter curated ideas
  const filteredCurated = useMemo(() => {
    const q = search.toLowerCase();
    return DATE_IDEA_CATALOG.filter((idea) => {
      if (durationFilter !== 'all' && idea.duration !== durationFilter) return false;
      if (categoryFilter !== 'all' && idea.category !== categoryFilter) return false;
      if (q && !idea.title.toLowerCase().includes(q) && !idea.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, categoryFilter, durationFilter]);

  // Filter community ideas
  const filteredCommunity = useMemo(() => {
    const q = search.toLowerCase();
    return communityIdeas.filter((idea) => {
      if (durationFilter !== 'all' && idea.duration !== durationFilter) return false;
      if (q && !idea.title.toLowerCase().includes(q) && !idea.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [communityIdeas, search, durationFilter]);

  return (
    <div className="px-5 py-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-pp-text-muted hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="font-display text-xl text-white font-semibold">Explore Date Ideas</h2>
          <p className="text-xs text-pp-text-muted">Browse and add ideas to your wheel</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="w-4 h-4 text-pp-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ideas..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white
            placeholder:text-white/25 focus:outline-none focus:border-pp-accent/40 transition-colors"
        />
      </div>

      {/* Source tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSourceTab('curated')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            sourceTab === 'curated'
              ? 'bg-pp-accent text-pp-bg-dark'
              : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
          }`}
        >
          Curated ✨
        </button>
        <button
          onClick={() => setSourceTab('community')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            sourceTab === 'community'
              ? 'bg-pp-accent text-pp-bg-dark'
              : 'bg-white/5 border border-white/10 text-pp-text-muted hover:text-white'
          }`}
        >
          Community 🌍
        </button>
      </div>

      {/* Category filter (curated only) */}
      {sourceTab === 'curated' && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-hide">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-pp-accent/20 text-pp-accent border border-pp-accent/30'
                : 'bg-white/5 text-pp-text-muted border border-white/8 hover:text-white'
            }`}
          >
            All
          </button>
          {CATALOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-pp-accent/20 text-pp-accent border border-pp-accent/30'
                  : 'bg-white/5 text-pp-text-muted border border-white/8 hover:text-white'
              }`}
            >
              {cat.emoji} {cat.id}
            </button>
          ))}
        </div>
      )}

      {/* Duration filter */}
      <div className="flex gap-2">
        {DURATION_FILTERS.map((d) => (
          <button
            key={d.value}
            onClick={() => setDurationFilter(d.value)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              durationFilter === d.value
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-pp-text-muted hover:text-white'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Ideas list */}
      <div className="space-y-2 pb-20">
        {sourceTab === 'curated' ? (
          filteredCurated.length > 0 ? (
            filteredCurated.map((idea) => {
              const added = isOnWheel('catalog', idea.id);
              const isAdding = addingId === `catalog:${idea.id}`;
              return (
                <div key={idea.id} className="p-3.5 rounded-xl border border-white/8 bg-white/3 flex items-start gap-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">{idea.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-semibold leading-snug">{idea.title}</p>
                    <p className="text-xs text-white/55 leading-snug mt-0.5 line-clamp-2">{idea.description}</p>
                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-pp-text-muted">
                      {idea.duration}
                    </span>
                  </div>
                  <button
                    onClick={() => !added && !isAdding && onAddCatalogIdea(idea)}
                    disabled={added || isAdding}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      added
                        ? 'bg-emerald-500/15 text-emerald-400 cursor-default'
                        : isAdding
                        ? 'bg-white/10 text-pp-text-muted cursor-wait'
                        : 'bg-pp-accent/15 text-pp-accent hover:bg-pp-accent/25 active:scale-95'
                    }`}
                  >
                    {added ? 'Added ✓' : isAdding ? '...' : 'Add +'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-pp-text-muted">No ideas match your filters.</p>
            </div>
          )
        ) : (
          <>
            {filteredCommunity.length > 0 ? (
              filteredCommunity.map((idea) => {
                const added = isOnWheel('community', idea.id);
                const isAdding = addingId === `community:${idea.id}`;
                return (
                  <div key={idea.id} className="p-3.5 rounded-xl border border-white/8 bg-white/3 flex items-start gap-3">
                    <span className="text-lg mt-0.5 flex-shrink-0">💡</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold leading-snug">{idea.title}</p>
                      <p className="text-xs text-white/55 leading-snug mt-0.5 line-clamp-2">{idea.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/8 text-pp-text-muted">
                          {idea.duration}
                        </span>
                        {idea.author_name && (
                          <span className="text-[10px] text-pp-text-muted">by {idea.author_name}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => !added && !isAdding && onAddCommunityIdea(idea)}
                      disabled={added || isAdding}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        added
                          ? 'bg-emerald-500/15 text-emerald-400 cursor-default'
                          : isAdding
                          ? 'bg-white/10 text-pp-text-muted cursor-wait'
                          : 'bg-pp-accent/15 text-pp-accent hover:bg-pp-accent/25 active:scale-95'
                      }`}
                    >
                      {added ? 'Added ✓' : isAdding ? '...' : 'Add +'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-pp-text-muted">
                  {search ? 'No community ideas match your search.' : 'No community ideas yet. Be the first!'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating create button */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={onCreate}
          className="px-4 py-3 rounded-2xl bg-pp-accent text-pp-bg-dark font-semibold text-sm shadow-lg shadow-pp-accent/20
            hover:bg-pp-accent/90 transition-all active:scale-95 flex items-center gap-2"
        >
          <span>✏️</span> Create Your Own
        </button>
      </div>
    </div>
  );
}
