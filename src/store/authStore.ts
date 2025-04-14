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
  createDemoUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email, password) => {
        try {
          // Vérifier s'il s'agit d'un utilisateur de démonstration
          const isDemo = (email === 'admin@example.com' && password === 'admin123') ||
                         (email === 'user@example.com' && password === 'user123');
          
          // Si c'est un utilisateur de démo, essayer de le créer s'il n'existe pas
          if (isDemo) {
            try {
              await get().createDemoUsers();
            } catch (demoError) {
              console.error('Erreur lors de la création des utilisateurs de démonstration:', demoError);
            }
          }
          
          // Tenter la connexion
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error('Erreur de connexion:', error.message);
            toast.error(error.message === 'Invalid login credentials' 
              ? 'Identifiants invalides. Vérifiez votre email et mot de passe.' 
              : error.message);
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
          
          const isAdminUser = email === 'admin@example.com';
          
          set({
            user: {
              id: data.user?.id ?? '',
              email: data.user?.email ?? '',
              name: profileData?.name || '',
              isAdmin: isAdminUser,
              lastLogin: new Date().toISOString(),
            },
            isAuthenticated: true,
            isAdmin: isAdminUser,
          });
          
          toast.success('Connexion réussie');
          return true;
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Une erreur est survenue lors de la connexion');
          return false;
        }
      },
      
      createDemoUsers: async () => {
        try {
          // Vérifier si l'utilisateur admin existe déjà
          const { data: adminData, error: adminCheckError } = await supabase.auth.signInWithPassword({
            email: 'admin@example.com',
            password: 'admin123',
          });
          
          // Si pas d'utilisateur admin, le créer
          if (adminCheckError && adminCheckError.message.includes('Invalid login credentials')) {
            console.log('Création de l\'utilisateur admin de démonstration...');
            const { error: adminCreateError } = await supabase.auth.signUp({
              email: 'admin@example.com',
              password: 'admin123',
              options: {
                data: {
                  name: 'Administrateur',
                  isAdmin: true,
                }
              }
            });
            
            if (adminCreateError) {
              console.error('Erreur lors de la création de l\'utilisateur admin:', adminCreateError);
            }
          }
          
          // Vérifier si l'utilisateur standard existe déjà
          const { data: userData, error: userCheckError } = await supabase.auth.signInWithPassword({
            email: 'user@example.com',
            password: 'user123',
          });
          
          // Si pas d'utilisateur standard, le créer
          if (userCheckError && userCheckError.message.includes('Invalid login credentials')) {
            console.log('Création de l\'utilisateur standard de démonstration...');
            const { error: userCreateError } = await supabase.auth.signUp({
              email: 'user@example.com',
              password: 'user123',
              options: {
                data: {
                  name: 'Utilisateur',
                  isAdmin: false,
                }
              }
            });
            
            if (userCreateError) {
              console.error('Erreur lors de la création de l\'utilisateur standard:', userCreateError);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la création des utilisateurs de démonstration:', error);
          throw error;
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
