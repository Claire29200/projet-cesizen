
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { securityService } from '@/services/securityService';
import { authController } from '@/controllers/authController';

/**
 * Gestionnaire de sécurité des sessions
 * Vérifie et maintient la sécurité des sessions utilisateur
 */
export const SessionSecurityManager = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handlingLogout = useRef(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes en millisecondes
  
  // Détection d'activité utilisateur
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    // Écouter les événements d'activité utilisateur
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('touchstart', updateActivity);
    
    // Vérification périodique d'inactivité
    const checkInactivity = setInterval(() => {
      const now = Date.now();
      if (isAuthenticated && now - lastActivity > inactivityTimeout) {
        securityService.logSecurityEvent('USER_INACTIVITY_LOGOUT', {
          userId: user?.id,
          inactiveSince: new Date(lastActivity).toISOString()
        });
        
        // Déconnexion automatique après inactivité
        if (!handlingLogout.current) {
          handlingLogout.current = true;
          toast({
            title: "Session expirée",
            description: "Vous avez été déconnecté pour inactivité",
            variant: "warning",
          });
          
          setTimeout(() => {
            logout().then(() => {
              navigate('/connexion', { replace: true });
              handlingLogout.current = false;
            });
          }, 10);
        }
      }
    }, 60000); // Vérifier toutes les minutes
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
      clearInterval(checkInactivity);
    };
  }, [isAuthenticated, lastActivity, logout, navigate, user?.id]);

  useEffect(() => {
    // Détection de sécurité au chargement
    securityService.detectFraming();
    securityService.checkSecureContext();
    
    // En environnement de production, activer la détection des outils de développement
    if (process.env.NODE_ENV === 'production') {
      securityService.detectDevTools();
    }
    
    // Vérification de session sécurisée
    const checkAuth = async () => {
      try {
        const { valid, session } = await authController.validateSession();
        
        if (!valid && isAuthenticated && !handlingLogout.current) {
          console.log('SessionSecurityManager: Session invalide détectée, déconnexion');
          handlingLogout.current = true;
          
          // Utilisation de setTimeout pour éviter les appels bloquants
          setTimeout(async () => {
            try {
              toast({
                title: "Session expirée",
                description: "Votre session a expiré. Veuillez vous reconnecter.",
                variant: "warning",
              });
              
              const success = await logout();
              if (success) {
                navigate('/connexion', { state: { from: location }, replace: true });
              }
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              securityService.logSecurityEvent('SESSION_LOGOUT_ERROR', { error });
            } finally {
              handlingLogout.current = false;
            }
          }, 10);
        } else if (valid && session) {
          // Vérifier si l'utilisateur accède depuis une nouvelle adresse IP ou appareil
          if (user?.lastLogin && session.user) {
            // Note: Dans un système réel, vous devriez stocker les informations d'IP et d'appareil
            // et les comparer avec les informations actuelles
            securityService.logSecurityEvent('USER_SESSION_VALIDATED', {
              userId: session.user.id
            });
          }
        }
        
        setSessionChecked(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        securityService.logSecurityEvent('SESSION_VALIDATION_ERROR', { error });
        setSessionChecked(true);
      }
    };

    checkAuth();

    // Configuration du gestionnaire d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' && isAuthenticated && !handlingLogout.current) {
        securityService.logSecurityEvent('AUTH_STATE_SIGNED_OUT', { userId: user?.id });
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            const success = await logout();
            if (success) {
              navigate('/connexion', { replace: true });
            }
          } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'état de déconnexion:', error);
            securityService.logSecurityEvent('LOGOUT_ERROR', { error });
          } finally {
            handlingLogout.current = false;
          }
        }, 10);
      } else if (event === 'SIGNED_IN') {
        securityService.logSecurityEvent('AUTH_STATE_SIGNED_IN', { 
          userId: session?.user.id 
        });
      } else if (event === 'TOKEN_REFRESHED') {
        securityService.logSecurityEvent('AUTH_TOKEN_REFRESHED', { 
          userId: session?.user.id 
        });
      }
    });

    // Vérification périodique de la validité de la session
    const sessionCheckInterval = setInterval(checkAuth, 5 * 60 * 1000); // Vérifier toutes les 5 minutes

    // Nettoyage des abonnements et intervalles
    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [isAuthenticated, logout, navigate, user?.id, user?.lastLogin]);

  return null; // Ce composant ne rend rien
};

export default SessionSecurityManager;
