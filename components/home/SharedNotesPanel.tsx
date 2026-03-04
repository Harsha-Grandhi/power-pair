'use client';

import React, { useEffect, useRef, useState } from 'react';
import { UserProfile } from '@/types';
import {
  SharedNote,
  fetchNotesForCouple,
  createNote,
  uploadNotePhoto,
  getSignedNotePhotoUrls,
} from '@/lib/notes';

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

interface NoteWithUrls extends SharedNote {
  signedUrls?: string[];
}

export default function SharedNotesPanel({ coupleId, currentProfile }: Props) {
  const [notes, setNotes] = useState<NoteWithUrls[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const authorName = currentProfile.introContext.name ?? 'You';
  const authorId = currentProfile.id;

  // Load notes + resolve signed URLs
  useEffect(() => {
    fetchNotesForCouple(coupleId).then(async (raw) => {
      const withUrls = await Promise.all(
        raw.map(async (n) => {
          if (n.photo_urls.length === 0) return { ...n, signedUrls: [] };
          const signedUrls = await getSignedNotePhotoUrls(n.photo_urls);
          return { ...n, signedUrls };
        })
      );
      setNotes(withUrls);
      setLoading(false);
    });
  }, [coupleId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setPendingFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const url = URL.createObjectURL(f);
      setPendingPreviews((prev) => [...prev, url]);
    });
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const removePending = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
    setPendingPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if ((!text.trim() && pendingFiles.length === 0) || saving) return;
    setSaving(true);

    // Use a temp ID for photo paths; after create we update them
    const tempId = `${coupleId}-${Date.now()}`;
    const photoPaths: string[] = [];

    for (const file of pendingFiles) {
      const path = await uploadNotePhoto(tempId, file);
      if (path) photoPaths.push(path);
    }

    const newNote = await createNote(
      coupleId,
      authorId,
      authorName,
      text.trim(),
      photoPaths
    );

    if (newNote) {
      const signedUrls =
        photoPaths.length > 0 ? await getSignedNotePhotoUrls(photoPaths) : [];
      setNotes((prev) => [{ ...newNote, signedUrls }, ...prev]);
    }

    // Cleanup
    pendingPreviews.forEach((url) => URL.revokeObjectURL(url));
    setText('');
    setPendingFiles([]);
    setPendingPreviews([]);
    setSaving(false);
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Compose box */}
      <div className="rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note to your partner…"
          rows={3}
          className="w-full bg-transparent text-sm text-white/85 placeholder:text-pp-text-muted
            resize-none focus:outline-none leading-relaxed"
        />

        {/* Pending photo previews */}
        {pendingPreviews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pendingPreviews.map((url, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removePending(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60
                    flex items-center justify-center text-white text-[10px]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1 border-t border-white/6">
          {/* Photo picker */}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10
              text-xs text-pp-text-muted hover:text-white hover:border-white/20 transition-colors"
          >
            📷 <span>Photo</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            onClick={handleSave}
            disabled={(!text.trim() && pendingFiles.length === 0) || saving}
            className="ml-auto px-4 py-1.5 rounded-xl bg-pp-accent text-pp-bg-dark text-xs
              font-semibold disabled:opacity-40 transition-opacity active:scale-[0.97]"
          >
            {saving ? 'Saving…' : 'Save Note'}
          </button>
        </div>
      </div>

      {/* Notes feed */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-pp-text-muted">No notes yet. Write the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const isMe = note.author_id === authorId;
            return (
              <div
                key={note.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar bubble */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs
                    font-bold flex-shrink-0 mt-1"
                  style={{
                    background: isMe
                      ? 'linear-gradient(135deg, #F6B17A40, #F6B17A20)'
                      : 'linear-gradient(135deg, #7077A140, #7077A120)',
                    border: isMe ? '1px solid #F6B17A40' : '1px solid #7077A140',
                    color: isMe ? '#F6B17A' : '#7077A1',
                  }}
                >
                  {note.author_name.charAt(0).toUpperCase()}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`flex items-center gap-1.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-pp-text-muted font-medium">
                      {isMe ? 'You' : note.author_name}
                    </span>
                    <span className="text-[10px] text-pp-text-muted/50">{timeAgo(note.created_at)}</span>
                  </div>

                  {/* Note content */}
                  {note.content && (
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                        ${isMe
                          ? 'bg-pp-accent/15 border border-pp-accent/25 text-white/90 rounded-tr-sm'
                          : 'bg-white/5 border border-white/8 text-white/80 rounded-tl-sm'
                        }`}
                    >
                      {note.content}
                    </div>
                  )}

                  {/* Photos */}
                  {note.signedUrls && note.signedUrls.length > 0 && (
                    <div className={`flex flex-wrap gap-1.5 ${isMe ? 'justify-end' : ''}`}>
                      {note.signedUrls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer"
                          className="block w-28 h-28 rounded-xl overflow-hidden border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
