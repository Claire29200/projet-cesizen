
import { ReactNode, useEffect, useRef } from "react";
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
  const handlingLogout = useRef(false);

  useEffect(() => {
    // Vérification au montage uniquement
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session && isAuthenticated && !handlingLogout.current) {
        console.log('ProtectedRoute: Session invalide détectée, déconnexion');
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            const success = await logout();
            if (success) {
              navigate('/connexion', { state: { from: location }, replace: true });
            }
          } finally {
            handlingLogout.current = false;
          }
        }, 10);
      }
    };

    checkAuth();

    // Configuration du gestionnaire d'événements
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && isAuthenticated && !handlingLogout.current) {
        console.log('ProtectedRoute: Événement SIGNED_OUT détecté');
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            await logout();
            navigate('/connexion', { state: { from: location }, replace: true });
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
  }, [isAuthenticated, logout, navigate, location]);

  if (!isAuthenticated) {
    // Redirection vers la page de connexion avec l'URL de retour
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Si l'accès administrateur est requis mais que l'utilisateur n'est pas administrateur, redirection vers l'accueil
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
