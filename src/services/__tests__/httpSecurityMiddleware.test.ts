
import { describe, it, expect, vi } from 'vitest';
import { 
  addSecurityHeaders, 
  validateUrlOrigin, 
  sanitizeRequestParams, 
  detectSqlInjection 
} from '@/services/httpSecurityMiddleware';

describe('HTTP Security Middleware', () => {
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
  
  describe('validateUrlOrigin', () => {
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
  
  describe('sanitizeRequestParams', () => {
    it('should sanitize string values in params', () => {
      // Arrangement
      const params = {
        name: 'John<script>alert("XSS")</script>',
        email: 'john@example.com',
        age: 30
      };
      
      // Action
      const sanitized = sanitizeRequestParams(params);
      
      // Assertion - using contains instead of exact equality
      expect(sanitized.name).toContain('John');
      expect(sanitized.name).toContain('&lt;script&gt;');
      expect(sanitized.name).not.toContain('<script>');
      expect(sanitized.email).toBe('john@example.com');
      expect(sanitized.age).toBe(30);
    });
    
    it('should handle nested objects', () => {
      // Arrangement
      const params = {
        user: {
          name: 'John<script>alert("XSS")</script>',
          email: 'john@example.com'
        },
        settings: {
          notify: true
        }
      };
      
      // Action
      const sanitized = sanitizeRequestParams(params);
      
      // Assertion - using contains instead of exact equality
      expect(sanitized.user.name).toContain('John');
      expect(sanitized.user.name).toContain('&lt;script&gt;');
      expect(sanitized.user.name).not.toContain('<script>');
      expect(sanitized.user.email).toBe('john@example.com');
      expect(sanitized.settings.notify).toBe(true);
    });
  });
  
  describe('detectSqlInjection', () => {
    it('should detect SQL injection attempts', () => {
      // Action & Assertion
      expect(detectSqlInjection("' OR '1'='1")).toBe(true);
      expect(detectSqlInjection("'; DROP TABLE users;--")).toBe(true);
      expect(detectSqlInjection("' UNION SELECT * FROM users;--")).toBe(true);
    });
    
    it('should not flag regular text as SQL injection', () => {
      // Action & Assertion
      expect(detectSqlInjection("John Doe")).toBe(false);
      expect(detectSqlInjection("john.doe@example.com")).toBe(false);
      expect(detectSqlInjection("This is a normal comment.")).toBe(false);
    });
    
    it('should handle empty or null inputs', () => {
      // Action & Assertion
      expect(detectSqlInjection("")).toBe(false);
      expect(detectSqlInjection(null as unknown as string)).toBe(false);
    });
  });
});
