
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { securityService } from '@/services/securityService';
import { setupSecurityTestMocks } from './TestSetup';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/services/securityService', () => ({
  securityService: {
    detectFraming: vi.fn(),
    validateOrigin: vi.fn(),
    logSecurityEvent: vi.fn(),
    checkInactivity: vi.fn(),
    checkSecureContext: vi.fn()
  }
}));

// Configuration des mocks communs
setupSecurityTestMocks();

describe('Security Detection Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Configuration par défaut pour les sécurités
    (securityService.detectFraming as any).mockReturnValue(false);
    (securityService.validateOrigin as any).mockReturnValue(true);
    (securityService.checkInactivity as any).mockReturnValue(false);
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'user-1', email: 'user@example.com' },
      logout: vi.fn()
    });
  });
  
  // Test simple pour vérifier que le fichier est reconnu par le test runner
  it('devrait configurer correctement les mocks de sécurité', () => {
    expect(securityService.detectFraming).toBeDefined();
    expect(securityService.validateOrigin).toBeDefined();
    expect(securityService.logSecurityEvent).toBeDefined();
  });
});
