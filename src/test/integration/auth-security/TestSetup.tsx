
import { vi } from 'vitest';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { authController } from '@/controllers/authController';
import { securityService } from '@/services/securityService';

// Common setup for authentication security tests
export function setupAuthSecurityMocks() {
  // Mock auth store
  vi.mock('@/store/auth', () => ({
    useAuthStore: vi.fn()
  }));

  // Mock auth controller
  vi.mock('@/controllers/authController', () => ({
    authController: {
      login: vi.fn(),
      validateSession: vi.fn(),
      isUserLocked: vi.fn(),
      recordLoginAttempt: vi.fn(),
      resetLoginAttempts: vi.fn()
    }
  }));

  // Mock Supabase client
  vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
      auth: {
        signInWithPassword: vi.fn(),
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
        signOut: vi.fn()
      }
    }
  }));

  // Mock security service
  vi.mock('@/services/securityService', () => ({
    securityService: {
      logSecurityEvent: vi.fn(),
      sanitizeInput: vi.fn(input => input),
      checkPasswordStrength: vi.fn(() => ({ isStrong: true, suggestions: [] }))
    }
  }));

  // Mock toast notifications
  vi.mock('sonner', () => ({
    toast: {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn()
    }
  }));

  // Default mock implementations - moved into the function
  vi.resetAllMocks();
    
  // Default mock implementations
  (authController.validateSession as any).mockResolvedValue({ valid: true, session: { user: { id: 'test-user-id' } } });
  (authController.isUserLocked as any).mockReturnValue(false);
  (useAuthStore as any).mockReturnValue({
    isAuthenticated: false,
    login: vi.fn().mockResolvedValue(true),
    logout: vi.fn().mockResolvedValue(true),
    user: null
  });

  // Mock for React Router
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => vi.fn(),
      useLocation: () => ({ pathname: '/', state: { from: { pathname: '/' } } })
    };
  });
}
