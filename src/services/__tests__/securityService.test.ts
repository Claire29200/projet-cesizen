import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { securityService } from '@/services/security';

describe('Security Service', () => {
  // Espions pour les méthodes globales
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    // Mock de la console pour éviter la pollution des logs de test
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('sanitizeInput', () => {
    it('should sanitize HTML special characters', () => {
      // Arrangement
      const dirtyInput = '<script>alert("XSS")</script>';
      
      // Action
      const sanitized = securityService.sanitizeInput(dirtyInput);
      
      // Assertion
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });
    
    it('should handle empty input', () => {
      expect(securityService.sanitizeInput('')).toBe('');
      expect(securityService.sanitizeInput(null as unknown as string)).toBe('');
      expect(securityService.sanitizeInput(undefined as unknown as string)).toBe('');
    });
  });
  
  describe('checkPasswordStrength', () => {
    it('should return low score for weak passwords', () => {
      // Action
      const result = securityService.checkPasswordStrength('password');
      
      // Assertion
      expect(result.score).toBeLessThan(3);
      expect(result.isStrong).toBe(false);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
    
    it('should return high score for strong passwords', () => {
      // Action
      const result = securityService.checkPasswordStrength('P@ssw0rd123!');
      
      // Assertion
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.isStrong).toBe(true);
    });
    
    it('should penalize common sequences', () => {
      // Action
      const result = securityService.checkPasswordStrength('Password123456');
      
      // Assertion
      expect(result.score).toBeLessThan(5);
      expect(result.suggestions.some(s => s.includes('séquences communes'))).toBe(true);
    });
    
    it('should handle empty password', () => {
      // Action
      const result = securityService.checkPasswordStrength('');
      
      // Assertion
      expect(result.score).toBe(0);
      expect(result.isStrong).toBe(false);
      expect(result.suggestions).toContain('Veuillez entrer un mot de passe');
    });
  });
  
  describe('generateSessionId', () => {
    it('should generate a unique session ID', () => {
      // Action
      const sessionId1 = securityService.generateSessionId();
      const sessionId2 = securityService.generateSessionId();
      
      // Assertion
      expect(sessionId1).toMatch(/^\d+-[a-z0-9]{9}$/);
      expect(sessionId1).not.toBe(sessionId2);
    });
  });
  
  describe('logSecurityEvent', () => {
    it('should log security events', async () => {
      // Arrangement
      const eventType = 'TEST_EVENT';
      const details = { userId: '123', action: 'test' };
      
      // Action
      await securityService.logSecurityEvent(eventType, details);
      
      // Assertion
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[SECURITY EVENT]'), expect.anything());
    });
  });
  
  describe('detectFraming', () => {
    it('should detect if app is loaded in iframe', () => {
      // Arrangement: mock window.self !== window.top
      const originalSelf = window.self;
      const originalTop = window.top;
      
      // Mock window properties to simulate iframe
      Object.defineProperty(window, 'self', { value: {}, writable: true });
      Object.defineProperty(window, 'top', { value: { different: true }, writable: true });
      
      // Action
      const result = securityService.detectFraming();
      
      // Assertion
      expect(result).toBe(true);
      
      // Restore original properties
      Object.defineProperty(window, 'self', { value: originalSelf, writable: true });
      Object.defineProperty(window, 'top', { value: originalTop, writable: true });
    });
    
    it('should not detect framing for normal loading', () => {
      // Arrangement: ensure window.self === window.top
      Object.defineProperty(window, 'self', { value: window, writable: true });
      Object.defineProperty(window, 'top', { value: window, writable: true });
      
      // Action
      const result = securityService.detectFraming();
      
      // Assertion
      expect(result).toBe(false);
    });
  });
  
  describe('checkSecureContext', () => {
    it('should check if app runs in secure context', () => {
      // Arrangement
      Object.defineProperty(window, 'isSecureContext', { 
        value: true, 
        writable: true 
      });
      
      // Action
      const result = securityService.checkSecureContext();
      
      // Assertion
      expect(result).toBe(true);
    });
    
    it('should warn if app is not in secure context', () => {
      // Arrangement
      const warnSpy = vi.spyOn(console, 'warn');
      Object.defineProperty(window, 'isSecureContext', { 
        value: false, 
        writable: true 
      });
      
      // Action
      const result = securityService.checkSecureContext();
      
      // Assertion
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
    });
  });
  
  describe('validateCondition', () => {
    it('should correctly validate boolean conditions', () => {
      // Action & Assertion
      expect(securityService.validateCondition(true)).toBe(true);
      expect(securityService.validateCondition(false)).toBe(false);
      expect(securityService.validateCondition(1)).toBe(true);
      expect(securityService.validateCondition(0)).toBe(false);
      expect(securityService.validateCondition(null)).toBe(false);
      expect(securityService.validateCondition(undefined)).toBe(false);
    });
  });
});
