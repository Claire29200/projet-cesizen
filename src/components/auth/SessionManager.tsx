import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';

export const SessionManager = () => {
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    // Check authentication state when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        logout();
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        logout();
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, logout]);

  return null; // This component doesn't render anything
};
