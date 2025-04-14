
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";

// Logique métier d'authentification séparée des composants UI
export const authController = {
  // Connexion utilisateur
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return { success: false, error };
    }
  },

  // Inscription utilisateur
  async register(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }

      // Création du profil utilisateur dans la table profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email,
              name,
            },
          ]);

        if (profileError) {
          console.error("Erreur lors de la création du profil:", profileError);
        }
      }

      return { success: true, data };
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return { success: false, error };
    }
  },

  // Déconnexion
  async logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }

    // Réinitialiser l'état d'authentification dans le store
    const authStore = useAuthStore.getState();
    if (authStore.logout) {
      authStore.logout();
    }
    
    return { success: true };
  },

  // Mise à jour du profil
  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", userId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive",
        });
        return { success: false, error };
      }

      // Mise à jour du store après modification réussie
      const state = useAuthStore.getState();
      if (state.user && state.updateProfile) {
        state.updateProfile(data);
      }

      return { success: true };
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return { success: false, error };
    }
  },
};
