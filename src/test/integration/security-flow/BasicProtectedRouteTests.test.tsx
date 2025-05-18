
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { setupSecurityTestMocks } from './TestSetup';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

// Configuration des mocks communs
setupSecurityTestMocks();

describe('Protected Route Security Tests', () => {
  const mockNavigate = vi.fn(); // Définir mockNavigate ici au niveau de la description
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Met à jour le mock de react-router-dom
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual as any,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/profile' })
      };
    });
  });
  
  it('devrait permettre l\'accès à une route protégée si l\'utilisateur est authentifié', () => {
    // Mock pour le store d'authentification - utilisateur authentifié
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-1', email: 'user@example.com' },
      logout: vi.fn()
    });
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={
            <ProtectedRoute>
              <div>Contenu protégé</div>
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
  });
  
  it('devrait rediriger vers la page de connexion si l\'utilisateur n\'est pas authentifié', () => {
    // Mock pour le store d'authentification - utilisateur non authentifié
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      logout: vi.fn()
    });
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={
            <ProtectedRoute>
              <div>Contenu protégé</div>
            </ProtectedRoute>
          } />
          <Route path="/connexion" element={<div>Page de connexion</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Page de connexion')).toBeInTheDocument();
  });
  
  it('devrait empêcher l\'accès administrateur si l\'utilisateur n\'est pas un administrateur', () => {
    // Mock pour le store d'authentification - utilisateur normal
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-1', email: 'user@example.com' },
      logout: vi.fn()
    });
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <div>Contenu administrateur</div>
            </ProtectedRoute>
          } />
          <Route path="/" element={<div>Page d'accueil</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Page d\'accueil')).toBeInTheDocument();
  });
});
