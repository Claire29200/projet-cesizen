
// This file now serves as a central entry point for all HTTP security middleware tests
// All actual tests have been moved to separate files in the http-security directory

import { describe, it } from 'vitest';

describe('HTTP Security Middleware Integration Test', () => {
  it('imports all tests from separate files', () => {
    // This test only serves to ensure this file is recognized by the test runner
    // The actual tests are in the http-security directory
  });
  
  // To run all HTTP security tests, import them here
  import('./http-security/addSecurityHeaders.test');
  import('./http-security/urlOriginValidation.test');
  import('./http-security/requestParamsSanitization.test');
  import('./http-security/sqlInjectionDetection.test');
  import('./http-security/integrationTests.test');
});
