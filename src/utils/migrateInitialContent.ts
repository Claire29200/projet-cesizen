
import { supabase } from "@/integrations/supabase/client";
import { useContentStore } from "@/store/contentStore";

/**
 * Cette fonction est utilisée pour migrer les données initiales du store vers Supabase
 * Elle doit être appelée une seule fois, idéalement par un admin
 */
export const migrateInitialContent = async () => {
  try {
    console.log("Début de la migration des données...");
    
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
      // Insérer la page
      const { data: pageData, error: pageError } = await supabase
        .from('info_pages')
        .insert({
          id: page.id,  // Utiliser le même ID pour maintenir les références
          title: page.title,
          slug: page.slug,
          is_published: page.isPublished,
          user_id: page.userId,
          created_at: page.createdAt,
          updated_at: page.updatedAt
        })
        .select()
        .single();
      
      if (pageError) {
        throw new Error(`Erreur lors de l'insertion de la page ${page.title}: ${pageError.message}`);
      }
      
      // Insérer les sections
      const sectionsToInsert = page.sections.map((section, index) => ({
        id: section.id,  // Utiliser le même ID
        page_id: page.id,
        title: section.title,
        content: section.content,
        position: index,
        updated_at: section.updatedAt
      }));
      
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
