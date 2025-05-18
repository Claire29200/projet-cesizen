
import { describe, it, expect, vi } from 'vitest';
import { validateUrlOrigin } from '@/services/httpSecurityMiddleware';

describe('URL Origin Validation Tests', () => {
  it('should validate allowed origins', () => {
    // Create a spy on window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true
    });
    
    // Action & Assertion
    expect(validateUrlOrigin('https://fksilcutrywgzlvxqdks.supabase.co/auth')).toBe(true);
    expect(validateUrlOrigin('https://example.com/api/data')).toBe(true);
  });
  
  it('should reject disallowed origins', () => {
    // Arrangement
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://example.com' },
      writable: true
    });
    
    // Action & Assertion
    expect(validateUrlOrigin('https://malicious-site.com/api')).toBe(false);
  });
  
  it('should handle invalid URLs gracefully', () => {
    // Arrangement
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Action & Assertion
    expect(validateUrlOrigin('not-a-url')).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    
    // Cleanup
    consoleSpy.mockRestore();
  });
});
