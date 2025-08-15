import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AddMedication from './AddMedication';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase
const insertMock = vi.fn().mockResolvedValue({ error: null });
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: insertMock,
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddMedication Page', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AddMedication />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('should submit the form with the correct data', async () => {
    renderComponent();

    // Fill out the form
    await user.type(screen.getByLabelText(/medication name/i), 'Lisinopril');
    await user.type(screen.getByLabelText(/dosage/i), '10mg');

    // Select frequency
    await user.click(screen.getByRole('combobox', { name: /frequency/i }));
    await user.click(screen.getByRole('option', { name: 'Once daily' }));

    // Select time of day using the new ToggleGroup
    await user.click(screen.getByRole('button', { name: /morning/i }));
    await user.click(screen.getByRole('button', { name: /evening/i }));

    // Submit the form
    await user.click(screen.getByRole('button', { name: /add medication/i }));

    // Assert that supabase.insert was called with the correct payload
    expect(insertMock).toHaveBeenCalledWith({
      user_id: undefined, // user is not mocked in AuthProvider, this is expected
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      time_of_day: expect.arrayContaining(['morning', 'evening']),
      notes: null,
    });

    // Assert that navigation happens on success
    expect(mockNavigate).toHaveBeenCalledWith('/medications');
  });
});
