
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const SessionManager = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Only logout if we thought we were authenticated
        if (isAuthenticated) {
          const success = await logout();
          if (success) {
            console.log('SessionManager: Déconnexion réussie, redirection vers la page d\'accueil');
            navigate('/', { replace: true });
          }
        }
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, updating auth state');
        logout().then(success => {
          if (success) {
            console.log('SessionManager: État de déconnexion mis à jour, redirection');
            navigate('/', { replace: true });
          }
        });
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, logout, navigate]);

  return null; // This component doesn't render anything
};
