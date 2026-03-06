'use client';

import React, { useState, useCallback } from 'react';
import {
  Pill,
  ResolvedPill,
  searchAndRecommend,
  getSamplePills,
  resolvePersonalityModifiers,
  Situation,
} from '@/lib/firstAidService';
import PillCard from './PillCard';
import PillDetailView from './PillDetailView';

interface KnowledgePillsContainerProps {
  partnerArchetypeCode: string | null;
}

type View = 'landing' | 'results' | 'detail';

export default function KnowledgePillsContainer({ partnerArchetypeCode }: KnowledgePillsContainerProps) {
  const [view, setView] = useState<View>('landing');
  const [query, setQuery] = useState('');
  const [matchedSituation, setMatchedSituation] = useState<Situation | null>(null);
  const [resultPills, setResultPills] = useState<ResolvedPill[]>([]);
  const [selectedPill, setSelectedPill] = useState<ResolvedPill | null>(null);

  const samplePills = getSamplePills();

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const { situation, pills } = searchAndRecommend(trimmed, partnerArchetypeCode);
    setMatchedSituation(situation);
    setResultPills(pills);
    setView('results');
  }, [query, partnerArchetypeCode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSelectPill = (pill: Pill) => {
    const resolved = resolvePersonalityModifiers(pill, partnerArchetypeCode);
    setSelectedPill(resolved);
    setView('detail');
  };

  const handleBack = () => {
    if (view === 'detail') {
      setSelectedPill(null);
      setView(resultPills.length > 0 ? 'results' : 'landing');
    } else {
      setMatchedSituation(null);
      setResultPills([]);
      setView('landing');
    }
  };

  // ---------- Detail view ----------
  if (view === 'detail' && selectedPill) {
    return (
      <div className="px-5 pt-4">
        <PillDetailView pill={selectedPill} onBack={handleBack} />
      </div>
    );
  }

  // ---------- Results view ----------
  if (view === 'results') {
    return (
      <div className="px-5 pt-4 space-y-5">
        <button
          onClick={handleBack}
          className="text-sm text-pp-text-muted hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back
        </button>

        {/* Search bar (persisted) */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="My partner is feeling..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder:text-pp-text-muted focus:outline-none focus:border-pp-accent/50 transition-colors"
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pp-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-pp-accent text-pp-bg-dark text-xs font-semibold rounded-lg hover:bg-pp-accent/90 transition-colors"
          >
            Search
          </button>
        </div>

        {matchedSituation && resultPills.length > 0 ? (
          <>
            <div>
              <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-1">Closest match</p>
              <p className="text-sm text-white/80">{matchedSituation.situation}</p>
            </div>
            <div>
              <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-3">
                Here&apos;s how you can help
              </p>
              <div className="space-y-3">
                {resultPills.map(pill => (
                  <PillCard key={pill.id} pill={pill} onSelect={handleSelectPill} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-pp-text-muted text-sm">No matching situations found. Try different words.</p>
          </div>
        )}
      </div>
    );
  }

  // ---------- Landing view ----------
  return (
    <div className="px-5 pt-4 space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-xl text-white">Knowledge Pills</h2>
        <p className="text-sm text-pp-text-muted mt-1">
          Quick support for what your partner is going through
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="My partner is feeling..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder:text-pp-text-muted focus:outline-none focus:border-pp-accent/50 transition-colors"
        />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pp-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-pp-accent text-pp-bg-dark text-xs font-semibold rounded-lg hover:bg-pp-accent/90 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Sample pills */}
      <div>
        <p className="text-xs text-pp-text-muted uppercase tracking-wider mb-3">
          Try a pill to see how it works
        </p>
        <div className="space-y-3">
          {samplePills.map(pill => (
            <PillCard key={pill.id} pill={pill} onSelect={handleSelectPill} />
          ))}
        </div>
      </div>
    </div>
  );
}
