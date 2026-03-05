'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import PauseModal from './PauseModal';

export default function PauseButton() {
  const [open, setOpen] = useState(false);
  const { state } = useApp();

  // Only show on dashboard (when user has a profile)
  if (!state.profile) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 z-40 w-14 h-14 rounded-full bg-pp-card border-2 border-pp-accent/40
          flex items-center justify-center shadow-lg shadow-pp-accent/20
          hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Pause and reset"
      >
        <span className="text-2xl">{'\u23F8\uFE0F'}</span>
      </button>

      <PauseModal
        open={open}
        onClose={() => setOpen(false)}
        userId={state.profile.id}
        coupleId={state.coupleId ?? null}
      />
    </>
  );
}
