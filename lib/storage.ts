import { UserProfile, AppState } from '@/types';

const PROFILE_KEY = 'pp_profile_v1';
const STATE_KEY = 'pp_state_v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ─── Profile persistence ───────────────────────────────────────────────────────

export function saveProfile(profile: UserProfile): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('[PowerPair] Failed to save profile:', e);
  }
}

export function loadProfile(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch (e) {
    console.error('[PowerPair] Failed to load profile:', e);
    return null;
  }
}

// ─── App state persistence ─────────────────────────────────────────────────────

export function saveAppState(state: Partial<AppState>): void {
  if (!isBrowser()) return;
  try {
    const existing = loadAppState() ?? {};
    localStorage.setItem(STATE_KEY, JSON.stringify({ ...existing, ...state }));
  } catch (e) {
    console.error('[PowerPair] Failed to save app state:', e);
  }
}

export function loadAppState(): Partial<AppState> | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as Partial<AppState>) : null;
  } catch {
    return null;
  }
}

// ─── Clear all data ────────────────────────────────────────────────────────────

export function clearAllStorage(): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(STATE_KEY);
  } catch (e) {
    console.error('[PowerPair] Failed to clear storage:', e);
  }
}
