
import { toast } from "@/components/ui/use-toast";
import { useContentStore } from "@/store/contentStore";
import { InfoPage, Section } from "@/models/content";

// Helper function to convert between store and model types
const convertToModelInfoPage = (page: any): InfoPage => {
  return page as InfoPage;
};

export const contentController = {
  // Récupération de toutes les pages d'information
  getInfoPages(): InfoPage[] {
    const pages = useContentStore.getState().infoPages;
    return pages.map(convertToModelInfoPage);
  },

  // Récupération d'une page d'information par son slug
  getInfoPageBySlug(slug: string): InfoPage | undefined {
    const page = useContentStore.getState().getInfoPageBySlug(slug);
    return page ? convertToModelInfoPage(page) : undefined;
  },

  // Ajout d'une nouvelle page d'information
  addInfoPage(page: Omit<InfoPage, "id" | "createdAt" | "updatedAt">): InfoPage {
    try {
      const { addInfoPage } = useContentStore.getState();
      
      // Convert sections to ensure updatedAt is present
      const pageWithUpdatedSections = {
        ...page,
        sections: page.sections.map(section => ({
          ...section,
          updatedAt: section.updatedAt || new Date()
        }))
      };
      
      const newPage = addInfoPage(pageWithUpdatedSections);
      return convertToModelInfoPage(newPage);
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
      const { updateInfoPage, getInfoPageBySlug } = useContentStore.getState();
      
      // Get the current page to merge with updates
      const currentPage = useContentStore.getState().infoPages.find(page => page.id === pageId);
      
      if (!currentPage) {
        throw new Error("Page not found");
      }
      
      // Ensure sections have updatedAt if provided
      const updatesWithFixedSections = updates.sections 
        ? {
            ...updates,
            sections: updates.sections.map(section => ({
              ...section,
              updatedAt: section.updatedAt || new Date()
            }))
          } 
        : updates;
      
      // Create a complete page object by merging current data with updates
      const updatedPageData = {
        ...currentPage,
        ...updatesWithFixedSections,
        id: pageId,
        updatedAt: new Date()
      };
      
      const updatedPage = updateInfoPage(updatedPageData);
      
      return convertToModelInfoPage(updatedPage);
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
      deleteInfoPage(pageId);
      return true;
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
