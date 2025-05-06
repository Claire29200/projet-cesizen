
import { supabase } from "@/integrations/supabase/client";
import { useContentStore } from "@/store/contentStore";
import { useAuthStore } from "@/store/auth";

/**
 * Cette fonction est utilisée pour migrer les données initiales du store vers Supabase
 * Elle doit être appelée une seule fois, idéalement par un admin
 */
export const migrateInitialContent = async () => {
  try {
    console.log("Début de la migration des données...");
    
    // Vérifier si l'utilisateur est authentifié
    const { user } = useAuthStore.getState();
    
    if (!user) {
      throw new Error("Vous devez être connecté pour migrer les données");
    }
    
    // Vérifier d'abord s'il y a déjà des données dans Supabase
    const { data: existingPages, error: checkError } = await supabase
      .from('info_pages')
      .select('id')
      .limit(1);
    
    if (checkError) {
      throw new Error(`Erreur lors de la vérification des données existantes: ${checkError.message}`);
    }
    
    // Si des données existent déjà, ne pas migrer
    if (existingPages && existingPages.length > 0) {
      console.log("Des données existent déjà dans Supabase. Migration annulée.");
      return {
        success: false,
        message: "Des données existent déjà dans Supabase. Migration annulée."
      };
    }
    
    // Récupérer les pages du store
    const storePages = useContentStore.getState().infoPages;
    
    for (const page of storePages) {
      // Préparer les données conformes au schéma de Supabase
      const pageInsertData = {
        title: page.title,
        slug: page.slug,
        is_published: page.isPublished,
        user_id: null, // Les pages de contenu initial sont considérées comme des pages système
        created_at: new Date(page.createdAt).toISOString(),
        updated_at: new Date(page.updatedAt).toISOString()
      };
      
      // Insérer la page
      const { data: pageData, error: pageError } = await supabase
        .from('info_pages')
        .insert(pageInsertData)
        .select()
        .single();
      
      if (pageError) {
        throw new Error(`Erreur lors de l'insertion de la page ${page.title}: ${pageError.message}`);
      }
      
      if (!pageData) {
        throw new Error(`Erreur lors de l'insertion de la page ${page.title}: Aucune donnée retournée`);
      }
      
      // Préparer les sections pour cette page
      const sectionsToInsert = page.sections.map((section, index) => ({
        page_id: pageData.id,
        title: section.title,
        content: section.content,
        position: index,
        updated_at: typeof section.updatedAt === 'string' 
          ? section.updatedAt 
          : new Date(section.updatedAt).toISOString()
      }));
      
      // Insérer les sections
      const { error: sectionsError } = await supabase
        .from('content_sections')
        .insert(sectionsToInsert);
      
      if (sectionsError) {
        throw new Error(`Erreur lors de l'insertion des sections pour ${page.title}: ${sectionsError.message}`);
      }
      
      console.log(`Page "${page.title}" migrée avec ${page.sections.length} sections.`);
    }
    
    console.log("Migration des données terminée avec succès!");
    return {
      success: true,
      message: `${storePages.length} pages et leurs sections ont été migrées avec succès.`
    };
  } catch (error) {
    console.error("Erreur lors de la migration des données:", error);
    return {
      success: false,
      message: `Erreur lors de la migration: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
