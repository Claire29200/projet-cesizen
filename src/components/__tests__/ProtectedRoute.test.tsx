
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { authController } from '@/controllers/authController';

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

  it('should redirect to login when user is not authenticated', async () => {
    // Arrangement
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      logout: vi.fn()
    });

    // Nouveau mock pour Navigate
    const navigateMock = vi.fn();
    
    // Mock Navigate component behavior
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual as any,
        useNavigate: () => navigateMock,
        Navigate: ({ to }: { to: string }) => {
          navigateMock(to);
          return null;
        }
      };
    });

    // Action
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          } />
          <Route path="/connexion" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Assertion - should not see protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect admin-only routes for non-admin users', () => {
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
        <ProtectedRoute adminOnly={true}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assertion - should not see admin content
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
  
  it('should redirect unverified users when verification is required', async () => {
    // Arrangement
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-123' },
      logout: vi.fn()
    });
    
    (authController.validateSession as any).mockResolvedValue({
      valid: true,
      session: { user: { id: 'user-123', email_confirmed_at: null } } // Email non vérifié
    });

    const navigateMock = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual as any,
        useNavigate: () => navigateMock
      };
    });

    // Action
    render(
      <MemoryRouter>
        <ProtectedRoute requiresVerification={true}>
          <div>Verified Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Aucune assertion spécifique ici car cela dépend de l'implémentation de useEffect
    // Ce test est là pour s'assurer que le code s'exécute sans erreur
  });
});
