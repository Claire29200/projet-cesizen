
import { vi } from 'vitest';

// Mock communs pour les tests de sécurité
export const setupSecurityTestMocks = () => {
  // Mock pour les composants UI
  vi.mock('@/components/ui/use-toast', () => ({
    toast: vi.fn()
  }));

  // Mock pour Supabase
  vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
      auth: {
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
      }
    }
  }));

  // Ces fonctions seront remplacées dans les tests spécifiques
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
    };
  });
};
