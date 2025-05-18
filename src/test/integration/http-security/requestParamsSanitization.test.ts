
import { describe, it, expect } from 'vitest';
import { sanitizeRequestParams } from '@/services/httpSecurityMiddleware';

describe('Request Parameters Sanitization Tests', () => {
  it('should sanitize string values in params', () => {
    // Arrangement
    const params = {
      name: 'John<script>alert("XSS")</script>',
      email: 'john@example.com',
      age: 30
    };
    
    // Action
    const sanitized = sanitizeRequestParams(params);
    
    // Assertion
    expect(sanitized.name).toBe('John&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
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
    
    // Assertion
    expect(sanitized.user.name).toBe('John&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    expect(sanitized.user.email).toBe('john@example.com');
    expect(sanitized.settings.notify).toBe(true);
  });
  
  it('should sanitize dangerous HTML attributes', () => {
    // Arrangement
    const dirtyData = {
      profile: {
        bio: '<img src="x" onerror="alert(document.cookie)">',
        website: 'javascript:alert("Hacked")'
      }
    };
    
    // Action
    const sanitized = sanitizeRequestParams(dirtyData);
    
    // Assertion
    expect(sanitized.profile.bio).not.toContain('onerror');
    expect(sanitized.profile.bio).toContain('data-sanitized');
    expect(sanitized.profile.website).not.toContain('javascript:');
    expect(sanitized.profile.website).toContain('sanitized:');
  });
});
