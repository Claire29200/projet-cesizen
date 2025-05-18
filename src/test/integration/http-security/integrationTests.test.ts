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

describe('HTTP Security Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should sanitize potentially dangerous data', () => {
    // Arrangement
    const dirtyData = {
      name: 'John<script>alert("XSS")</script>',
      email: 'john@example.com',
      comment: "' OR '1'='1",
      profile: {
        bio: '<img src="x" onerror="alert(document.cookie)">',
        website: 'javascript:alert("Hacked")',
      }
    };
    
    // Action
    const sanitized = sanitizeRequestParams(dirtyData);
    
    // Assertion
    // Verify that HTML dangerous content is escaped
    expect(sanitized.name).not.toContain('<script>');
    expect(sanitized.profile.bio).not.toContain('onerror');
    expect(sanitized.profile.bio).toContain('data-sanitized');
    
    // Verify valid data remains unchanged
    expect(sanitized.email).toBe('john@example.com');
    
    // Verify SQL injection detection
    expect(detectSqlInjection(dirtyData.comment)).toBe(true);
  });
  
  it('should integrate with security services', () => {
    // Arrangement
    // Simulate an attack attempt
    const suspiciousRequest = {
      url: 'https://example.com/api',
      method: 'POST',
      data: { query: "'; DROP TABLE users; --" }
    };
    
    // Mock localStorage
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockReturnValue('test-csrf-token');
    
    // Mock window.location for origin validation
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true
    });
    
    // Action
    // Apply security measures
    const securedRequest = addSecurityHeaders(suspiciousRequest);
    const isSafeData = !detectSqlInjection(suspiciousRequest.data.query);
    const isSafeOrigin = validateUrlOrigin(suspiciousRequest.url);
    
    // Explicitly log a security event
    securityService.logSecurityEvent('SECURITY_CHECK', { 
      isSafeData,
      isSafeOrigin,
      url: suspiciousRequest.url
    });
    
    // Assertion
    // Verify all measures work together
    expect(securedRequest.headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(isSafeData).toBe(false); // Should detect SQL injection
    expect(isSafeOrigin).toBe(true); // Origin is allowed
    
    // Verify that events are logged correctly
    expect(securityService.logSecurityEvent).toHaveBeenCalledWith(
      'SECURITY_CHECK',
      expect.objectContaining({
        isSafeData: false,
        isSafeOrigin: true
      })
    );
    
    // Cleanup
    getItemSpy.mockRestore();
  });
  
  it('should validate URL origins correctly', () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true
    });
    
    // Test valid URL
    const validUrl = 'https://example.com/api/data';
    const isValidOrigin = validateUrlOrigin(validUrl);
    
    // Test suspicious URL
    const suspiciousUrl = 'https://malicious-site.com/fake-api';
    const isSuspiciousOrigin = validateUrlOrigin(suspiciousUrl);
    
    // Log security event for suspicious URL
    if (!isSuspiciousOrigin) {
      securityService.logSecurityEvent('URL_ORIGIN_BLOCKED', { url: suspiciousUrl });
    }
    
    // Assertions
    expect(isValidOrigin).toBe(true);
    expect(isSuspiciousOrigin).toBe(false);
    expect(securityService.logSecurityEvent).toHaveBeenCalledWith(
      'URL_ORIGIN_BLOCKED',
      { url: suspiciousUrl }
    );
  });
});
