
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
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

describe('User Session Security Tests', () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();
  
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
  
  it('devrait gérer la déconnexion initiée par l\'utilisateur', async () => {
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-1', email: 'user@example.com' },
      logout: mockLogout
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
    
    // Simuler une action qui déclenche la déconnexion
    await (useAuthStore as any)().logout();
    
    // Vérifie que la fonction de déconnexion a été appelée
    expect(mockLogout).toHaveBeenCalled();
    
    // Vérifie que l'utilisateur est redirigé vers la page de connexion
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/connexion', { state: { from: { pathname: '/profile' } }, replace: true });
    });
  });
});
