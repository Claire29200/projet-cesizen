
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { authController } from '@/controllers/authController';
import { toast } from 'sonner';

/**
 * Configure les mocks pour les tests d'authentification
 */
export function setupAuthMocks() {
  // Mock pour le store d'authentification
  const mockRegister = vi.fn();
  
  // Mock pour React Router
  const mockNavigate = vi.fn();
  
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

  return {
    mockRegister,
    mockNavigate
  };
}

/**
 * Configure les mocks pour les notifications toast
 */
export function setupToastMocks() {
  // Reset des mocks de toast
  vi.resetAllMocks();
}

/**
 * Mock pour react-router-dom
 */
export function mockReactRouter(mockNavigate) {
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      Navigate: ({ to }) => <div>Redirecting to {to}</div>
    };
  });
}
