
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const SessionManager = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const handlingLogout = useRef(false);

  useEffect(() => {
    // Vérification de session uniquement au montage du composant
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session && isAuthenticated && !handlingLogout.current) {
        console.log('SessionManager: Session invalide détectée, déconnexion');
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            const success = await logout();
            if (success) {
              console.log('SessionManager: Déconnexion réussie, redirection');
              navigate('/', { replace: true });
            }
          } finally {
            handlingLogout.current = false;
          }
        }, 10);
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
              navigate('/', { replace: true });
            }
          } finally {
            handlingLogout.current = false;
          }
        }, 10);
      }
    });

    // Nettoyage de l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, logout, navigate]);

  return null; // Ce composant ne rend rien
};
