'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchDateById, updateDate, uploadDatePhoto, getSignedPhotoUrls, DateRecord } from '@/lib/dates';

export default function DateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dateId = typeof params.dateId === 'string' ? params.dateId : '';

  const [date, setDate] = useState<DateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dateId) { setLoading(false); return; }
    fetchDateById(dateId).then(async (d) => {
      setDate(d);
      setNotes(d?.notes ?? '');
      if (d?.photo_urls?.length) {
        const urls = await getSignedPhotoUrls(d.photo_urls);
        setSignedUrls(urls);
      }
      setLoading(false);
    });
  }, [dateId]);

  const handleSaveNotes = async () => {
    if (!date || saving) return;
    setSaving(true);
    await updateDate(dateId, { notes });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !date) return;
    setUploading(true);
    const path = await uploadDatePhoto(dateId, file);
    if (path) {
      const updatedPaths = [...(date.photo_urls ?? []), path];
      await updateDate(dateId, { photo_urls: updatedPaths });
      setDate({ ...date, photo_urls: updatedPaths });
      // Generate a signed URL so the new photo displays immediately
      const [newSignedUrl] = await getSignedPhotoUrls([path]);
      if (newSignedUrl) setSignedUrls((prev) => [...prev, newSignedUrl]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleComplete = async () => {
    if (!date || completing) return;
    setCompleting(true);
    await updateDate(dateId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    setDate({ ...date, status: 'completed', completed_at: new Date().toISOString() });
    setCompleting(false);
  };

  if (loading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-pp-bg-dark">
        <div className="w-8 h-8 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!date) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6 gap-4 text-center">
        <div className="text-4xl">🔍</div>
        <p className="text-white font-display text-xl">Date not found</p>
        <button onClick={() => router.push('/dashboard?tab=wheel')} className="text-sm text-pp-text-muted hover:text-white transition-colors">
          ← Back to home
        </button>
      </main>
    );
  }

  const isCompleted = date.status === 'completed';

  return (
    <main className="relative min-h-dvh bg-pp-bg-dark overflow-x-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-pp-accent/8 blur-3xl" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-pp-bg-dark/90 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard?tab=wheel')}
            className="text-pp-text-muted hover:text-white transition-colors text-sm"
          >
            ←
          </button>
          <span className="font-display text-base text-white font-semibold">Date Details</span>
          {isCompleted && (
            <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              ✓ Completed
            </span>
          )}
        </div>
      </header>

      <div className="relative z-10 max-w-lg mx-auto px-5 pb-12 space-y-5 pt-5">
        {/* Date idea card */}
        <div className="p-5 rounded-2xl border border-pp-accent/30 bg-pp-accent/8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-pp-accent uppercase tracking-widest font-medium">Date Idea</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full border border-white/15 text-pp-text-muted">
              {date.duration}
            </span>
          </div>
          <p className="font-display text-xl text-white leading-snug">{date.date_idea}</p>
          <p className="text-xs text-pp-text-muted">
            Added {new Date(date.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Photos */}
        <section className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Photos</p>

          {signedUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {signedUrls.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Date photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-3 rounded-xl border border-dashed border-white/20 text-sm text-pp-text-muted
              hover:border-white/40 hover:text-white transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : '📷 Add Photo'}
          </button>
        </section>

        {/* Notes */}
        <section className="rounded-2xl border border-white/8 bg-white/3 p-4 space-y-3">
          <p className="text-xs text-pp-text-muted uppercase tracking-widest">Write about this date</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it go? What made it special…"
            rows={5}
            className="w-full bg-transparent text-sm text-white/85 placeholder:text-white/25
              resize-none focus:outline-none leading-relaxed"
          />
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className={`text-xs px-4 py-2 rounded-xl border transition-all ${
              saved
                ? 'border-emerald-400/40 text-emerald-400'
                : 'border-pp-secondary/40 text-pp-secondary hover:border-pp-secondary/70 hover:text-white'
            }`}
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save notes'}
          </button>
        </section>

        {/* Mark complete */}
        {!isCompleted && (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400
              font-medium text-sm hover:bg-emerald-500/20 transition-all active:scale-[0.98]
              disabled:opacity-50"
          >
            {completing ? 'Saving…' : '✓ Mark as Completed'}
          </button>
        )}

        <button
          onClick={() => router.push('/dashboard?tab=wheel')}
          className="w-full py-3 text-sm text-pp-text-muted hover:text-white transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </main>
  );
}
