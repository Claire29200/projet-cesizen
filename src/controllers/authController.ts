
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/auth";
import { securityService } from "@/services/securityService";

// Stockage des tentatives de connexion avec limitation d'accès
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

// Contrôleur d'authentification avec logique métier séparée des composants UI
export const authController = {
  // Vérifier si un utilisateur est verrouillé pour cause de tentatives répétées
  isUserLocked: (email: string): boolean => {
    const attempts = loginAttempts.get(email);
    if (!attempts) return false;
    
    // Vérifier si la période de verrouillage est terminée
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const now = Date.now();
      if (now - attempts.lastAttempt < LOCKOUT_DURATION) {
        securityService.logSecurityEvent('LOGIN_ATTEMPT_BLOCKED', { 
          email, 
          reason: 'Account locked due to too many failed attempts' 
        });
        return true;
      } else {
        // Réinitialiser le compteur si la période de verrouillage est terminée
        loginAttempts.delete(email);
        return false;
      }
    }
    
    return false;
  },
  
  // Enregistrer une tentative de connexion
  recordLoginAttempt: (email: string): void => {
    const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    const newCount = attempts.count + 1;
    
    loginAttempts.set(email, { 
      count: newCount, 
      lastAttempt: Date.now() 
    });
    
    // Journaliser l'événement si le nombre de tentatives est élevé
    if (newCount >= 3) {
      securityService.logSecurityEvent('MULTIPLE_FAILED_LOGINS', { 
        email, 
        attemptCount: newCount 
      });
    }
  },
  
  // Réinitialiser les tentatives de connexion après une connexion réussie
  resetLoginAttempts: (email: string): void => {
    loginAttempts.delete(email);
  },

  // Connexion utilisateur
  async login(email: string, password: string) {
    try {
      // Sanitiser les entrées pour prévenir les injections
      const sanitizedEmail = securityService.sanitizeInput(email);
      
      // Vérifier si l'utilisateur est verrouillé
      if (this.isUserLocked(sanitizedEmail)) {
        const attempts = loginAttempts.get(sanitizedEmail)!;
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (Date.now() - attempts.lastAttempt)) / 60000);
        
        toast({
          title: "Accès refusé",
          description: `Compte temporairement verrouillé. Réessayez dans ${remainingTime} minutes.`,
          variant: "security",
        });
        
        return { success: false, error: "Account locked" };
      }

      // Vérifier la force du mot de passe
      const passwordCheck = securityService.checkPasswordStrength(password);
      if (!passwordCheck.isStrong) {
        // On log mais on ne bloque pas la connexion pour un mot de passe faible existant
        securityService.logSecurityEvent('WEAK_PASSWORD_LOGIN', { email: sanitizedEmail });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        // Enregistrer la tentative échouée
        this.recordLoginAttempt(sanitizedEmail);
        
        toast({
          title: "Erreur de connexion",
          description: "Identifiants invalides. Veuillez vérifier vos informations.",
          variant: "destructive",
        });
        
        return { success: false, error };
      }

      // Réinitialiser les tentatives en cas de connexion réussie
      this.resetLoginAttempts(sanitizedEmail);
      
      // Journaliser la connexion réussie
      securityService.logSecurityEvent('USER_LOGIN_SUCCESS', { userId: data.user?.id });

      return { success: true, data };
    } catch (error) {
      securityService.logSecurityEvent('LOGIN_ERROR', { error });
      
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
      // Sanitiser les entrées
      const sanitizedEmail = securityService.sanitizeInput(email);
      const sanitizedName = securityService.sanitizeInput(name);
      
      // Vérifier la force du mot de passe
      const passwordCheck = securityService.checkPasswordStrength(password);
      if (!passwordCheck.isStrong) {
        toast({
          title: "Mot de passe insuffisant",
          description: "Votre mot de passe est trop faible. " + passwordCheck.suggestions.join(" "),
          variant: "warning",
        });
        return { success: false, error: "Weak password" };
      }

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            name: sanitizedName,
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
              email: sanitizedEmail,
              name: sanitizedName,
            },
          ]);

        if (profileError) {
          console.error("Erreur lors de la création du profil:", profileError);
          securityService.logSecurityEvent('PROFILE_CREATION_ERROR', { 
            userId: data.user.id, 
            error: profileError 
          });
        }
      }

      securityService.logSecurityEvent('USER_REGISTRATION', { userId: data.user?.id });
      return { success: true, data };
    } catch (error) {
      securityService.logSecurityEvent('REGISTRATION_ERROR', { error });
      
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
      securityService.logSecurityEvent('LOGOUT_ERROR', { error });
      
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
    
    securityService.logSecurityEvent('USER_LOGOUT', {});
    return { success: true };
  },

  // Mise à jour du profil
  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    try {
      // Sanitiser les données
      const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key as keyof typeof data] = securityService.sanitizeInput(value);
        } else {
          acc[key as keyof typeof data] = value;
        }
        return acc;
      }, {} as typeof data);

      const { error } = await supabase
        .from("profiles")
        .update(sanitizedData)
        .eq("id", userId);

      if (error) {
        securityService.logSecurityEvent('PROFILE_UPDATE_ERROR', { userId, error });
        
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
        state.updateProfile(sanitizedData);
      }

      securityService.logSecurityEvent('PROFILE_UPDATED', { userId });
      return { success: true };
    } catch (error) {
      securityService.logSecurityEvent('PROFILE_UPDATE_ERROR', { userId, error });
      
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      
      return { success: false, error };
    }
  },
  
  // Vérification de session
  async validateSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        return { valid: false };
      }
      
      // Vérifier si le token JWT n'est pas expiré
      const tokenExpiry = new Date((data.session.expires_at || 0) * 1000);
      const now = new Date();
      
      if (tokenExpiry <= now) {
        securityService.logSecurityEvent('SESSION_EXPIRED', {
          userId: data.session.user.id
        });
        return { valid: false };
      }
      
      // Session valide
      return { valid: true, session: data.session };
    } catch (error) {
      securityService.logSecurityEvent('SESSION_VALIDATION_ERROR', { error });
      return { valid: false, error };
    }
  }
};
