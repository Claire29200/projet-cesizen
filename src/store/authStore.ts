
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            toast.error(error.message);
            return false;
          }
          
          // Fetch additional user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user?.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          set({
            user: {
              id: data.user?.id ?? '',
              email: data.user?.email ?? '',
              name: profileData?.name || '',
              lastLogin: new Date().toISOString(),
            },
            isAuthenticated: true,
            isAdmin: false, // You can modify this based on your roles implementation
          });
          
          toast.success('Connexion réussie');
          return true;
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Une erreur est survenue lors de la connexion');
          return false;
        }
      },
      
      register: async (name, email, password) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
              }
            }
          });
          
          if (error) {
            toast.error(error.message);
            return false;
          }
          
          set({
            user: {
              id: data.user?.id ?? '',
              email: data.user?.email ?? '',
              name,
            },
            isAuthenticated: true,
            isAdmin: false,
          });
          
          toast.success('Inscription réussie');
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          toast.error('Une erreur est survenue lors de l\'inscription');
          return false;
        }
      },
      
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          toast.success('Déconnexion réussie');
        } catch (error) {
          console.error('Logout error:', error);
          toast.error('Une erreur est survenue lors de la déconnexion');
        }
      },
      
      updateProfile: async (userData) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        
        try {
          const { error: updateError } = await supabase
            .from('profiles')
            .update(userData)
            .eq('id', currentUser.id);
          
          if (updateError) {
            toast.error(updateError.message);
            return false;
          }
          
          set({
            user: {
              ...currentUser,
              ...userData,
            },
          });
          
          toast.success('Profil mis à jour');
          return true;
        } catch (error) {
          console.error('Profile update error:', error);
          toast.error('Une erreur est survenue lors de la mise à jour du profil');
          return false;
        }
      },
      
      resetPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/nouveau-mot-de-passe'
          });
          
          if (error) {
            toast.error(error.message);
            return false;
          }
          
          toast.success('Instructions de réinitialisation envoyées');
          return true;
        } catch (error) {
          console.error('Reset password error:', error);
          toast.error('Une erreur est survenue');
          return false;
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          // D'abord, vérifier si l'utilisateur est authentifié avec le mot de passe actuel
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: get().user?.email || '',
            password: currentPassword
          });

          if (signInError) {
            toast.error('Mot de passe actuel incorrect');
            return false;
          }

          // Si la vérification réussit, mettre à jour le mot de passe
          const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
          });

          if (updateError) {
            toast.error(updateError.message);
            return false;
          }

          toast.success('Mot de passe modifié avec succès');
          return true;
        } catch (error) {
          console.error('Change password error:', error);
          toast.error('Une erreur est survenue lors du changement de mot de passe');
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);
