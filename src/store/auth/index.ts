
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from './types';
import { 
  login,
  register,
  logout,
  updateProfile,
  resetPassword,
  changePassword 
} from './authFunctions';
import { createDemoUsers } from './demoUsers';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      login: async (email, password) => {
        return login(email, password, set);
      },
      
      createDemoUsers: async () => {
        return createDemoUsers();
      },
      
      register: async (name, email, password) => {
        return register(name, email, password, set);
      },
      
      logout: async () => {
        return logout(set);
      },
      
      updateProfile: async (userData) => {
        return updateProfile(userData, get().user, set);
      },
      
      resetPassword: async (email) => {
        return resetPassword(email);
      },
      
      changePassword: async (currentPassword, newPassword) => {
        return changePassword(currentPassword, newPassword, get().user);
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
