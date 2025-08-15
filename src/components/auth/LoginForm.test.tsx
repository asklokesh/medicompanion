import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { LoginForm } from './LoginForm';
import { AuthProvider, useAuth } from '@/lib/auth/AuthContext';

// Mock the useAuth hook
vi.mock('@/lib/auth/AuthContext', async () => {
  const actual = await vi.importActual('@/lib/auth/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockSignIn = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
    });
  });

  it('should call signIn with email and password on form submission', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/login/senior']}>
        <Routes>
          <Route path="/login/:userType" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should show loading text when submitting', async () => {
    const user = userEvent.setup();
     mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(
      <MemoryRouter initialEntries={['/login/senior']}>
        <Routes>
          <Route path="/login/:userType" element={<LoginForm />} />
        </Routes>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    expect(screen.getByRole('button', { name: /signing in.../i })).toBeInTheDocument();
    expect(signInButton).toBeDisabled();
  });

  it('should redirect to senior login if userType is not senior', () => {
    render(
      <MemoryRouter initialEntries={['/login/patient']}>
        <Routes>
          <Route path="/login/:userType" element={<LoginForm />} />
          <Route path="/login/senior" element={<div>Senior Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Senior Login Page')).toBeInTheDocument();
  });
});
