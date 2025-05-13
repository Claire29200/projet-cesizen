
import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SessionManager = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const handlingLogout = useRef(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Vérification de session en utilisant un timer pour éviter les blocages
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // Si pas de session mais utilisateur considéré comme authentifié
        if (!data.session && isAuthenticated && !handlingLogout.current) {
          console.log('SessionManager: Session invalide détectée, déconnexion');
          handlingLogout.current = true;
          
          // Utilisation de setTimeout pour éviter les appels bloquants
          setTimeout(async () => {
            try {
              const success = await logout();
              if (success) {
                toast.warning('Session expirée. Veuillez vous reconnecter.');
                console.log('SessionManager: Déconnexion réussie, redirection');
                navigate('/connexion', { replace: true });
              }
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            } finally {
              handlingLogout.current = false;
            }
          }, 10);
        }
        
        setSessionChecked(true);
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        setSessionChecked(true);
      }
    };

    checkAuth();

    // Configuration du gestionnaire d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' && isAuthenticated && !handlingLogout.current) {
        console.log('User signed out, updating auth state');
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            const success = await logout();
            if (success) {
              console.log('SessionManager: État de déconnexion mis à jour, redirection');
              navigate('/connexion', { replace: true });
            }
          } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'état de déconnexion:', error);
          } finally {
            handlingLogout.current = false;
          }
        }, 10);
      }
      
      // Détecter les changements de session qui pourraient indiquer une attaque
      if (event === 'TOKEN_REFRESHED' && sessionChecked) {
        console.log('Token refreshed, checking for anomalies');
        // Implémenter ici une logique supplémentaire de vérification
      }
    });

    // Vérification périodique de la validité de la session
    const sessionCheckInterval = setInterval(checkAuth, 5 * 60 * 1000); // Vérifier toutes les 5 minutes

    // Nettoyage des abonnements et intervalles
    return () => {
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [isAuthenticated, logout, navigate, sessionChecked]);

  return null; // Ce composant ne rend rien
};
