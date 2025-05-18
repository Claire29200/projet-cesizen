
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { authController } from '@/controllers/authController';
import React from 'react';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/controllers/authController', () => ({
  authController: {
    validateSession: vi.fn()
  }
}));

vi.mock('@/services/securityService', () => ({
  securityService: {
    logSecurityEvent: vi.fn()
  }
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

// Mock pour React Router
vi.mock('react-router-dom', () => {
  return {
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/test', state: { from: { pathname: '/' } } }),
    Navigate: ({ to }) => <div data-testid="navigate">Redirecting to {to}</div>,
    MemoryRouter: ({ children }) => <div data-testid="memory-router">{children}</div>
  };
});

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render children when user is authenticated', async () => {
    // Arrangement
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-123' },
      logout: vi.fn()
    });
    
    (authController.validateSession as any).mockResolvedValue({
      valid: true,
      session: { user: { id: 'user-123', email_confirmed_at: new Date().toISOString() } }
    });

    // Action
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assertion
    expect(await screen.findByTestId('protected-content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrangement
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      logout: vi.fn()
    });

    // Action
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assertion - should see navigation component
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirecting to /connexion');
  });
});
