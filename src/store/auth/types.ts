
import { User } from '@/models/user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>; // Modifié de Promise<void> à Promise<boolean>
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  createDemoUsers: () => Promise<boolean>;
}

// Constantes pour les utilisateurs de démonstration
export const ADMIN_EMAIL = 'claire.simonot@protonmail.com';
export const ADMIN_PASSWORD = 'user123456';
export const USER_EMAIL = 'brestoise6@gmail.com';
export const USER_PASSWORD = 'admin123456';
