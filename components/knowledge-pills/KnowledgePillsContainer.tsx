'use client';

import React, { useState } from 'react';
import {
  SituationCard,
  Bucket,
  getAllSituations,
  getCardForSituation,
} from '@/lib/firstAidService';
import PillCard from './PillCard';
import PillDetailView from './PillDetailView';

interface KnowledgePillsContainerProps {
  partnerArchetypeCode: string | null;
}

export default function KnowledgePillsContainer({ partnerArchetypeCode }: KnowledgePillsContainerProps) {
  const [selectedSituation, setSelectedSituation] = useState<SituationCard | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);

  const allSituations = getAllSituations();

  const handleSelectSituation = (situation: SituationCard) => {
    const bucket = getCardForSituation(situation.situation_id, partnerArchetypeCode);
    setSelectedSituation(situation);
    setSelectedBucket(bucket);
  };

  const handleBack = () => {
    setSelectedSituation(null);
    setSelectedBucket(null);
  };

  // ---------- Detail view ----------
  if (selectedSituation && selectedBucket) {
    return (
      <div className="px-5 pt-4">
        <PillDetailView
          situationText={selectedSituation.situation}
          bucket={selectedBucket}
          onBack={handleBack}
        />
      </div>
    );
  }

  // ---------- All situations ----------
  return (
    <div className="px-5 pt-4 space-y-6">
      <div>
        <h2 className="font-display text-xl text-white">Knowledge Pills</h2>
        <p className="text-sm text-pp-text-muted mt-1">
          Quick support for what your partner is going through
        </p>
      </div>

      <div className="space-y-3">
        {allSituations.map(s => (
          <PillCard key={s.situation_id} situation={s} onSelect={handleSelectSituation} />
        ))}
      </div>
    </div>
  );
}
