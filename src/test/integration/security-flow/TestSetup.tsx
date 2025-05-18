
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

  // Mock pour useAuthStore
  vi.mock('@/store/auth', () => ({
    useAuthStore: vi.fn(() => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      logout: vi.fn().mockResolvedValue(true)
    }))
  }));

  // Ces fonctions seront remplacées dans les tests spécifiques
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => vi.fn(),
      Navigate: ({ to }) => <div>Redirecting to {to}</div>
    };
  });
};
