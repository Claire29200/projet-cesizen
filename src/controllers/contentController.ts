
import { toast } from "@/components/ui/use-toast";
import { useContentStore } from "@/store/contentStore";
import { InfoPage, Section } from "@/models/content";

export const contentController = {
  // Récupération de toutes les pages d'information
  getInfoPages(): InfoPage[] {
    return useContentStore.getState().infoPages;
  },

  // Récupération d'une page d'information par son slug
  getInfoPageBySlug(slug: string): InfoPage | undefined {
    return useContentStore.getState().getInfoPageBySlug(slug);
  },

  // Ajout d'une nouvelle page d'information
  addInfoPage(page: Omit<InfoPage, "id" | "createdAt" | "updatedAt">): InfoPage {
    try {
      const { addInfoPage } = useContentStore.getState();
      const newPage = addInfoPage({
        ...page,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      return newPage;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la page d'information",
        variant: "destructive",
      });
      throw error;
    }
  },

  // Mise à jour d'une page d'information
  updateInfoPage(pageId: string, updates: Partial<InfoPage>): InfoPage {
    try {
      const { updateInfoPage } = useContentStore.getState();
      const updatedPage = updateInfoPage(pageId, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      return updatedPage;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la page d'information",
        variant: "destructive",
      });
      throw error;
    }
  },

  // Suppression d'une page d'information
  deleteInfoPage(pageId: string): boolean {
    try {
      const { deleteInfoPage } = useContentStore.getState();
      return deleteInfoPage(pageId);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la page d'information",
        variant: "destructive",
      });
      return false;
    }
  }
};
