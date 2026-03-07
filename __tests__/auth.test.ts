import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabase module before importing auth
vi.mock('@/lib/supabase', () => {
  const mockAuth = {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    getUser: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  };
  return {
    supabase: { auth: mockAuth },
  };
});

import { signUp, signIn, signOut, getSession, getUser, resetPassword, updatePassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

const mockAuth = supabase.auth as unknown as {
  signUp: ReturnType<typeof vi.fn>;
  signInWithPassword: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
  getSession: ReturnType<typeof vi.fn>;
  getUser: ReturnType<typeof vi.fn>;
  resetPasswordForEmail: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth', () => {
  // ─── Sign Up ────────────────────────────────────────────────────────────────

  describe('signUp', () => {
    it('returns user and session:true when email confirmation is disabled', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com' };
      mockAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: 'abc' } },
        error: null,
      });

      const result = await signUp('test@test.com', 'password123');
      expect(result.user).toEqual(mockUser);
      expect(result.session).toBe(true);
      expect(result.error).toBeNull();
      expect(mockAuth.signUp).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('returns session:false when email confirmation is required', async () => {
      const mockUser = { id: 'user-2', email: 'test@test.com' };
      mockAuth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      });

      const result = await signUp('test@test.com', 'password123');
      expect(result.user).toEqual(mockUser);
      expect(result.session).toBe(false);
      expect(result.error).toBeNull();
    });

    it('returns error when sign-up fails', async () => {
      mockAuth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' },
      });

      const result = await signUp('taken@test.com', 'password123');
      expect(result.user).toBeNull();
      expect(result.session).toBe(false);
      expect(result.error).toBe('User already registered');
    });
  });

  // ─── Sign In ────────────────────────────────────────────────────────────────

  describe('signIn', () => {
    it('returns user on successful sign-in', async () => {
      const mockUser = { id: 'user-1', email: 'test@test.com' };
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signIn('test@test.com', 'password123');
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('returns error on invalid credentials', async () => {
      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      const result = await signIn('test@test.com', 'wrongpassword');
      expect(result.user).toBeNull();
      expect(result.error).toBe('Invalid login credentials');
    });
  });

  // ─── Sign Out ───────────────────────────────────────────────────────────────

  describe('signOut', () => {
    it('calls supabase signOut', async () => {
      mockAuth.signOut.mockResolvedValue({ error: null });
      await signOut();
      expect(mockAuth.signOut).toHaveBeenCalled();
    });
  });

  // ─── Get Session ────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('returns session when exists', async () => {
      const mockSession = { user: { id: 'user-123' }, access_token: 'abc' };
      mockAuth.getSession.mockResolvedValue({ data: { session: mockSession } });

      const session = await getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null when no session', async () => {
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });

      const session = await getSession();
      expect(session).toBeNull();
    });
  });

  // ─── Get User ───────────────────────────────────────────────────────────────

  describe('getUser', () => {
    it('returns user when authenticated', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      mockAuth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const user = await getUser();
      expect(user).toEqual(mockUser);
    });

    it('returns null when not authenticated', async () => {
      mockAuth.getUser.mockResolvedValue({ data: { user: null } });

      const user = await getUser();
      expect(user).toBeNull();
    });
  });

  // ─── Reset Password ────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('sends reset email successfully', async () => {
      mockAuth.resetPasswordForEmail.mockResolvedValue({ error: null });

      const result = await resetPassword('test@test.com', 'https://app.com/reset-password');
      expect(result.error).toBeNull();
      expect(mockAuth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@test.com',
        { redirectTo: 'https://app.com/reset-password' },
      );
    });

    it('returns error when reset fails', async () => {
      mockAuth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'Rate limit exceeded' },
      });

      const result = await resetPassword('test@test.com', 'https://app.com/reset-password');
      expect(result.error).toBe('Rate limit exceeded');
    });
  });

  // ─── Update Password ──────────────────────────────────────────────────────

  describe('updatePassword', () => {
    it('updates password successfully', async () => {
      mockAuth.updateUser.mockResolvedValue({ error: null });

      const result = await updatePassword('newpassword123');
      expect(result.error).toBeNull();
      expect(mockAuth.updateUser).toHaveBeenCalledWith({ password: 'newpassword123' });
    });

    it('returns error when update fails', async () => {
      mockAuth.updateUser.mockResolvedValue({
        error: { message: 'Password too weak' },
      });

      const result = await updatePassword('123');
      expect(result.error).toBe('Password too weak');
    });
  });
});
