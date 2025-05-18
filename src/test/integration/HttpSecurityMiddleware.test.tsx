
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  addSecurityHeaders, 
  validateUrlOrigin,
  sanitizeRequestParams,
  detectSqlInjection
} from '@/services/httpSecurityMiddleware';
import { securityService } from '@/services/securityService';

vi.mock('@/services/securityService', () => ({
  securityService: {
    logSecurityEvent: vi.fn()
  }
}));

describe('HTTP Security Middleware Integration Test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue('test-csrf-token'),
        setItem: vi.fn()
      },
      writable: true
    });
    
    // Mock d'origine pour simuler différents contextes de sécurité
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true
    });
  });
  
  it('devrait appliquer des entêtes de sécurité complets à une requête HTTP', () => {
    const mockConfig = {
      url: 'https://api.example.com/data',
      method: 'POST',
      data: { username: 'test-user' },
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const result = addSecurityHeaders(mockConfig);
    
    // Vérifier que tous les entêtes de sécurité sont présents
    expect(result.headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(result.headers['X-Content-Type-Options']).toBe('nosniff');
    expect(result.headers['X-Frame-Options']).toBe('DENY');
    expect(result.headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(result.headers['X-CSRF-Token']).toBe('test-csrf-token');
    
    // Vérifier que les entêtes existants sont préservés
    expect(result.headers['Content-Type']).toBe('application/json');
    
    // Vérifier que la configuration originale est préservée
    expect(result.url).toBe('https://api.example.com/data');
    expect(result.method).toBe('POST');
    expect(result.data).toEqual({ username: 'test-user' });
  });
  
  it('devrait refuser les URLs provenant de domaines non autorisés', () => {
    // Test avec URL valide
    expect(validateUrlOrigin('https://example.com/api/data')).toBe(true);
    expect(validateUrlOrigin('https://fksilcutrywgzlvxqdks.supabase.co/auth')).toBe(true);
    
    // Test avec URL non autorisée
    expect(validateUrlOrigin('https://malicious-site.com/api')).toBe(false);
    
    // Vérifier que l'événement de sécurité est journalisé
    expect(securityService.logSecurityEvent).toHaveBeenCalledWith(
      expect.stringContaining('URL_ORIGIN_BLOCKED'),
      expect.objectContaining({ url: 'https://malicious-site.com/api' })
    );
  });
  
  it('devrait sanitiser les données potentiellement dangereuses', () => {
    const dirtyData = {
      name: 'John<script>alert("XSS")</script>',
      email: 'john@example.com',
      comment: "' OR '1'='1",
      profile: {
        bio: '<img src="x" onerror="alert(document.cookie)">',
        website: 'javascript:alert("Hacked")',
      }
    };
    
    const sanitized = sanitizeRequestParams(dirtyData);
    
    // Vérifier que le HTML dangereux est échappé
    expect(sanitized.name).not.toContain('<script>');
    expect(sanitized.profile.bio).not.toContain('onerror');
    
    // Vérifier que les données valides ne sont pas modifiées
    expect(sanitized.email).toBe('john@example.com');
    
    // Vérifier que les tentatives d'injection SQL sont détectées
    expect(detectSqlInjection(dirtyData.comment)).toBe(true);
  });
  
  it('devrait intégrer avec les autres services de sécurité', () => {
    // Simuler une tentative d'attaque
    const suspiciousRequest = {
      url: 'https://example.com/api',
      method: 'POST',
      data: { query: "'; DROP TABLE users; --" }
    };
    
    // Appliquer les mesures de sécurité
    const securedRequest = addSecurityHeaders(suspiciousRequest);
    const isSafeData = !detectSqlInjection(suspiciousRequest.data.query);
    const isSafeOrigin = validateUrlOrigin(suspiciousRequest.url);
    
    // Vérifier que toutes les mesures fonctionnent ensemble
    expect(securedRequest.headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(isSafeData).toBe(false); // Devrait détecter l'injection SQL
    expect(isSafeOrigin).toBe(true); // L'origine est autorisée
    
    // Vérifier que les événements sont journalisés correctement
    expect(securityService.logSecurityEvent).toHaveBeenCalled();
  });
});
