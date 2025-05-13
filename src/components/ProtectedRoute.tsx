
import { ReactNode, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const handlingLogout = useRef(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    // Vérification de session sécurisée
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sessionValid = !!data.session;
        
        setHasValidSession(sessionValid);
        
        if (!sessionValid && isAuthenticated && !handlingLogout.current) {
          console.log('ProtectedRoute: Session invalide détectée, déconnexion');
          handlingLogout.current = true;
          
          // Utilisation de setTimeout pour éviter les appels bloquants
          setTimeout(async () => {
            try {
              toast.warning('Session expirée. Veuillez vous reconnecter.');
              const success = await logout();
              if (success) {
                navigate('/connexion', { state: { from: location }, replace: true });
              }
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            } finally {
              handlingLogout.current = false;
            }
          }, 10);
        }
        
        setIsCheckingSession(false);
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        setIsCheckingSession(false);
        setHasValidSession(false);
      }
    };

    checkAuth();

    // Configuration du gestionnaire d'événements avec protection contre les attaques
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && isAuthenticated && !handlingLogout.current) {
        console.log('ProtectedRoute: Événement SIGNED_OUT détecté');
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            await logout();
            navigate('/connexion', { state: { from: location }, replace: true });
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
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

  // Pendant la vérification, afficher un état de chargement ou un écran de transition
  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-mental-600">Vérification de session...</div>
    </div>;
  }

  if (!isAuthenticated || !hasValidSession) {
    // Redirection vers la page de connexion avec l'URL de retour
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Si l'accès administrateur est requis mais que l'utilisateur n'est pas administrateur, redirection vers l'accueil
    toast.error("Vous n'avez pas les permissions nécessaires pour accéder à cette page.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
