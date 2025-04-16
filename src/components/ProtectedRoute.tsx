
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication state when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (isAuthenticated) {
          console.log('ProtectedRoute: Session invalide détectée, déconnexion');
          const success = await logout();
          if (success) {
            navigate('/connexion', { state: { from: location }, replace: true });
          }
        }
      }
    };

    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('ProtectedRoute: Événement SIGNED_OUT détecté');
        logout().then(() => {
          navigate('/connexion', { state: { from: location }, replace: true });
        });
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, logout, navigate, location]);

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
