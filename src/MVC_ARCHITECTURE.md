
# Architecture MVC - Documentation Technique

Cette documentation détaille l'architecture MVC (Model-View-Controller) implémentée dans ce projet, conformément aux exigences spécifiées.

## 1. Vue d'ensemble de l'architecture MVC

Notre application respecte le pattern MVC de la façon suivante :

### Modèle (Model)
- **Définition** : Représente la structure des données et leurs modes d'accès
- **Implémentation** : 
  - Modèles de données explicites définis dans `/src/models/`
  - Stores Zustand pour la gestion de l'état global
  - Supabase pour la persistance des données

### Vue (View)
- **Définition** : Présentation de l'application, son interface utilisateur
- **Implémentation** : 
  - Composants React dans `/src/components/`
  - Pages dans `/src/pages/`
  - Composants UI réutilisables (basés sur shadcn/ui)

### Contrôleur (Controller)
- **Définition** : Logique métier de l'application
- **Implémentation** : 
  - Contrôleurs spécifiques dans `/src/controllers/`
  - Séparation claire de la logique métier des composants d'interface

## 2. Flux de données dans l'architecture MVC

```
[Utilisateur] → [Vue (Composants React)] → [Contrôleur (Logique métier)] → [Modèle (Données)]
            ↑                                                                     ↓
            └─────────────────── [Vue mise à jour] ←─────────────────────────────┘
```

1. L'utilisateur interagit avec la **Vue** (composants React)
2. La **Vue** transmet les actions à un **Contrôleur** approprié
3. Le **Contrôleur** effectue la logique métier et met à jour le **Modèle**
4. Le **Modèle** met à jour son état (via les stores Zustand ou Supabase)
5. La **Vue** reçoit les nouvelles données et se met à jour

## 3. Structure des dossiers

```
src/
├── components/        # Composants React (Vue)
├── controllers/       # Logique métier (Contrôleur)
├── models/            # Définitions des types de données (Modèle)
├── pages/             # Pages de l'application (Vue)
├── store/             # Gestion de l'état global (partie du Modèle)
└── integrations/      # Intégrations externes (Supabase, etc.)
```

## 4. Exemple concret

### Mise à jour du profil utilisateur

1. **Vue** : `PersonalInfoForm.tsx` - Formulaire de modification du profil
2. **Contrôleur** : `authController.ts` - Méthode `updateProfile`
3. **Modèle** : 
   - Type `User` dans `models/user.ts`
   - Store Zustand `useAuthStore` pour l'état local
   - Table `profiles` dans Supabase pour la persistance

### Flux détaillé
1. L'utilisateur modifie ses informations dans le formulaire
2. Au clic sur "Mettre à jour", le composant appelle `authController.updateProfile()`
3. Le contrôleur effectue la validation et communique avec Supabase
4. Une fois les données mises à jour en base, le store est mis à jour
5. Le composant React reçoit les nouvelles données via le hook `useAuthStore()`

## 5. Avantages de cette architecture

- **Séparation des préoccupations** : Chaque partie a une responsabilité claire
- **Maintenabilité** : Code plus facile à maintenir et à faire évoluer
- **Testabilité** : Possibilité de tester chaque couche indépendamment
- **Réutilisabilité** : Les contrôleurs peuvent être utilisés par différentes vues
- **Flexibilité** : Plus facile d'adapter l'application à de nouveaux besoins

## 6. Conformité aux exigences du Design Pattern MVC

Cette implémentation respecte pleinement les principes du Design Pattern MVC tels que définis dans les spécifications du projet, en offrant une séparation claire entre :
- La **structure des données** (Modèle)
- La **présentation de l'application** (Vue)
- La **logique métier** (Contrôleur)
