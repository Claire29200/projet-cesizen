
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SessionSecurityManager } from '@/components/auth/SessionSecurityManager';
import { securityService } from '@/services/securityService';
import { supabase } from '@/integrations/supabase/client';
import { authController } from '@/controllers/authController';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/services/securityService', () => ({
  securityService: {
    detectFraming: vi.fn(),
    checkSecureContext: vi.fn(),
    detectDevTools: vi.fn(),
    logSecurityEvent: vi.fn(),
    validateCondition: vi.fn()
  }
}));

vi.mock('@/controllers/authController', () => ({
  authController: {
    validateSession: vi.fn()
  }
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  }
}));

vi.mock('@/components/ui/use-toast', () => ({
  toast: vi.fn()
}));

describe('Security Flow Integration Test', () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour React Router
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/profile' })
      };
    }, { virtual: true });
    
    // Configuration par défaut pour les sécurités
    (securityService.detectFraming as any).mockReturnValue(false);
    (securityService.checkSecureContext as any).mockReturnValue(true);
    (securityService.validateCondition as any).mockImplementation((val) => !!val);
    
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  
  it('devrait rediriger vers la connexion si non authentifié sur route protégée', async () => {
    // Configuration du mock pour un utilisateur non authentifié
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: mockLogout
    });
    
    (authController.validateSession as any).mockResolvedValue({
      valid: false,
      session: null
    });
    
    render(
      <MemoryRouter initialEntries={['/profil']}>
        <SessionSecurityManager />
        <Routes>
          <Route path="/profil" element={
            <ProtectedRoute>
              <div>Contenu Protégé</div>
            </ProtectedRoute>
          } />
          <Route path="/connexion" element={<div>Page de Connexion</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/connexion', expect.anything());
    });
  });
  
  it('devrait refuser l\'accès aux pages admin pour les utilisateurs non-admin', async () => {
    // Configuration du mock pour un utilisateur authentifié mais non admin
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-id', email: 'user@example.com' },
      logout: mockLogout
    });
    
    (authController.validateSession as any).mockResolvedValue({
      valid: true,
      session: { user: { id: 'user-id', email: 'user@example.com' } }
    });
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <SessionSecurityManager />
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <div>Page Admin</div>
            </ProtectedRoute>
          } />
          <Route path="/" element={<div>Page d'Accueil</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
  
  it('devrait déconnecter l\'utilisateur après inactivité', async () => {
    // Configuration du mock pour un utilisateur authentifié
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-id', email: 'user@example.com' },
      logout: mockLogout
    });
    
    (authController.validateSession as any).mockResolvedValue({
      valid: true,
      session: { user: { id: 'user-id', email: 'user@example.com' } }
    });
    
    render(
      <MemoryRouter>
        <SessionSecurityManager />
      </MemoryRouter>
    );
    
    // Avance le temps de 31 minutes pour déclencher la déconnexion par inactivité
    vi.advanceTimersByTime(31 * 60 * 1000);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
  
  it('devrait détecter les contextes non sécurisés', async () => {
    // Simuler un contexte non sécurisé
    (securityService.checkSecureContext as any).mockReturnValue(false);
    
    // Configuration du mock pour un utilisateur authentifié
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: 'user-id' },
      logout: mockLogout
    });
    
    render(
      <MemoryRouter>
        <SessionSecurityManager />
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(securityService.logSecurityEvent).toHaveBeenCalledWith(
        expect.stringContaining('INSECURE_CONTEXT'),
        expect.anything()
      );
    });
  });
});
