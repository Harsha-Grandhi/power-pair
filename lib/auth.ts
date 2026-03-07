import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export async function signUp(email: string, password: string): Promise<{ user: User | null; session: boolean; error: string | null }> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { user: null, session: false, error: error.message };
  // If email confirmation is disabled, Supabase returns an active session.
  // If enabled, data.session will be null.
  return { user: data.user, session: !!data.session, error: null };
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
