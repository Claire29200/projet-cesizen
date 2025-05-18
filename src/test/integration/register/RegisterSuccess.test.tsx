import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitFor, screen } from '@testing-library/react'; // Import screen here
import { useAuthStore } from '@/store/auth';
import { setupAuthMocks, mockReactRouter } from '../../mocks/authMocks';
import { renderRegisterComponent, fillRegisterForm, submitRegisterForm } from '../../helpers/registerTestHelpers';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

// Mocks pour Supabase et autres dépendances
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

describe('Register Authentication Flow - Succès', () => {
  const { mockRegister, mockNavigate } = setupAuthMocks();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      register: mockRegister,
      user: null
    });
    
    // Mock pour React Router
    mockReactRouter(mockNavigate);
    
    // Configuration du mock de register pour simuler une inscription réussie
    mockRegister.mockResolvedValue(true);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('devrait afficher le formulaire d\'inscription et s\'inscrire avec succès', async () => {
    renderRegisterComponent();
    
    // Vérifie que la page d'inscription est affichée
    expect(screen.getByText(/Créer un compte/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmer le mot de passe/i)).toBeInTheDocument();
    
    // Remplit le formulaire et le soumet
    fillRegisterForm({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      acceptTerms: true
    });
    
    submitRegisterForm();
    
    // Vérifie que register a été appelé avec les bons arguments
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
    });
    
    // Vérifie que la redirection a lieu après inscription réussie
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
