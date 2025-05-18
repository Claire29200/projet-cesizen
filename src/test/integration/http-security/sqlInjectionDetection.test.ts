
import { describe, it, expect } from 'vitest';
import { detectSqlInjection } from '@/services/httpSecurityMiddleware';

describe('SQL Injection Detection Tests', () => {
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
