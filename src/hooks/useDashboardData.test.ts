import { renderHook, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useDashboardData } from './useDashboardData';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock useAuth hook
vi.mock('@/lib/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

const mockUser = { id: 'test-user-id', email: 'test@example.com' };

// Reusable mocks for the end of the chain
const userProfileSingleMock = vi.fn();
const medicationsEqMock = vi.fn();
const logsOrderMock = vi.fn();
const logsInsertMock = vi.fn();

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });

    // Provide default successful responses for all fetches
    userProfileSingleMock.mockResolvedValue({ data: {}, error: null });
    medicationsEqMock.mockResolvedValue({ data: [], error: null });
    logsOrderMock.mockResolvedValue({ data: [], error: null });
    logsInsertMock.mockResolvedValue({ data: [{}], error: null });

    // Setup the chained mock structure
    const fromMock = supabase.from as jest.Mock;
    fromMock.mockImplementation((tableName) => {
      switch (tableName) {
        case 'user_profiles':
          return {
            select: () => ({
              eq: () => ({
                single: userProfileSingleMock,
              }),
            }),
          };
        case 'medications':
          return {
            select: () => ({
              eq: medicationsEqMock,
            }),
          };
        case 'medication_logs':
          return {
            select: () => ({
              eq: () => ({
                gte: () => ({
                  order: logsOrderMock,
                }),
              }),
            }),
            insert: logsInsertMock,
          };
        default:
          return {};
      }
    });
  });

  it('should be in a loading state initially and then finish', async () => {
    const { result } = renderHook(() => useDashboardData());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should fetch and set user profile, medications, and logs', async () => {
    const mockProfile = { id: mockUser.id, name: 'Test User' };
    const mockMedications = [{ id: 'med1', name: 'Aspirin', time_of_day: ['morning'] }];
    const mockLogs = [{ id: 'log1', medication_id: 'med1', status: 'taken', taken_at: new Date().toISOString() }];

    // Configure specific return values for this test
    userProfileSingleMock.mockResolvedValue({ data: mockProfile, error: null });
    medicationsEqMock.mockResolvedValue({ data: mockMedications, error: null });
    logsOrderMock.mockResolvedValue({ data: mockLogs, error: null });

    const { result } = renderHook(() => useDashboardData());

    await waitFor(() => {
      expect(result.current.userProfile).toEqual(mockProfile);
      expect(result.current.medications).toEqual(mockMedications);
      expect(result.current.medicationLogs).toEqual(mockLogs);
    });
  });

  it('should update a medication status to "taken"', async () => {
    const { result } = renderHook(() => useDashboardData());

    // Wait for initial data load to finish
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Call the function to test
    await act(async () => {
      await result.current.updateMedicationStatus('med1', 'taken');
    });

    // Assert that the insert mock was called with the correct payload
    expect(logsInsertMock).toHaveBeenCalledWith({
      medication_id: 'med1',
      status: 'taken',
      user_id: mockUser.id,
      taken_at: expect.any(String), // The timestamp is generated inside the function
    });
  });
});
