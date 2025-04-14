
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check authentication state when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        useAuthStore.getState().logout();
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        useAuthStore.getState().logout();
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // If admin access is required but user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
