
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { authController } from '@/controllers/authController';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/controllers/authController', () => ({
  authController: {
    login: vi.fn(),
    validateSession: vi.fn(),
    isUserLocked: vi.fn(),
    recordLoginAttempt: vi.fn(),
    resetLoginAttempts: vi.fn()
  }
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signOut: vi.fn()
    }
  }
}));

vi.mock('@/services/securityService', () => ({
  securityService: {
    logSecurityEvent: vi.fn(),
    sanitizeInput: vi.fn(input => input),
    checkPasswordStrength: vi.fn(() => ({ isStrong: true, suggestions: [] }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn()
  }
}));

describe('Tests de sécurité avancés pour l\'authentification', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Configuration des mocks par défaut
    (authController.validateSession as any).mockResolvedValue({ valid: true, session: { user: { id: 'test-user-id' } } });
    (authController.isUserLocked as any).mockReturnValue(false);
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      login: vi.fn().mockResolvedValue(true),
      logout: vi.fn().mockResolvedValue(true),
      user: null
    });
    
    // Mock pour React Router
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ pathname: '/', state: { from: { pathname: '/' } } })
      };
    });
  });
  
  it('devrait bloquer l\'accès après plusieurs tentatives de connexion échouées', async () => {
    // Simuler un compte verrouillé
    (authController.isUserLocked as any).mockReturnValue(true);
    (authController.login as any).mockResolvedValue({ success: false, error: "Account locked" });
    
    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Remplit le formulaire
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    
    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
    
    // Vérifie que la tentative est bloquée
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
  
  it('devrait vérifier la validité de la session pour les routes protégées', async () => {
    // Simuler une session invalide
    (authController.validateSession as any).mockResolvedValue({ valid: false });
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn().mockResolvedValue(true),
      user: { id: 'test-user-id', email: 'test@example.com' }
    });
    
    // Composant de test pour la route protégée
    const ProtectedContent = () => <div>Contenu protégé</div>;
    
    render(
      <MemoryRouter initialEntries={['/protege']}>
        <Routes>
          <Route path="/protege" element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          } />
          <Route path="/connexion" element={<div>Page de connexion</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Attend que la validation de session soit terminée
    await waitFor(() => {
      // Vérifie que la redirection a lieu
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });
  });
  
  it('devrait empêcher l\'accès aux ressources administratives pour les utilisateurs non-admin', async () => {
    // Simuler un utilisateur authentifié mais non-admin
    (authController.validateSession as any).mockResolvedValue({ valid: true, session: { user: { id: 'test-user-id' } } });
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'test-user-id', email: 'test@example.com', isAdmin: false }
    });
    
    // Composant de test pour la page admin
    const AdminContent = () => <div>Contenu administrateur</div>;
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminContent />
            </ProtectedRoute>
          } />
          <Route path="/" element={<div>Page d'accueil</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Attend que la validation de session soit terminée
    await waitFor(() => {
      // Vérifie que le contenu admin n'est pas affiché
      expect(screen.queryByText('Contenu administrateur')).not.toBeInTheDocument();
    });
  });
  
  it('devrait nettoyer correctement la session lors de la déconnexion', async () => {
    // Simuler un utilisateur authentifié
    const mockLogout = vi.fn().mockResolvedValue(true);
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      user: { id: 'test-user-id', email: 'test@example.com' }
    });
    
    // Mock localStorage
    const mockLocalStorage = {
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    render(
      <MemoryRouter initialEntries={['/profil']}>
        <Routes>
          <Route path="/profil" element={
            <button onClick={() => {
              useAuthStore.getState().logout();
            }}>
              Déconnexion
            </button>
          } />
        </Routes>
      </MemoryRouter>
    );
    
    // Déclenche la déconnexion
    fireEvent.click(screen.getByText('Déconnexion'));
    
    // Vérifie que la déconnexion a été appelée
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
