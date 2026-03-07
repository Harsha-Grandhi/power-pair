import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mock next/navigation ────────────────────────────────────────────────────
const mockReplace = vi.fn();
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

// ── Mock useApp ─────────────────────────────────────────────────────────────
const mockResetApp = vi.fn();
const mockSoftReset = vi.fn();
const mockSetCoupleId = vi.fn();

let mockAppState: Record<string, unknown> = {};
let mockAuthLoading = true;

vi.mock('@/contexts/AppContext', () => ({
  useApp: () => ({
    state: mockAppState,
    authLoading: mockAuthLoading,
    authUser: null,
    resetApp: mockResetApp,
    softReset: mockSoftReset,
    setCoupleId: mockSetCoupleId,
  }),
}));

// ── Mock heavy child components ─────────────────────────────────────────────
vi.mock('@/components/layout/BottomNav', () => ({
  __esModule: true,
  default: ({ activeTab }: { activeTab: string }) => <div data-testid="bottom-nav">{activeTab}</div>,
}));

vi.mock('@/components/layout/ProfileDrawer', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-drawer" />,
}));

vi.mock('@/components/home/CoupleHomeTab', () => ({
  __esModule: true,
  default: () => <div data-testid="couple-home-tab">Couple Home</div>,
}));

vi.mock('@/components/dashboard/LockedReport', () => ({
  __esModule: true,
  default: () => <div data-testid="locked-report">Locked Report</div>,
}));

vi.mock('@/components/wheel/TimeSelector', () => ({
  __esModule: true,
  default: () => <div>TimeSelector</div>,
}));

vi.mock('@/components/wheel/SpinWheel', () => ({
  __esModule: true,
  default: () => <div>SpinWheel</div>,
}));

vi.mock('@/components/journeys/JourneysTabContainer', () => ({
  __esModule: true,
  default: () => <div>Journeys</div>,
}));

vi.mock('@/components/coach/ReflectionHistory', () => ({
  __esModule: true,
  default: () => <div>ReflectionHistory</div>,
}));

// ── Mock lib modules ────────────────────────────────────────────────────────
vi.mock('@/lib/dateIdeas', () => ({
  getDateIdeasForCouple: vi.fn(() => []),
}));

vi.mock('@/lib/dates', () => ({
  createDate: vi.fn(),
  fetchDatesForCouple: vi.fn(() => Promise.resolve([])),
}));

vi.mock('@/lib/couples', () => ({
  fetchCoupleProfiles: vi.fn(() => Promise.resolve({ partner1: null, partner2: null, partner1Name: null })),
  fetchPairingCode: vi.fn(() => Promise.resolve('ABC123')),
  linkByPairingCode: vi.fn(),
  resetPartnership: vi.fn(),
}));

vi.mock('@/lib/journeyProgress', () => ({
  getAllEnrollments: vi.fn(() => Promise.resolve([])),
}));

vi.mock('@/lib/journeys', () => ({
  JOURNEYS: [],
}));

vi.mock('@/lib/auth', () => ({
  signOut: vi.fn(() => Promise.resolve()),
}));

// ── Test profile fixture ────────────────────────────────────────────────────
const testProfile = {
  id: 'test-user-1',
  createdAt: '2025-01-01T00:00:00Z',
  completedAt: '2025-01-01T00:00:00Z',
  introContext: { name: 'Alex', email: 'alex@test.com' },
  assessmentAnswers: {},
  dimensionScores: [
    { id: 'emotional', label: 'Emotional', score: 70, lowLabel: 'Reserved', highLabel: 'Expressive' },
    { id: 'structural', label: 'Structural', score: 60, lowLabel: 'Flexible', highLabel: 'Structured' },
    { id: 'social', label: 'Social', score: 50, lowLabel: 'Independent', highLabel: 'Connected' },
    { id: 'growth', label: 'Growth', score: 80, lowLabel: 'Stable', highLabel: 'Evolving' },
  ],
  archetypeResult: {
    code: 'ES',
    primary: {
      id: 'emotional-sage',
      name: 'Emotional Sage',
      emoji: '🌿',
      color: '#4CAF9A',
      gradientFrom: '#2A7B6B',
      gradientTo: '#4CAF9A',
      description: 'Test description',
      strengths: ['Empathy', 'Listening'],
      growthAreas: ['Setting boundaries'],
      whatYouNeedInPartner: ['Patience'],
    },
    secondary: null,
  },
};

// ── Import after mocks ──────────────────────────────────────────────────────
import DashboardPage from '@/app/dashboard/page';

// ── Tests ───────────────────────────────────────────────────────────────────

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReplace.mockClear();
    mockPush.mockClear();
    mockAppState = { profile: null, coupleId: null, isInvited: false };
    mockAuthLoading = true;
  });

  it('shows loading spinner while auth is loading', async () => {
    mockAuthLoading = true;
    mockAppState = { profile: null, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    // Wait for mounted effect
    await waitFor(() => {
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  it('redirects to landing page when auth is done but no profile exists', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: null, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('renders dashboard content when profile exists', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Power Pair')).toBeInTheDocument();
    });

    // Should show bottom nav
    expect(screen.getByTestId('bottom-nav')).toBeInTheDocument();

    // Should NOT redirect
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows user name in top bar when profile has a name', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Alex')).toBeInTheDocument();
    });
  });

  it('shows archetype emoji in the profile button', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(testProfile.archetypeResult.primary.emoji)).toBeInTheDocument();
    });
  });

  it('shows pairing code section when user has no partner', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Connect with your partner')).toBeInTheDocument();
    });

    // Should show locked report
    expect(screen.getByTestId('locked-report')).toBeInTheDocument();
  });

  it('renders CoupleHomeTab when coupleId exists', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: 'couple-123', isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('couple-home-tab')).toBeInTheDocument();
    });
  });

  it('does not show spinner once auth loading completes with a profile', async () => {
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: null, isInvited: false };

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Power Pair')).toBeInTheDocument();
    });

    // Spinner should not be in the document
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).not.toBeInTheDocument();
  });

  it('shows spinner then renders dashboard when auth transitions from loading to loaded', async () => {
    // Start with loading
    mockAuthLoading = true;
    mockAppState = { profile: null, coupleId: null, isInvited: false };

    const { rerender } = render(<DashboardPage />);

    // Should show spinner
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    // Simulate auth finishing and profile loading
    mockAuthLoading = false;
    mockAppState = { profile: testProfile, coupleId: null, isInvited: false };

    rerender(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Power Pair')).toBeInTheDocument();
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });
});
