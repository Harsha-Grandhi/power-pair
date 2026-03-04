'use client';

import React, { useEffect, useState } from 'react';
import { fetchRelationshipStart, setRelationshipStart } from '@/lib/coupleExtra';

interface Props {
  coupleId: string;
}

function daysSince(dateStr: string): number {
  const start = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DaysTogetherPanel({ coupleId }: Props) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputDate, setInputDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [days, setDays] = useState(0);

  useEffect(() => {
    fetchRelationshipStart(coupleId).then((d) => {
      if (d) {
        setStartDate(d);
        setDays(daysSince(d));
      }
      setLoading(false);
    });
  }, [coupleId]);

  // Recalculate at midnight
  useEffect(() => {
    if (!startDate) return;
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    const t = setTimeout(() => setDays(daysSince(startDate)), msUntilMidnight);
    return () => clearTimeout(t);
  }, [startDate]);

  const handleSave = async () => {
    if (!inputDate || saving) return;
    setSaving(true);
    const ok = await setRelationshipStart(coupleId, inputDate);
    if (ok) {
      setStartDate(inputDate);
      setDays(daysSince(inputDate));
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!startDate) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
        <div className="text-center space-y-1">
          <p className="text-2xl">💑</p>
          <p className="text-sm text-white/80 font-medium">When did you two start?</p>
          <p className="text-xs text-pp-text-muted">Add your relationship start date to start counting.</p>
        </div>
        <input
          type="date"
          value={inputDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setInputDate(e.target.value)}
          className="w-full bg-pp-card border border-white/10 rounded-xl px-4 py-2.5 text-sm
            text-white focus:outline-none focus:border-pp-accent/50"
        />
        <button
          onClick={handleSave}
          disabled={!inputDate || saving}
          className="w-full py-2.5 rounded-xl bg-pp-accent text-pp-bg-dark text-sm font-semibold
            disabled:opacity-40 active:scale-[0.98] transition-all"
        >
          {saving ? 'Saving…' : 'Start Counting ❤️'}
        </button>
      </div>
    );
  }

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-4">
      {/* Big counter */}
      <div className="text-center space-y-1">
        <p className="font-display text-6xl font-bold text-white">{days.toLocaleString()}</p>
        <p className="text-sm text-pp-text-muted">days together</p>
      </div>

      {/* Breakdown */}
      {days >= 30 && (
        <div className="flex justify-center gap-6">
          {years > 0 && (
            <div className="text-center">
              <p className="text-lg font-bold text-pp-accent">{years}</p>
              <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">
                {years === 1 ? 'year' : 'years'}
              </p>
            </div>
          )}
          {months > 0 && (
            <div className="text-center">
              <p className="text-lg font-bold text-pp-accent">{months}</p>
              <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">
                {months === 1 ? 'month' : 'months'}
              </p>
            </div>
          )}
          {remainingDays > 0 && (
            <div className="text-center">
              <p className="text-lg font-bold text-pp-accent">{remainingDays}</p>
              <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">days</p>
            </div>
          )}
        </div>
      )}

      <div className="h-px bg-white/6" />

      {/* Since date + edit */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-pp-text-muted uppercase tracking-wider">Since</p>
          <p className="text-xs text-white/70 mt-0.5">{formatDate(startDate)}</p>
        </div>
        <button
          onClick={() => { setStartDate(null); setInputDate(startDate); }}
          className="text-xs text-pp-text-muted hover:text-white transition-colors px-2 py-1"
        >
          Edit date
        </button>
      </div>
    </div>
  );
}
