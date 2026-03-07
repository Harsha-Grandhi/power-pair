'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    const { error: updateError } = await updatePassword(password);
    setLoading(false);

    if (updateError) {
      setError(updateError);
      return;
    }

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
