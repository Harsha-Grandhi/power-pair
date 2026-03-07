import { useEffect, useRef } from 'react';

type ChangeCallback = () => void;

/**
 * Subscribe to Supabase Realtime changes on couple-related tables.
 * Calls `onChange` whenever any of the watched tables change for this coupleId.
 */
export function useCoupleRealtime(coupleId: string | null, onChange: ChangeCallback) {
  const callbackRef = useRef(onChange);
  callbackRef.current = onChange;

  useEffect(() => {
    if (!coupleId) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;

    async function subscribe() {
      const { supabase } = await import('./supabase');

      channel = supabase
        .channel(`couple-${coupleId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'power_pair_prompt_answers', filter: `couple_id=eq.${coupleId}` },
          () => callbackRef.current()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'power_pair_special_days', filter: `couple_id=eq.${coupleId}` },
          () => callbackRef.current()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'power_pair_challenges', filter: `couple_id=eq.${coupleId}` },
          () => callbackRef.current()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'power_pair_dates', filter: `couple_id=eq.${coupleId}` },
          () => callbackRef.current()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'power_pair_couples', filter: `id=eq.${coupleId}` },
          () => callbackRef.current()
        )
        .subscribe();
    }

    subscribe();

    return () => {
      if (channel) {
        import('./supabase').then(({ supabase }) => {
          supabase.removeChannel(channel);
        });
      }
    };
  }, [coupleId]);
}
