import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ADMIN_EMAIL, ADMIN_PASSWORD, USER_EMAIL } from './types';
import { createDemoUsers } from './demoUsers';
import { User } from '@/models/user';

// Nombre maximum de tentatives de connexion autorisées
const MAX_LOGIN_ATTEMPTS = 5;
// Durée de restriction en cas de dépassement du nombre de tentatives (30 minutes)
const LOCKOUT_DURATION = 30 * 60 * 1000;

// Stockage des tentatives de connexion
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

// Vérifier si un utilisateur est verrouillé pour cause de tentatives répétées
const isUserLocked = (email: string): boolean => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;
  
  // Vérifier si la période de verrouillage est terminée
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const now = Date.now();
    if (now - attempts.lastAttempt < LOCKOUT_DURATION) {
      return true;
    } else {
      // Réinitialiser le compteur si la période de verrouillage est terminée
      loginAttempts.delete(email);
      return false;
    }
  }
  
  return false;
};

// Enregistrer une tentative de connexion
const recordLoginAttempt = (email: string): void => {
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  loginAttempts.set(email, { 
    count: attempts.count + 1, 
    lastAttempt: Date.now() 
  });
};

// Réinitialiser les tentatives de connexion après une connexion réussie
const resetLoginAttempts = (email: string): void => {
  loginAttempts.delete(email);
};

export const login = async (email: string, password: string, set: any) => {
  try {
    // Vérifier si l'utilisateur est verrouillé
    if (isUserLocked(email)) {
      const attempts = loginAttempts.get(email)!;
      const remainingTime = Math.ceil((LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 60000);
      toast.error(`Compte temporairement verrouillé. Réessayez dans ${remainingTime} minutes.`);
      return false;
    }
    
    // Tentative de création des utilisateurs de démonstration si nécessaire
    const isAdminDemo = (email === ADMIN_EMAIL && password === ADMIN_PASSWORD);
    
    if (isAdminDemo) {
      try {
        await createDemoUsers();
      } catch (demoError) {
        console.error('Erreur lors de la création des utilisateurs de démonstration:', demoError);
      }
    }
    
    // Tentative de connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Erreur de connexion:', error.message);
      
      // Enregistrer la tentative échouée
      recordLoginAttempt(email);
      
      // Vérifier si l'utilisateur atteint le nombre max de tentatives après cet échec
      if (loginAttempts.get(email)?.count === MAX_LOGIN_ATTEMPTS) {
        toast.error(`Nombre maximum de tentatives atteint. Compte verrouillé temporairement.`);
        return false;
      }
      
      // Message générique pour ne pas donner d'information sur la validité de l'email
      toast.error('Identifiants invalides. Veuillez vérifier vos informations.');
      return false;
    }
    
    // Réinitialiser les tentatives en cas de connexion réussie
    resetLoginAttempts(email);
    
    // Récupération sécurisée du profil utilisateur
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single();
    
    if (profileError) {
      console.error('Erreur lors de la récupération du profil:', profileError);
    }
    
    // Détermine si l'utilisateur est administrateur
    const isAdminUser = data.user?.user_metadata?.isAdmin === true || email === ADMIN_EMAIL;
    
    // Mise à jour du store avec les informations utilisateur
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
};

export const register = async (name: string, email: string, password: string, set: any) => {
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
};

export const logout = async (set: any) => {
  try {
    console.log('Déconnexion initiée');
    
    // Mise à jour du store AVANT la déconnexion de Supabase
    // Cela évite les problèmes de timing et de boucles
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
    
    // Déconnexion de Supabase après la mise à jour du store
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erreur Supabase lors de la déconnexion:', error.message);
      toast.error(error.message || 'Une erreur est survenue lors de la déconnexion');
      return false;
    }
    
    // Supprimer toutes les données sensibles du localStorage
    const keysToRemove = ['auth-token', 'auth-refresh-token', 'user-session'];
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Erreur lors de la suppression de ${key}:`, e);
      }
    });
    
    console.log('Déconnexion Supabase réussie');
    toast.success('Déconnexion réussie');
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    toast.error('Une erreur est survenue lors de la déconnexion');
    return false;
  }
};

export const updateProfile = async (userData: Partial<User>, currentUser: User | null, set: any) => {
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
};

export const resetPassword = async (email: string) => {
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
};

export const changePassword = async (currentPassword: string, newPassword: string, user: User | null) => {
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: currentPassword
    });

    if (signInError) {
      toast.error('Mot de passe actuel incorrect');
      return false;
    }

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
};
