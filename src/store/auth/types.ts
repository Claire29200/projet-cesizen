
import { User } from '@/models/user';

export interface AuthState {
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

// Constantes pour les utilisateurs de démonstration
export const ADMIN_EMAIL = 'brestoise6@gmail.com';
export const ADMIN_PASSWORD = 'admin123456';
export const USER_EMAIL = 'claire.simonot@protonmail.com';
export const USER_PASSWORD = 'user123456';
