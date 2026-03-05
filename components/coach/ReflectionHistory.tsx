'use client';

import React, { useEffect, useState } from 'react';
import {
  fetchReflections,
  fetchPartnerMessages,
  updateMessageStatus,
  Reflection,
  PartnerMessage,
} from '@/lib/reflections';

interface ReflectionHistoryProps {
  userId: string;
  coupleId: string | null;
}

const EMOTION_EMOJI: Record<string, string> = {
  Angry: '\uD83D\uDE21',
  Hurt: '\uD83D\uDE22',
  Sad: '\uD83D\uDE1E',
  Disappointed: '\uD83D\uDE14',
  Frustrated: '\uD83D\uDE24',
  Ignored: '\uD83D\uDE36',
  Jealous: '\uD83D\uDE12',
  Lonely: '\uD83E\uDD79',
  Confused: '\uD83D\uDE15',
  Overwhelmed: '\uD83E\uDD2F',
};

type Tab = 'mine' | 'partner';

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ReflectionHistory({ userId, coupleId }: ReflectionHistoryProps) {
  const [tab, setTab] = useState<Tab>('mine');
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [partnerMessages, setPartnerMessages] = useState<PartnerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [refs, msgs] = await Promise.all([
        fetchReflections(userId),
        coupleId ? fetchPartnerMessages(coupleId) : Promise.resolve([]),
      ]);
      setReflections(refs);
      setPartnerMessages(msgs);
      setLoading(false);
    }
    load();
  }, [userId, coupleId]);

  const incomingMessages = partnerMessages.filter(m => m.sender_id !== userId && m.type === 'reflection_share');
  const unreadCount = incomingMessages.filter(m => m.status === 'unread').length;

  const handleAcknowledge = async (msgId: string) => {
    await updateMessageStatus(msgId, 'acknowledged');
    setPartnerMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'acknowledged' } : m));
  };

  const handleReply = async (msgId: string) => {
    if (!replyText.trim()) return;
    await updateMessageStatus(msgId, 'replied', replyText.trim());
    setPartnerMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'replied' } : m));
    setReplyText('');
    setReplyingTo(null);
  };

  const handleTalkLater = async (msgId: string) => {
    await updateMessageStatus(msgId, 'talk_later');
    setPartnerMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: 'talk_later' } : m));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-10 h-10 border-2 border-pp-accent/30 border-t-pp-accent rounded-full animate-spin" />
        <p className="text-sm text-pp-text-muted">Loading reflections...</p>
      </div>
    );
  }

  const hasNoData = reflections.length === 0 && incomingMessages.length === 0;

  if (hasNoData) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-pp-card border border-pp-accent/25 flex items-center justify-center">
          <span className="text-3xl">{'\uD83E\uDDD8'}</span>
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-xl text-white">No Reflections Yet</h3>
          <p className="text-sm text-pp-text-muted leading-relaxed">
            Use the pause button {'\u23F8\uFE0F'} whenever you need a moment. Your emotional check-ins and reflections will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-4">
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-display text-xl text-white mb-1">Emotional Journal</h2>
        <p className="text-xs text-pp-text-muted">Your reflections and partner messages</p>
      </div>

      {/* Tabs */}
      {coupleId && incomingMessages.length > 0 && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('mine')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === 'mine'
                ? 'bg-pp-accent text-pp-bg-dark'
                : 'bg-pp-card border border-white/10 text-pp-text-muted'
            }`}
          >
            My Reflections
          </button>
          <button
            onClick={() => setTab('partner')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all relative ${
              tab === 'partner'
                ? 'bg-pp-accent text-pp-bg-dark'
                : 'bg-pp-card border border-white/10 text-pp-text-muted'
            }`}
          >
            From Partner
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* My Reflections */}
      {tab === 'mine' && (
        <div className="space-y-3">
          {reflections.map(r => {
            const isExpanded = expandedId === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="bg-pp-card border border-white/8 rounded-2xl p-4 cursor-pointer transition-all hover:border-white/15"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{EMOTION_EMOJI[r.emotion] || '\uD83D\uDCAD'}</span>
                    <span className="text-sm font-medium text-white">{r.emotion}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-pp-text-muted capitalize">
                      {r.mode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.shared_with_partner && (
                      <span className="text-[10px] text-pp-accent">{'\uD83D\uDC8C'} Shared</span>
                    )}
                    <span className="text-[10px] text-pp-text-muted">{timeAgo(r.timestamp)}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-white/80 leading-relaxed">{r.ai_summary}</p>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/8 space-y-2">
                    <div>
                      <span className="text-[10px] text-pp-text-muted uppercase tracking-wider">What you said</span>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">{r.raw_text}</p>
                    </div>
                    {r.post_reset_feeling && (
                      <div>
                        <span className="text-[10px] text-pp-text-muted uppercase tracking-wider">After reset</span>
                        <p className="text-xs text-white/60 mt-1">{r.post_reset_feeling}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Partner Messages */}
      {tab === 'partner' && (
        <div className="space-y-3">
          {incomingMessages.map(msg => (
            <div
              key={msg.id}
              className={`bg-pp-card border rounded-2xl p-4 transition-all ${
                msg.status === 'unread' ? 'border-pp-accent/40' : 'border-white/8'
              }`}
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">Partner shared a reflection</span>
                  {msg.status === 'unread' && (
                    <span className="w-2 h-2 rounded-full bg-pp-accent animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-pp-text-muted">{timeAgo(msg.timestamp)}</span>
              </div>

              <p className="text-sm text-white/80 leading-relaxed mb-3">{msg.message}</p>

              {/* Action buttons for unread messages */}
              {msg.status === 'unread' && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleAcknowledge(msg.id); }}
                    className="flex-1 py-2 rounded-xl bg-pp-accent/15 text-pp-accent text-xs font-medium hover:bg-pp-accent/25 transition-colors"
                  >
                    {'\uD83E\uDD0D'} Acknowledge
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setReplyingTo(msg.id); }}
                    className="flex-1 py-2 rounded-xl bg-white/5 text-white/70 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    {'\uD83D\uDCAC'} Reply
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTalkLater(msg.id); }}
                    className="flex-1 py-2 rounded-xl bg-white/5 text-white/70 text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    {'\u23F0'} Later
                  </button>
                </div>
              )}

              {/* Status display for handled messages */}
              {msg.status !== 'unread' && (
                <span className="text-[10px] text-pp-text-muted capitalize">
                  {msg.status === 'acknowledged' ? '\u2705 Acknowledged' :
                   msg.status === 'replied' ? '\uD83D\uDCAC Replied' :
                   '\u23F0 Talk later'}
                </span>
              )}

              {/* Reply input */}
              {replyingTo === msg.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-pp-text-muted/50 focus:outline-none focus:border-pp-accent/40"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleReply(msg.id); }}
                  />
                  <button
                    onClick={() => handleReply(msg.id)}
                    className="px-4 py-2 rounded-xl bg-pp-accent text-pp-bg-dark text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
