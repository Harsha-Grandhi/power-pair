import { UserProfile, AppState } from '@/types';

const PROFILE_KEY = 'pp_profile_v2';
const STATE_KEY = 'pp_state_v2';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// Validate that a loaded profile matches the v2 schema
function isValidProfile(p: unknown): p is UserProfile {
  if (!p || typeof p !== 'object') return false;
  const obj = p as Record<string, unknown>;
  if (!obj.archetypeResult || typeof obj.archetypeResult !== 'object') return false;
  const ar = obj.archetypeResult as Record<string, unknown>;
  if (!ar.primary || typeof ar.primary !== 'object') return false;
  const primary = ar.primary as Record<string, unknown>;
  // v2 archetypes must have growthAreas and whatYouNeedInPartner arrays
  return Array.isArray(primary.growthAreas) && Array.isArray(primary.whatYouNeedInPartner);
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
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidProfile(parsed)) {
      localStorage.removeItem(PROFILE_KEY);
      return null;
    }
    return parsed;
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
    // Also clean up old v1 keys
    localStorage.removeItem('pp_profile_v1');
    localStorage.removeItem('pp_state_v1');
  } catch (e) {
    console.error('[PowerPair] Failed to clear storage:', e);
  }
}
