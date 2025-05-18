
import { vi } from 'vitest';

// Importer ce fichier suffira pour exécuter tous les tests liés au flux d'inscription
// car les tests sont maintenant organisés dans des fichiers séparés
import './register/RegisterSuccess.test.tsx';
import './register/RegisterErrors.test.tsx';

// Note: Ce fichier sert de point d'entrée pour les tests du flux d'inscription
// Il permet de conserver les mêmes chemins d'importation et commandes de test
