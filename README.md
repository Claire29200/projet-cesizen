
# CESIZen - Prenez soin de votre santé mentale au quotidien

## À propos du projet

CESIZen est une application web conçue pour aider les utilisateurs à prendre soin de leur santé mentale au quotidien. L'application permet de réaliser des diagnostics de stress, d'accéder à des ressources informatives et de suivre son évolution dans le temps.

## Fonctionnalités principales

- Évaluation du niveau de stress via un questionnaire interactif
- Authentification utilisateur (inscription, connexion, déconnexion)
- Gestion de profil utilisateur
- Consultation de ressources informatives sur la santé mentale
- Création et gestion de ressources personnelles
- Interface d'administration pour les utilisateurs avec des droits spécifiques

## Guide d'installation

Consultez le fichier [INSTALLATION.md](./INSTALLATION.md) pour les instructions détaillées d'installation et de configuration.

## Cahier de tests

L'application dispose d'une suite de tests unitaires et d'intégration pour garantir sa qualité. Les tests couvrent notamment :

1. **Authentification**
   - Connexion utilisateur
   - Déconnexion utilisateur
   - Validation des formulaires

2. **Diagnostic de stress**
   - Réponse aux questions
   - Calcul de score
   - Affichage des résultats
   - Sauvegarde des résultats

3. **Interface utilisateur**
   - Affichage conditionnel des éléments en fonction du statut d'authentification
   - Navigation entre les pages
   - Réactivité des composants

## Structure du projet

L'application suit une architecture MVC adaptée au frontend :

- **Models** : Définition des types et interfaces dans `/src/models`
- **Views** : Composants React dans `/src/components` et pages dans `/src/pages`
- **Controllers** : Logique métier dans `/src/controllers`

## Comptes de démonstration

Pour tester l'application rapidement, vous pouvez utiliser les comptes de démonstration :

- **Admin** : claire.simonot@protonmail.com / user123456
- **Utilisateur** : brestoise6@gmail.com / 123456

## Technologies utilisées

- React
- TypeScript
- Tailwind CSS
- Supabase (authentification et stockage de données)
- Vitest (tests)
- Framer Motion (animations)

