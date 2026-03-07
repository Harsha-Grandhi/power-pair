import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockUpsert = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: mockUpsert.mockReturnValue({ error: null }),
      select: mockSelect.mockReturnValue({
        eq: mockEq.mockReturnValue({
          single: mockSingle,
        }),
      }),
    })),
  },
}));

// Set env vars before importing
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-key');

import { fetchProfileByAuthId } from '@/lib/db';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('db', () => {
  describe('fetchProfileByAuthId', () => {
    it('returns profile and coupleId when found', async () => {
      const mockProfile = {
        id: 'profile-1',
        introContext: { name: 'Test' },
        assessmentAnswers: {},
        dimensionScores: [],
        archetypeResult: { primary: {}, code: 'EDRS' },
      };

      mockSingle.mockResolvedValue({
        data: { full_profile: mockProfile, couple_id: 'couple-1' },
        error: null,
      });

      const result = await fetchProfileByAuthId('auth-user-1');
      expect(result.profile).toEqual(mockProfile);
      expect(result.coupleId).toBe('couple-1');
    });

    it('returns null profile when not found', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });

      const result = await fetchProfileByAuthId('auth-user-unknown');
      expect(result.profile).toBeNull();
      expect(result.coupleId).toBeNull();
    });
  });
});
