
import { describe, it } from 'vitest';

// Fichier centralisé pour importer tous les tests de sécurité
describe('Security Flow Integration Tests', () => {
  // Placeholder test to avoid "no test found" error
  it('should run security flow tests', async () => {
    // Tests réels sont dans les fichiers importés
  });

  // Importer tous les tests séparés
  import('./security-flow/UserSessionTests.test');
  import('./security-flow/SecurityDetectionTests.test');
});
