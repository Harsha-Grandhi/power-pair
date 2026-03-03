'use client';

import React from 'react';

export type AppTab = 'home' | 'wheel' | 'journeys' | 'counselor';

interface BottomNavProps {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}

const TABS: { id: AppTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    id: 'wheel',
    label: 'Spin',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <line x1="12" y1="3" x2="12" y2="10" strokeLinecap="round" />
        <line x1="12" y1="14" x2="12" y2="21" strokeLinecap="round" />
        <line x1="3" y1="12" x2="10" y2="12" strokeLinecap="round" />
        <line x1="14" y1="12" x2="21" y2="12" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'journeys',
    label: 'Journeys',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: 'counselor',
    label: 'AI Coach',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-pp-bg-dark/95 backdrop-blur-md border-t border-white/8">
      <div className="max-w-lg mx-auto px-2 flex items-stretch">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-200 focus:outline-none ${
                active ? 'text-pp-accent' : 'text-pp-text-muted hover:text-white/60'
              }`}
            >
              {tab.icon}
              <span className={`text-[10px] font-medium tracking-wide ${active ? 'text-pp-accent' : ''}`}>
                {tab.label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-6 h-0.5 rounded-full bg-pp-accent" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
