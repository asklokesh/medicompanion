import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { SignupForm } from './SignupForm';
import { useAuth } from '@/lib/auth/AuthContext';

// Mock the useAuth hook
vi.mock('@/lib/auth/AuthContext', async () => {
  const actual = await vi.importActual('@/lib/auth/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

const mockSignUp = vi.fn();

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      signUp: mockSignUp,
    });
  });

  it('should call signUp with full name, email, and password on form submission', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const createAccountButton = screen.getByRole('button', { name: /create account/i });

    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(createAccountButton);

    expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
  });

  it('should show loading text when submitting', async () => {
    const user = userEvent.setup();
    mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const createAccountButton = screen.getByRole('button', { name: /create account/i });

    await user.type(fullNameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(createAccountButton);

    expect(screen.getByRole('button', { name: /creating account.../i })).toBeInTheDocument();
    expect(createAccountButton).toBeDisabled();
  });
});
