
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/auth';
import { setupSecurityTestMocks } from './TestSetup';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

// Configuration des mocks communs
setupSecurityTestMocks();

describe('User Session Security Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-1', email: 'user@example.com' },
      logout: vi.fn()
    });
  });
  
  // Test simple pour vérifier que le fichier est reconnu par le test runner
  it('devrait configurer correctement les mocks pour les tests de session', () => {
    expect(useAuthStore).toBeDefined();
    const authStore = useAuthStore();
    expect(authStore.logout).toBeDefined();
  });
});
