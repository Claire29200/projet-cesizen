
import { describe } from 'vitest';

// Fichier centralisé pour importer tous les tests de sécurité
describe('Security Flow Integration Tests', () => {
  // Importer tous les tests séparés
  import('./security-flow/BasicProtectedRouteTests.test');
  import('./security-flow/UserSessionTests.test');
  import('./security-flow/SecurityDetectionTests.test');
});
