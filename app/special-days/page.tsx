'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import SpecialDaysPanel from '@/components/home/SpecialDaysPanel';

export default function SpecialDaysPage() {
  const router = useRouter();
  const { state } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && !state.profile) router.replace('/');
  }, [mounted, state.profile, router]);

  if (!mounted || !state.profile || !state.coupleId) return null;

  return (
    <main className="min-h-dvh bg-pp-bg-dark">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-400/8 blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 rounded-full bg-pp-secondary/8 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center
              justify-center text-pp-text-muted hover:text-white transition-colors"
          >
            ←
          </button>
          <span className="text-lg">🗓</span>
          <span className="font-display text-base text-white font-semibold">Special Days</span>
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-5 py-6">
        <SpecialDaysPanel coupleId={state.coupleId} />
      </div>
    </main>
  );
}
