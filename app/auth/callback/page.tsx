'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // No longer needed for OAuth. Redirect to dashboard.
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center bg-pp-bg-dark px-6">
      <p className="text-sm text-pp-text-muted">Redirecting...</p>
    </main>
  );
}
