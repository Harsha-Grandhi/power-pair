'use client';

import React, { useState } from 'react';
import { Journey } from '@/lib/journeys';
import { JourneyEnrollment } from '@/lib/journeyProgress';
import JourneyListView from './JourneyListView';
import KnowledgePillsContainer from '@/components/knowledge-pills/KnowledgePillsContainer';

type JourneysTab = 'knowledge-pills' | 'relationship-journeys';

interface JourneysTabContainerProps {
  enrollments: JourneyEnrollment[];
  coupleId: string | null;
  userId: string;
  partnerArchetypeCode: string | null;
  onSelectJourney: (journey: Journey) => void;
}

export default function JourneysTabContainer({
  enrollments,
  coupleId,
  partnerArchetypeCode,
  onSelectJourney,
}: JourneysTabContainerProps) {
  const [activeTab, setActiveTab] = useState<JourneysTab>('knowledge-pills');

  return (
    <div>
      {/* Tab bar */}
      <div className="sticky top-[53px] z-20 bg-pp-bg-dark/95 backdrop-blur-sm border-b border-white/6 px-5 pt-3 pb-0">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('knowledge-pills')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'knowledge-pills'
                ? 'bg-pp-accent text-pp-bg-dark'
                : 'text-pp-text-muted hover:text-white/70'
            }`}
          >
            Knowledge Pills
          </button>
          <button
            onClick={() => setActiveTab('relationship-journeys')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'relationship-journeys'
                ? 'bg-pp-accent text-pp-bg-dark'
                : 'text-pp-text-muted hover:text-white/70'
            }`}
          >
            Relationship Journeys
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'knowledge-pills' ? (
        <KnowledgePillsContainer partnerArchetypeCode={partnerArchetypeCode} />
      ) : (
        <JourneyListView
          enrollments={enrollments}
          coupleId={coupleId}
          onSelect={onSelectJourney}
        />
      )}
    </div>
  );
}
