'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    let resolved = false;

    // 1. Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setDebugInfo(prev => prev + `\nEvent: ${event}`);
      if (event === 'PASSWORD_RECOVERY' && session) {
        resolved = true;
        setReady(true);
      }
      // Also accept SIGNED_IN with a recovery type in the URL
      if (event === 'SIGNED_IN' && session && window.location.hash.includes('type=recovery')) {
        resolved = true;
        setReady(true);
      }
    });

    // 2. Check URL hash for recovery tokens and manually exchange them
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setDebugInfo(`Hash detected: ${hash.substring(0, 50)}...`);
      // Supabase should auto-detect this, but give it a moment
    } else {
      setDebugInfo('No hash tokens in URL');
    }

    // 3. Timeout — if nothing fires after 8 seconds, it's expired
    const timeout = setTimeout(() => {
      if (!resolved) {
        // One last check — maybe the session was set without the event
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session && !resolved) {
            resolved = true;
            setReady(true);
          } else if (!resolved) {
            setExpired(true);
          }
        });
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    // Verify we have a session before attempting update
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      setError('No active session. The reset link may have expired. Please request a new one.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    // Sign out so user can log in with the new password
    await supabase.auth.signOut();
    setSuccess(true);
    setTimeout(() => router.replace('/login'), 2000);
  };

  return (
    <main className="relative min-h-dvh flex flex-col overflow-hidden bg-pp-bg-dark">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-pp-primary/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-pp-secondary/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col min-h-dvh max-w-lg mx-auto w-full px-6">
        <header className="flex items-center gap-2 pt-12 pb-4">
          <div className="w-8 h-8 rounded-lg bg-pp-accent/15 border border-pp-accent/30 flex items-center justify-center">
            <span className="text-sm">&#x1F491;</span>
          </div>
          <span className="font-display text-lg text-white font-semibold tracking-tight">
            Power Pair
          </span>
        </header>

        <section className="flex-1 flex flex-col justify-center py-12">
          {success ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">&#x2705;</div>
              <h2 className="font-display text-2xl text-white">Password updated</h2>
              <p className="text-sm text-pp-text-muted">Redirecting you to login...</p>
            </div>
          ) : !ready && !expired ? (
            <div className="text-center space-y-4">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
              <p className="text-sm text-pp-text-muted">Verifying your reset link...</p>
              {debugInfo && (
                <p className="text-[10px] text-pp-text-muted/40 mt-4 break-all">{debugInfo}</p>
              )}
            </div>
          ) : expired && !ready ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">&#x26A0;&#xFE0F;</div>
              <h2 className="font-display text-2xl text-white">Link expired or invalid</h2>
              <p className="text-sm text-pp-text-muted leading-relaxed">
                This reset link may have expired. Please request a new one.
              </p>
              {debugInfo && (
                <p className="text-[10px] text-pp-text-muted/40 mt-4 break-all">{debugInfo}</p>
              )}
              <Link
                href="/forgot-password"
                className="inline-block mt-4 px-6 py-3 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-8">
                <h1 className="font-display text-3xl text-white">Set new password</h1>
                <p className="text-sm text-pp-text-muted">
                  Enter your new password below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-xs text-pp-text-muted mb-1.5">New Password</label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      placeholder:text-white/30 focus:outline-none focus:border-pp-accent/50 transition-colors"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs text-pp-text-muted mb-1.5">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      placeholder:text-white/30 focus:outline-none focus:border-pp-accent/50 transition-colors"
                    placeholder="Re-enter new password"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm
                    hover:bg-pp-accent/90 active:scale-[0.98] transition-all duration-200 shadow-glow-accent
                    disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
