'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        const pendingReveal = sessionStorage.getItem('pp_pending_reveal');
        if (pendingReveal) {
          // Go back to assessment — it will detect auth + complete answers and proceed
          router.replace('/assessment');
        } else {
          router.replace('/dashboard');
        }
      }
    });
  }, [router]);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6">
      <div className="w-20 h-20 rounded-full border-2 border-pp-accent/25 flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full border-2 border-pp-accent border-t-transparent animate-spin" />
        <span className="text-2xl">💑</span>
      </div>
      <p className="mt-6 text-sm text-pp-text-muted">Signing you in...</p>
    </main>
  );
}
