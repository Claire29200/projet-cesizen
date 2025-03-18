
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin',
    isAdmin: true,
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Utilisateur Test',
    isAdmin: false,
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email, password) => {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isAdmin: user.isAdmin,
          });
          toast.success('Connexion réussie');
          return true;
        } else {
          toast.error('Email ou mot de passe incorrect');
          return false;
        }
      },
      
      register: async (name, email, password) => {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const userExists = mockUsers.some((u) => u.email === email);
        
        if (userExists) {
          toast.error('Un compte avec cet email existe déjà');
          return false;
        }
        
        // In a real implementation, this would add the user to a database
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          name,
          isAdmin: false,
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          isAdmin: false,
        });
        
        toast.success('Compte créé avec succès');
        return true;
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
        toast.success('Déconnexion réussie');
      },
      
      updateProfile: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
          toast.success('Profil mis à jour avec succès');
        }
      },
      
      resetPassword: async (email) => {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const userExists = mockUsers.some((u) => u.email === email);
        
        if (userExists) {
          toast.success('Instructions de réinitialisation envoyées à votre email');
          return true;
        } else {
          toast.error('Aucun compte associé à cet email');
          return false;
        }
      },
      
      changePassword: async (currentPassword, newPassword) => {
        // Simulating API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // In a real implementation, this would verify the current password
        // and update to the new password in the database
        toast.success('Mot de passe changé avec succès');
        return true;
      },
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
