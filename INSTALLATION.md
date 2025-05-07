
# Guide d'Installation du Projet CESIZen - Prenez soin de votre santé mentale au quotidien

Ce guide vous accompagne pas à pas dans l'installation et la configuration du projet CESIZen.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- [Git](https://git-scm.com/) (version 2.30 ou supérieure)
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) (version 9 ou supérieure)
- Un compte [Supabase](https://supabase.com/) (pour l'authentification et la base de données)

## Étape 1 : Clonage du Repository

```bash
# Cloner le repository
git clone https://github.com/Claire29200/projet-cesizen.git

# Accéder au répertoire du projet
cd projet-cesizen
```

## Étape 2 : Installation des Dépendances

```bash
# Installer toutes les dépendances du projet
npm install
```

## Étape 3 : Configuration de l'Environnement

1. Créez un fichier `.env` à la racine du projet
2. Ajoutez les variables d'environnement nécessaires :

```
VITE_SUPABASE_URL=votre-url-supabase
VITE_SUPABASE_ANON_KEY=votre-clé-publique-supabase
```

## Étape 4 : Configuration de Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com/)
2. Récupérez votre URL de projet et votre clé publique dans les paramètres du projet
3. Ajoutez ces informations dans le fichier `.env` créé précédemment
4. Mettez à jour le fichier `src/integrations/supabase/client.ts` si nécessaire

## Étape 5 : Configuration des Migrations de Base de Données

```bash
# Installation de l'interface en ligne de commande Supabase
npm install -g supabase

# Connectez-vous à votre projet Supabase
supabase login

# Initialisez la connexion à votre projet
supabase link --project-ref votre-reference-projet

# Exécutez les migrations
supabase db push
```

## Étape 6 : Démarrage du Serveur de Développement

```bash
# Lancer le serveur de développement
npm run dev
```

Votre application sera accessible à l'adresse : `http://localhost:8080`

## Étape 7 : Exécution des Tests

Le projet dispose d'une suite complète de tests unitaires et d'intégration. Pour les exécuter :

```bash
# Exécuter tous les tests
npm test

# Exécuter un test spécifique
npm test -- src/components/header/__tests__/AuthButtons.test.tsx

# Exécuter les tests avec couverture
npm test -- --coverage
```

### Structure des Tests

Les tests sont organisés dans des dossiers `__tests__` adjacents aux composants qu'ils testent :

- `src/components/**/__tests__/` : Tests des composants UI
- `src/pages/__tests__/` : Tests des pages complètes
- `src/store/**/__tests__/` : Tests des stores de gestion d'état

### Types de Tests

Le projet utilise plusieurs types de tests :
- Tests unitaires pour les composants individuels
- Tests d'intégration pour les flux utilisateur
- Tests de scénarios pour les parcours complets

## Étape 8 : Compilation pour la Production

```bash
# Construire l'application pour la production
npm run build

# Prévisualiser la version de production localement
npm run preview
```

## Résolution des Problèmes

- **Erreur de connexion à Supabase** : Vérifiez que les variables d'environnement sont correctement définies
- **Erreurs lors des tests** : Assurez-vous que JSDOM est correctement configuré dans `vitest.config.ts`
- **Problèmes de build** : Vérifiez les dépendances et assurez-vous qu'elles sont compatibles
- **Erreurs TypeScript** : Exécutez `npx tsc --noEmit` pour vérifier les erreurs de type

## Comptes de Démonstration

Pour tester rapidement l'application :

- **Admin** : claire.simonot@protonmail.com / user123456
- **Utilisateur** : brestoise6@gmail.com / 123456

lol
