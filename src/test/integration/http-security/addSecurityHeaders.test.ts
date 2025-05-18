
import { describe, it, expect, vi } from 'vitest';
import { addSecurityHeaders } from '@/services/httpSecurityMiddleware';

describe('Security Headers Tests', () => {
  describe('addSecurityHeaders', () => {
    it('should add security headers to request config', () => {
      // Arrangement
      const mockConfig = {
        url: 'https://api.example.com/data',
        method: 'GET'
      };
      
      // Mock localStorage for CSRF token
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValue('mock-csrf-token');
      
      // Action
      const result = addSecurityHeaders(mockConfig);
      
      // Assertion
      expect(result.headers).toBeDefined();
      expect(result.headers['X-XSS-Protection']).toBe('1; mode=block');
      expect(result.headers['X-Content-Type-Options']).toBe('nosniff');
      expect(result.headers['X-Frame-Options']).toBe('DENY');
      expect(result.headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
      expect(result.headers['X-CSRF-Token']).toBe('mock-csrf-token');
      
      // Cleanup
      getItemSpy.mockRestore();
    });
    
    it('should preserve existing headers', () => {
      // Arrangement
      const mockConfig = {
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123'
        }
      };
      
      // Action
      const result = addSecurityHeaders(mockConfig);
      
      // Assertion
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers['Authorization']).toBe('Bearer token123');
      expect(result.headers['X-XSS-Protection']).toBe('1; mode=block');
    });
    
    it('should handle localStorage errors gracefully', () => {
      // Arrangement
      const mockConfig = { url: 'https://api.example.com/data' };
      
      // Mock localStorage to throw error
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('Storage access denied');
      });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Action
      const result = addSecurityHeaders(mockConfig);
      
      // Assertion
      expect(result.headers).toBeDefined();
      expect(result.headers['X-XSS-Protection']).toBe('1; mode=block');
      expect(consoleSpy).toHaveBeenCalled();
      expect(result.headers['X-CSRF-Token']).toBeUndefined();
      
      // Cleanup
      getItemSpy.mockRestore();
      consoleSpy.mockRestore();
    });
  });
});
