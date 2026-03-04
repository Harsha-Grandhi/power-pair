'use client';

import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import {
  Challenge,
  ChallengeStatus,
  fetchChallengesForCouple,
  createChallenge,
  updateChallengeStatus,
} from '@/lib/challenges';

interface Props {
  coupleId: string;
  currentProfile: UserProfile;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_LABELS: Record<ChallengeStatus, { label: string; color: string }> = {
  active:  { label: 'Active',    color: 'text-pp-accent border-pp-accent/30 bg-pp-accent/10' },
  won:     { label: 'Won 🏆',    color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' },
  lost:    { label: 'Lost 😤',   color: 'text-red-400 border-red-400/30 bg-red-400/10' },
};

export default function ChallengesPanel({ coupleId, currentProfile }: Props) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [winPrize, setWinPrize] = useState('');
  const [losePunishment, setLosePunishment] = useState('');
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const authorName = currentProfile.introContext.name ?? 'You';
  const authorId = currentProfile.id;

  useEffect(() => {
    fetchChallengesForCouple(coupleId).then((data) => {
      setChallenges(data);
      setLoading(false);
    });
  }, [coupleId]);

  const handleCreate = async () => {
    if (!challengeText.trim() || !winPrize.trim() || !losePunishment.trim() || saving) return;
    setSaving(true);

    const created = await createChallenge(
      coupleId,
      authorId,
      authorName,
      challengeText.trim(),
      winPrize.trim(),
      losePunishment.trim()
    );

    if (created) {
      setChallenges((prev) => [created, ...prev]);
      setChallengeText('');
      setWinPrize('');
      setLosePunishment('');
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleStatusUpdate = async (id: string, status: ChallengeStatus) => {
    setUpdatingId(id);
    const ok = await updateChallengeStatus(id, status);
    if (ok) {
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Create challenge button / form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-2xl border border-pp-accent/30 bg-pp-accent/8
            text-pp-accent text-sm font-semibold hover:bg-pp-accent/15 transition-colors
            active:scale-[0.98]"
        >
          ⚡ Send a Challenge
        </button>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">New Challenge</p>

          <div className="space-y-2">
            <textarea
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="What's the challenge? e.g. No phone for a whole day"
              rows={3}
              className="w-full bg-transparent text-sm text-white/85 placeholder:text-pp-text-muted
                resize-none focus:outline-none leading-relaxed border-b border-white/8 pb-2"
            />

            <div className="flex items-start gap-2 pt-1">
              <span className="text-base mt-1.5">🏆</span>
              <div className="flex-1">
                <p className="text-[10px] text-pp-text-muted uppercase tracking-wider mb-1">If they win</p>
                <input
                  type="text"
                  value={winPrize}
                  onChange={(e) => setWinPrize(e.target.value)}
                  placeholder="e.g. Back massage, dinner of their choice…"
                  className="w-full bg-transparent text-sm text-white/85 placeholder:text-pp-text-muted
                    focus:outline-none"
                />
              </div>
            </div>

            <div className="h-px bg-white/6" />

            <div className="flex items-start gap-2">
              <span className="text-base mt-1.5">😈</span>
              <div className="flex-1">
                <p className="text-[10px] text-pp-text-muted uppercase tracking-wider mb-1">If they lose</p>
                <input
                  type="text"
                  value={losePunishment}
                  onChange={(e) => setLosePunishment(e.target.value)}
                  placeholder="e.g. Do all chores for a week…"
                  className="w-full bg-transparent text-sm text-white/85 placeholder:text-pp-text-muted
                    focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1 border-t border-white/6">
            <button
              onClick={() => { setShowForm(false); setChallengeText(''); setWinPrize(''); setLosePunishment(''); }}
              className="flex-1 py-2 rounded-xl border border-white/10 text-xs text-pp-text-muted
                hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!challengeText.trim() || !winPrize.trim() || !losePunishment.trim() || saving}
              className="flex-1 py-2 rounded-xl bg-pp-accent text-pp-bg-dark text-xs font-semibold
                disabled:opacity-40 transition-opacity active:scale-[0.97]"
            >
              {saving ? 'Sending…' : 'Send Challenge ⚡'}
            </button>
          </div>
        </div>
      )}

      {/* Challenges list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-pp-text-muted">No challenges yet. Send the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Past Challenges</p>
          {challenges.map((c) => {
            const badge = STATUS_LABELS[c.status];
            const isMe = c.challenger_id === authorId;
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs text-pp-text-muted">
                        {isMe ? 'You challenged' : `${c.challenger_name} challenged you`}
                      </span>
                      <span className="text-pp-text-muted/30 text-[10px]">·</span>
                      <span className="text-[10px] text-pp-text-muted/50">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-white/90 font-medium leading-snug">
                      {c.challenge_text}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Stakes */}
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl bg-pp-card/60 border border-emerald-400/15 px-3 py-2">
                    <p className="text-[10px] text-pp-text-muted uppercase tracking-wider mb-0.5">Win 🏆</p>
                    <p className="text-xs text-white/80">{c.win_prize}</p>
                  </div>
                  <div className="flex-1 rounded-xl bg-pp-card/60 border border-red-400/15 px-3 py-2">
                    <p className="text-[10px] text-pp-text-muted uppercase tracking-wider mb-0.5">Lose 😈</p>
                    <p className="text-xs text-white/80">{c.lose_punishment}</p>
                  </div>
                </div>

                {/* Outcome buttons — only show when active */}
                {c.status === 'active' && (
                  <div className="flex gap-2">
                    <button
                      disabled={updatingId === c.id}
                      onClick={() => handleStatusUpdate(c.id, 'won')}
                      className="flex-1 py-1.5 rounded-xl border border-emerald-400/30 text-emerald-400
                        text-xs font-semibold hover:bg-emerald-400/10 transition-colors disabled:opacity-40"
                    >
                      Mark Won 🏆
                    </button>
                    <button
                      disabled={updatingId === c.id}
                      onClick={() => handleStatusUpdate(c.id, 'lost')}
                      className="flex-1 py-1.5 rounded-xl border border-red-400/30 text-red-400
                        text-xs font-semibold hover:bg-red-400/10 transition-colors disabled:opacity-40"
                    >
                      Mark Lost 😤
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
