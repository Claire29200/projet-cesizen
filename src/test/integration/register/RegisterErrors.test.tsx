
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';
import { setupAuthMocks, setupToastMocks, mockReactRouter } from '../../mocks/authMocks';
import { renderRegisterComponent, fillRegisterForm, submitRegisterForm } from '../../helpers/registerTestHelpers';

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

describe('Register Authentication Flow - Erreurs', () => {
  const { mockRegister, mockNavigate } = setupAuthMocks();
  
  beforeEach(() => {
    vi.resetAllMocks();
    setupToastMocks();
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: false,
      register: mockRegister,
      user: null
    });
    
    // Mock pour React Router
    mockReactRouter(mockNavigate);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    renderRegisterComponent();
    
    // Remplit les champs du formulaire avec des mots de passe différents
    fillRegisterForm({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different-password',
      acceptTerms: true
    });
    
    submitRegisterForm();
    
    // Vérifie que le toast d'erreur est affiché
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Les mots de passe ne correspondent pas.");
    });
    
    // Vérifie que register n'a pas été appelé
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('devrait afficher une erreur si les conditions ne sont pas acceptées', async () => {
    renderRegisterComponent();
    
    // Remplit les champs du formulaire sans accepter les conditions
    fillRegisterForm({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      acceptTerms: false
    });
    
    submitRegisterForm();
    
    // Vérifie que le toast d'erreur est affiché
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Vous devez accepter les conditions d'utilisation.");
    });
    
    // Vérifie que register n'a pas été appelé
    expect(mockRegister).not.toHaveBeenCalled();
  });
  
  it('devrait gérer les erreurs lors de l\'inscription', async () => {
    renderRegisterComponent();
    
    // Configuration du mock de register pour simuler une erreur
    mockRegister.mockRejectedValue(new Error('Erreur d\'inscription'));
    
    // Remplit les champs du formulaire
    fillRegisterForm({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      acceptTerms: true
    });
    
    submitRegisterForm();
    
    // Vérifie que le toast d'erreur est affiché
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Une erreur est survenue lors de l'inscription.");
    });
  });
});
