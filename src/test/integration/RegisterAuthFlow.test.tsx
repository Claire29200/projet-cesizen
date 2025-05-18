
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { authController } from '@/controllers/authController';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: null, error: null })
      }))
    }))
  }
}));

vi.mock('@/controllers/authController', () => ({
  authController: {
    register: vi.fn(),
    validateSession: vi.fn(() => Promise.resolve({ valid: false }))
  }
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

describe('Register Authentication Flow Integration Test', () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      register: mockRegister,
      user: null
    });
    
    // Mock pour React Router
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });
    
    // Mock pour Supabase auth
    (supabase.auth.signUp as any).mockResolvedValue({
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' }
      },
      error: null
    });

    // Mock pour authController
    (authController.register as any).mockResolvedValue({
      success: true,
      data: {
        user: { id: 'test-user-id', email: 'test@example.com' }
      }
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('devrait afficher le formulaire d\'inscription et s\'inscrire avec succès', async () => {
    // Configuration du mock de register pour simuler une inscription réussie
    mockRegister.mockResolvedValue(true);
    
    render(
      <MemoryRouter initialEntries={['/inscription']}>
        <Routes>
          <Route path="/inscription" element={<Register />} />
          <Route path="/" element={<div>Page d'accueil</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Vérifie que la page d'inscription est affichée
    expect(screen.getByText(/Créer un compte/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmer le mot de passe/i)).toBeInTheDocument();
    
    // Remplit les champs du formulaire
    fireEvent.change(screen.getByLabelText(/Nom/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'password123' }
    });

    // Accepte les conditions
    fireEvent.click(screen.getByText(/J\'accepte les/i));
    
    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
    
    // Vérifie que register a été appelé avec les bons arguments
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
    
    // Vérifie que la redirection a lieu après inscription réussie
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  
  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    render(
      <MemoryRouter initialEntries={['/inscription']}>
        <Routes>
          <Route path="/inscription" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Remplit les champs du formulaire avec des mots de passe différents
    fireEvent.change(screen.getByLabelText(/Nom/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'different-password' }
    });
    
    // Accepte les conditions
    fireEvent.click(screen.getByText(/J\'accepte les/i));
    
    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
    
    // Vérifie que le toast d'erreur est affiché
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Les mots de passe ne correspondent pas.");
    });
    
    // Vérifie que register n'a pas été appelé
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('devrait afficher une erreur si les conditions ne sont pas acceptées', async () => {
    render(
      <MemoryRouter initialEntries={['/inscription']}>
        <Routes>
          <Route path="/inscription" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Remplit les champs du formulaire sans accepter les conditions
    fireEvent.change(screen.getByLabelText(/Nom/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'password123' }
    });
    
    // Soumet le formulaire sans accepter les conditions
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
    
    // Vérifie que le toast d'erreur est affiché
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Vous devez accepter les conditions d'utilisation.");
    });
    
    // Vérifie que register n'a pas été appelé
    expect(mockRegister).not.toHaveBeenCalled();
  });
  
  it('devrait gérer les erreurs lors de l\'inscription', async () => {
    // Configuration du mock de register pour simuler une erreur
    mockRegister.mockRejectedValue(new Error('Erreur d\'inscription'));
    
    render(
      <MemoryRouter initialEntries={['/inscription']}>
        <Routes>
          <Route path="/inscription" element={<Register />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Remplit les champs du formulaire
    fireEvent.change(screen.getByLabelText(/Nom/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
      target: { value: 'password123' }
    });
    
    // Accepte les conditions
    fireEvent.click(screen.getByText(/J\'accepte les/i));
    
    // Soumet le formulaire
    fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
    
    // Vérifie que le toast d'erreur est affiché
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Une erreur est survenue lors de l'inscription.");
    });
  });
});
