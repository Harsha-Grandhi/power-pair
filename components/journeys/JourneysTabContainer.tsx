'use client';

import React from 'react';
import { Journey } from '@/lib/journeys';
import { JourneyEnrollment } from '@/lib/journeyProgress';
import JourneyListView from './JourneyListView';

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
  onSelectJourney,
}: JourneysTabContainerProps) {
  return (
    <JourneyListView
      enrollments={enrollments}
      coupleId={coupleId}
      onSelect={onSelectJourney}
    />
  );
}
