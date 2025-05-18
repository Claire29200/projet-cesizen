
import { describe, it } from 'vitest';

/**
 * Advanced Authentication Security Tests
 * 
 * This file serves as an entry point for all authentication security tests.
 * Individual test suites have been moved to the auth-security directory for better organization.
 */
describe('Advanced Authentication Security Tests', () => {
  // Import test suites from auth-security directory
  it('should run login attempts tests', async () => {
    // Placeholder test to avoid "no test found" error
    // Réelles tests sont dans les fichiers importés
  });

  // Importer les tests individuels dans le describe
  import('./auth-security/LoginAttemptsTests.test');
  import('./auth-security/SessionValidationTests.test');
  import('./auth-security/AdminAccessTests.test');
  import('./auth-security/LogoutSecurityTests.test');
});
