import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Single shared Supabase client (browser-safe, uses the anon/public key).
 * Server-side API routes can import this same client.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
