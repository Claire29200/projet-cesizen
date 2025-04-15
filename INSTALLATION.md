# Guide d'Installation du Projet CESIZen - Prenez soin de votre santé mentale au quotidien

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)
- Un compte Supabase (pour l'authentification et la base de données)

## Étape 1 : Clonage du Repository

```bash[
git clone https://github.com/Claire29200/projet-cesizen.git
cd projet-cesizen
```

## Étape 2 : Installation des Dépendances

```bash
npm install
```

## Étape 3 : Configuration de Supabase

1. Créez un nouveau projet sur [Supabase](https://supabase.com/)
2. Récupérez votre URL de projet et votre clé publique
3. Mettez à jour le fichier `src/integrations/supabase/client.ts` avec vos identifiants

```typescript
const SUPABASE_URL = "votre-url-supabase"
const SUPABASE_PUBLISHABLE_KEY = "votre-clé-publique"
```

## Étape 4 : Configuration des Migrations de Base de Données

```bash
# Si vous utilisez l'interface Supabase
# Exécutez les migrations depuis le tableau de bord Supabase

# Ou manuellement
npm run supabase:migrations
```

## Étape 5 : Démarrage du Serveur de Développement

```bash
npm run dev
```

Votre application sera accessible à l'adresse : `http://localhost:8080`

## Étape 6 : Compilation pour la Production

```bash
npm run build
```

## Résolution des Problèmes

- Assurez-vous que toutes les variables d'environnement sont correctement configurées
- Vérifiez que vous avez la dernière version des dépendances
- Consultez la documentation de [Lovable](https://docs.lovable.dev) en cas de problème

## Support

En cas de difficultés, n'hésitez pas à nous contacter via :
- Email : support@serenityapp.com
- Discord : [Lien du serveur Discord](https://discord.gg/votre-serveur)

## Contributions

Les contributions sont les bienvenues ! Veuillez consulter notre guide de contribution avant de soumettre une pull request.
