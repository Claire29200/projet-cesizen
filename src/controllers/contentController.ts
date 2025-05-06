
import { supabase } from "@/integrations/supabase/client";
import { InfoPage, Section } from "@/models/content";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/components/ui/use-toast";

const convertDbToModelSection = (section: any): Section => {
  return {
    id: section.id,
    title: section.title,
    content: section.content,
    updatedAt: section.updated_at
  };
};

const convertModelToDbSection = (section: Section, pageId: string) => {
  return {
    id: section.id,
    page_id: pageId,
    title: section.title,
    content: section.content,
    updated_at: section.updatedAt
  };
};

const convertDbToModelInfoPage = async (page: any): Promise<InfoPage> => {
  const { data: sectionsData, error: sectionsError } = await supabase
    .from('content_sections')
    .select('*')
    .eq('page_id', page.id)
    .order('position');

  if (sectionsError) {
    console.error("Erreur lors de la récupération des sections:", sectionsError);
    throw sectionsError;
  }

  const sections = sectionsData?.map(convertDbToModelSection) || [];

  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    isPublished: page.is_published,
    userId: page.user_id,
    createdAt: page.created_at,
    updatedAt: page.updated_at,
    sections
  };
};

export const contentController = {
  async getInfoPages(): Promise<InfoPage[]> {
    try {
      const { data, error } = await supabase
        .from('info_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des pages:", error);
        throw error;
      }

      const pages = await Promise.all(data.map(convertDbToModelInfoPage));
      return pages;
    } catch (error) {
      console.error("Erreur lors de la récupération des pages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les pages d'information",
        variant: "destructive",
      });
      return [];
    }
  },

  async getUserInfoPages(userId?: string): Promise<InfoPage[]> {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('info_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des pages de l'utilisateur:", error);
        throw error;
      }

      const pages = await Promise.all(data.map(convertDbToModelInfoPage));
      return pages;
    } catch (error) {
      console.error("Erreur lors de la récupération des pages de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos pages d'information",
        variant: "destructive",
      });
      return [];
    }
  },

  async getPublicInfoPages(): Promise<InfoPage[]> {
    try {
      const { data, error } = await supabase
        .from('info_pages')
        .select('*')
        .eq('is_published', true)
        .is('user_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des pages publiques:", error);
        throw error;
      }

      const pages = await Promise.all(data.map(convertDbToModelInfoPage));
      return pages;
    } catch (error) {
      console.error("Erreur lors de la récupération des pages publiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les pages d'information publiques",
        variant: "destructive",
      });
      return [];
    }
  },

  async getInfoPageBySlug(slug: string): Promise<InfoPage | undefined> {
    try {
      const { data, error } = await supabase
        .from('info_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la récupération de la page:", error);
        throw error;
      }

      if (!data) return undefined;

      return await convertDbToModelInfoPage(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la page d'information",
        variant: "destructive",
      });
      return undefined;
    }
  },

  async addInfoPage(page: Omit<InfoPage, "id" | "createdAt" | "updatedAt">): Promise<InfoPage> {
    try {
      const user = useAuthStore.getState().user;
      
      const { data: pageData, error: pageError } = await supabase
        .from('info_pages')
        .insert({
          title: page.title,
          slug: page.slug,
          is_published: page.isPublished,
          user_id: page.userId || user?.id
        })
        .select()
        .single();

      if (pageError) {
        console.error("Erreur lors de la création de la page:", pageError);
        throw pageError;
      }

      const sectionsToInsert = page.sections.map((section, index) => ({
        page_id: pageData.id,
        title: section.title,
        content: section.content,
        position: index,
        updated_at: new Date().toISOString()
      }));

      const { error: sectionsError } = await supabase
        .from('content_sections')
        .insert(sectionsToInsert);

      if (sectionsError) {
        console.error("Erreur lors de la création des sections:", sectionsError);
        throw sectionsError;
      }

      return await convertDbToModelInfoPage(pageData);
    } catch (error) {
      console.error("Erreur lors de la création de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la page d'information",
        variant: "destructive",
      });
      throw error;
    }
  },

  async updateInfoPage(pageId: string, updates: Partial<InfoPage>): Promise<InfoPage> {
    try {
      const pageUpdates: any = {};

      if (updates.title !== undefined) pageUpdates.title = updates.title;
      if (updates.slug !== undefined) pageUpdates.slug = updates.slug;
      if (updates.isPublished !== undefined) pageUpdates.is_published = updates.isPublished;
      pageUpdates.updated_at = new Date().toISOString();

      const { data: pageData, error: pageError } = await supabase
        .from('info_pages')
        .update(pageUpdates)
        .eq('id', pageId)
        .select()
        .single();

      if (pageError) {
        console.error("Erreur lors de la mise à jour de la page:", pageError);
        throw pageError;
      }

      if (updates.sections) {
        const { error: deleteError } = await supabase
          .from('content_sections')
          .delete()
          .eq('page_id', pageId);

        if (deleteError) {
          console.error("Erreur lors de la suppression des sections:", deleteError);
          throw deleteError;
        }

        const sectionsToInsert = updates.sections.map((section, index) => ({
          page_id: pageId,
          title: section.title,
          content: section.content,
          position: index,
          updated_at: new Date().toISOString()
        }));

        const { error: insertError } = await supabase
          .from('content_sections')
          .insert(sectionsToInsert);

        if (insertError) {
          console.error("Erreur lors de l'insertion des nouvelles sections:", insertError);
          throw insertError;
        }
      }

      return await convertDbToModelInfoPage(pageData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la page d'information",
        variant: "destructive",
      });
      throw error;
    }
  },

  async deleteInfoPage(pageId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('info_pages')
        .delete()
        .eq('id', pageId);

      if (error) {
        console.error("Erreur lors de la suppression de la page:", error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la page d'information",
        variant: "destructive",
      });
      return false;
    }
  },

  async isPageOwner(pageId: string): Promise<boolean> {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return false;
    
    try {
      const { data, error } = await supabase
        .from('info_pages')
        .select('user_id')
        .eq('id', pageId)
        .maybeSingle();

      if (error) {
        console.error("Erreur lors de la vérification du propriétaire:", error);
        throw error;
      }

      return data?.user_id === currentUser.id;
    } catch (error) {
      console.error("Erreur lors de la vérification du propriétaire:", error);
      return false;
    }
  }
};
