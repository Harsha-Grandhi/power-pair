'use client';

import React, { useEffect, useState } from 'react';
import {
  SpecialDay,
  fetchSpecialDays,
  createSpecialDay,
  deleteSpecialDay,
  daysUntil,
} from '@/lib/specialDays';

interface Props {
  coupleId: string;
}

function countdownLabel(n: number): { text: string; color: string } {
  if (n < 0) return { text: 'Passed', color: 'text-pp-text-muted' };
  if (n === 0) return { text: "Today! 🎉", color: 'text-emerald-400' };
  if (n === 1) return { text: 'Tomorrow!', color: 'text-pp-accent' };
  if (n <= 7) return { text: `In ${n} days`, color: 'text-pp-accent' };
  if (n <= 30) return { text: `In ${n} days`, color: 'text-white/70' };
  return { text: `In ${n} days`, color: 'text-pp-text-muted' };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function SpecialDaysPanel({ coupleId }: Props) {
  const [days, setDays] = useState<SpecialDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [saving, setSaving] = useState(false);
  const currentYear = new Date().getFullYear();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecialDays(coupleId).then((d) => {
      setDays(d);
      setLoading(false);
    });
  }, [coupleId]);

  const selectedDate = month && day
    ? `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    : '';

  const daysInMonth = month
    ? new Date(currentYear, parseInt(month), 0).getDate()
    : 31;

  const handleAdd = async () => {
    if (!title.trim() || !selectedDate || saving) return;
    setSaving(true);
    const created = await createSpecialDay(coupleId, title.trim(), selectedDate);
    if (created) {
      setDays((prev) =>
        [...prev, created].sort((a, b) => a.date.localeCompare(b.date))
      );
      setTitle('');
      setMonth('');
      setDay('');
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const ok = await deleteSpecialDay(id);
    if (ok) setDays((prev) => prev.filter((d) => d.id !== id));
    setDeletingId(null);
  };

  // Separate upcoming vs past
  const upcoming = days.filter((d) => daysUntil(d.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));
  const past = days.filter((d) => daysUntil(d.date) < 0).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-3 pt-1">
      {/* Add button / form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl border border-purple-400/30 bg-purple-400/8
            text-purple-300 text-sm font-semibold hover:bg-purple-400/15 transition-colors
            active:scale-[0.98]"
        >
          ✦ Add a Special Day
        </button>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">New Special Day</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Anniversary, Her Birthday, Our Trip…"
            className="w-full bg-transparent text-sm text-white/85 placeholder:text-pp-text-muted
              focus:outline-none border-b border-white/8 pb-2"
          />
          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); setDay(''); }}
              className="flex-1 bg-pp-card border border-white/10 rounded-xl px-3 py-2 text-sm
                text-white focus:outline-none focus:border-pp-accent/50 appearance-none"
            >
              <option value="" disabled>Month</option>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => (
                <option key={i + 1} value={String(i + 1)}>{m}</option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              disabled={!month}
              className="flex-1 bg-pp-card border border-white/10 rounded-xl px-3 py-2 text-sm
                text-white focus:outline-none focus:border-pp-accent/50 appearance-none
                disabled:opacity-40"
            >
              <option value="" disabled>Day</option>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setTitle(''); setMonth(''); setDay(''); }}
              className="flex-1 py-2 rounded-xl border border-white/10 text-xs text-pp-text-muted
                hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!title.trim() || !selectedDate || saving}
              className="flex-1 py-2 rounded-xl bg-pp-accent text-pp-bg-dark text-xs font-semibold
                disabled:opacity-40 active:scale-[0.97] transition-all"
            >
              {saving ? 'Saving…' : 'Add Day ✦'}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
        </div>
      )}

      {/* Upcoming */}
      {!loading && upcoming.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Upcoming</p>
          {upcoming.map((d) => {
            const n = daysUntil(d.date);
            const { text, color } = countdownLabel(n);
            return (
              <div
                key={d.id}
                className="rounded-2xl border border-white/8 bg-white/3 p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20
                  flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🗓</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 font-medium leading-tight">{d.title}</p>
                  <p className="text-xs text-pp-text-muted mt-0.5">{formatDate(d.date)}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`text-xs font-semibold ${color}`}>{text}</span>
                  <button
                    onClick={() => handleDelete(d.id)}
                    disabled={deletingId === d.id}
                    className="text-[10px] text-pp-text-muted/50 hover:text-red-400 transition-colors"
                  >
                    remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past */}
      {!loading && past.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Past</p>
          {past.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-white/5 bg-white/2 p-4 flex items-center gap-3 opacity-60"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8
                flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🗓</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 font-medium leading-tight">{d.title}</p>
                <p className="text-xs text-pp-text-muted mt-0.5">{formatDate(d.date)}</p>
              </div>
              <button
                onClick={() => handleDelete(d.id)}
                disabled={deletingId === d.id}
                className="text-[10px] text-pp-text-muted/40 hover:text-red-400 transition-colors flex-shrink-0"
              >
                remove
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && days.length === 0 && !showForm && (
        <div className="text-center py-6">
          <p className="text-sm text-pp-text-muted">No special days yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}
