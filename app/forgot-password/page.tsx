'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await resetPassword(email, redirectTo);
    setLoading(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    setSent(true);
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
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-4xl">&#x2709;&#xFE0F;</div>
              <h2 className="font-display text-2xl text-white">Check your email</h2>
              <p className="text-sm text-pp-text-muted leading-relaxed">
                We sent a password reset link to <span className="text-white">{email}</span>.
                Click the link in the email to set a new password.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 px-6 py-3 rounded-xl bg-pp-accent text-pp-bg-dark font-semibold text-sm"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-8">
                <h1 className="font-display text-3xl text-white">Reset your password</h1>
                <p className="text-sm text-pp-text-muted">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs text-pp-text-muted mb-1.5">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm
                      placeholder:text-white/30 focus:outline-none focus:border-pp-accent/50 transition-colors"
                    placeholder="you@example.com"
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-pp-text-muted">
                Remember your password?{' '}
                <Link href="/login" className="text-pp-accent hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
