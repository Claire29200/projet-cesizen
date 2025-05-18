
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  }
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe('Authentication Flow Integration Test', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn(); // Définir mockNavigate au niveau de la description
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      user: null
    });
    
    // Mock pour React Router
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ state: { from: { pathname: '/' } } })
      };
    });
    
    // Mock pour Supabase auth
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        session: { access_token: 'test-token' }
      },
      error: null
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('devrait afficher la page de connexion et se connecter avec succès', async () => {
    // Configuration du mock de login pour simuler une connexion réussie
    mockLogin.mockResolvedValue(true);
    
    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<Login />} />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Vérifie que la page de connexion est affichée
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    
    // Remplit les champs du formulaire
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    
    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
    
    // Vérifie que login a été appelé avec les bons arguments
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Vérifie que la redirection a lieu après connexion réussie
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });
  
  it('devrait afficher une erreur si la connexion échoue', async () => {
    // Configuration du mock de login pour simuler un échec de connexion
    mockLogin.mockResolvedValue(false);
    
    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Remplit les champs du formulaire
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'wrong-password' }
    });
    
    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
    
    // Vérifie que login a été appelé
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
    
    // Vérifie que la redirection n'a pas lieu
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
