
import { describe } from 'vitest';

/**
 * Advanced Authentication Security Tests
 * 
 * This file serves as an entry point for all authentication security tests.
 * Individual test suites have been moved to the auth-security directory for better organization.
 */
describe('Advanced Authentication Security Tests', () => {
  // Import test suites from auth-security directory
  import('./auth-security/LoginAttemptsTests.test');
  import('./auth-security/SessionValidationTests.test');
  import('./auth-security/AdminAccessTests.test');
  import('./auth-security/LogoutSecurityTests.test');
});
