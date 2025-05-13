
import { Resource, ResourceCategory } from "@/models/resource";

// Catégories de ressources prédéfinies
const resourceCategories: ResourceCategory[] = [
  { id: '1', name: 'Méditation', description: 'Exercices de méditation pour réduire le stress' },
  { id: '2', name: 'Respiration', description: 'Techniques de respiration pour la relaxation' },
  { id: '3', name: 'Activité physique', description: 'Exercices physiques pour améliorer le bien-être' },
  { id: '4', name: 'Sommeil', description: 'Conseils et techniques pour un meilleur sommeil' },
  { id: '5', name: 'Alimentation', description: 'Conseils pour une alimentation équilibrée' },
];

// Données de démonstration pour les ressources
const demoResources: Resource[] = [
  {
    id: '1',
    title: 'Méditation guidée de 10 minutes',
    description: 'Une méditation guidée de 10 minutes pour débutants qui aide à réduire le stress.',
    content: 'Commencez par vous asseoir confortablement dans un endroit calme. Fermez les yeux et prenez conscience de votre respiration...',
    category: 'Méditation',
    duration: 10,
    isActive: true,
    createdAt: '2023-05-01T10:00:00Z',
    updatedAt: '2023-05-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Exercice de respiration 4-7-8',
    description: 'Une technique de respiration qui aide à calmer rapidement l\'anxiété et favoriser le sommeil.',
    content: 'Cette technique consiste à inspirer pendant 4 secondes, retenir sa respiration pendant 7 secondes, puis expirer pendant 8 secondes...',
    category: 'Respiration',
    duration: 5,
    isActive: true,
    createdAt: '2023-05-02T14:30:00Z',
    updatedAt: '2023-05-02T14:30:00Z',
  },
  {
    id: '3',
    title: 'Routine de yoga matinale',
    description: 'Une routine de yoga de 15 minutes pour commencer la journée avec énergie et clarté mentale.',
    content: 'Cette routine comprend des étirements doux, des salutations au soleil et des postures d\'équilibre...',
    category: 'Activité physique',
    duration: 15,
    isActive: true,
    createdAt: '2023-05-03T08:15:00Z',
    updatedAt: '2023-05-03T08:15:00Z',
  },
];

// Ressources favorites des utilisateurs (simulées)
const userFavorites: Record<string, string[]> = {
  // userId: [resourceId1, resourceId2, ...]
  'user1': ['1', '3'],
  'user2': ['2'],
};

class ResourceController {
  // Obtenir toutes les ressources actives
  getActiveResources(): Resource[] {
    return demoResources.filter(resource => resource.isActive);
  }
  
  // Obtenir une ressource par son ID
  getResourceById(resourceId: string): Resource | undefined {
    return demoResources.find(resource => resource.id === resourceId);
  }
  
  // Obtenir les ressources par catégorie
  getResourcesByCategory(category: string): Resource[] {
    return demoResources.filter(
      resource => resource.isActive && resource.category === category
    );
  }
  
  // Obtenir les ressources favorites d'un utilisateur
  getUserFavoriteResources(userId: string): Resource[] {
    const favoriteIds = userFavorites[userId] || [];
    return demoResources.filter(
      resource => resource.isActive && favoriteIds.includes(resource.id)
    ).map(resource => ({
      ...resource,
      isFavorite: true
    }));
  }
  
  // Ajouter/retirer une ressource des favoris d'un utilisateur
  toggleFavorite(userId: string, resourceId: string, isFavorite: boolean): boolean {
    if (!userFavorites[userId]) {
      userFavorites[userId] = [];
    }
    
    const favorites = userFavorites[userId];
    
    if (isFavorite) {
      // Ajouter aux favoris s'il n'y est pas déjà
      if (!favorites.includes(resourceId)) {
        favorites.push(resourceId);
      }
    } else {
      // Retirer des favoris
      const index = favorites.indexOf(resourceId);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
    }
    
    // Mettre à jour les favoris de l'utilisateur
    userFavorites[userId] = favorites;
    
    return true;
  }
  
  // Créer une nouvelle ressource
  createResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Resource {
    const newResource: Resource = {
      ...resource,
      id: Math.random().toString(36).substring(2, 9),
      isActive: resource.isActive !== undefined ? resource.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    demoResources.push(newResource);
    
    return newResource;
  }
  
  // Mettre à jour une ressource existante
  updateResource(resourceId: string, updates: Partial<Resource>): Resource | undefined {
    const index = demoResources.findIndex(resource => resource.id === resourceId);
    
    if (index === -1) return undefined;
    
    // Mettre à jour la ressource
    const updatedResource = {
      ...demoResources[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    demoResources[index] = updatedResource;
    
    return updatedResource;
  }
  
  // Supprimer (désactiver) une ressource
  deleteResource(resourceId: string): boolean {
    const index = demoResources.findIndex(resource => resource.id === resourceId);
    
    if (index === -1) return false;
    
    // Désactiver la ressource plutôt que de la supprimer
    demoResources[index].isActive = false;
    demoResources[index].updatedAt = new Date().toISOString();
    
    return true;
  }
  
  // Obtenir toutes les catégories de ressources
  getResourceCategories(): ResourceCategory[] {
    return resourceCategories;
  }
}

export const resourceController = new ResourceController();
