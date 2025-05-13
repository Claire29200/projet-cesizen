
import { ReactNode, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { securityService } from "@/services/securityService";
import { authController } from "@/controllers/authController";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  requiresVerification?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  adminOnly = false,
  requiresVerification = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const handlingLogout = useRef(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    // Vérification de session sécurisée
    const checkAuth = async () => {
      try {
        const { valid, session } = await authController.validateSession();
        
        setHasValidSession(valid);
        
        if (!valid && isAuthenticated && !handlingLogout.current) {
          securityService.logSecurityEvent('INVALID_SESSION_DETECTED', { 
            userId: user?.id,
            path: location.pathname
          });
          
          console.log('ProtectedRoute: Session invalide détectée, déconnexion');
          handlingLogout.current = true;
          
          // Utilisation de setTimeout pour éviter les appels bloquants
          setTimeout(async () => {
            try {
              toast({
                title: "Session expirée",
                description: "Veuillez vous reconnecter.",
                variant: "warning",
              });
              
              const success = await logout();
              if (success) {
                navigate('/connexion', { state: { from: location }, replace: true });
              }
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              securityService.logSecurityEvent('LOGOUT_ERROR', { error });
            } finally {
              handlingLogout.current = false;
            }
          }, 10);
        } else if (valid && session) {
          // Vérifier si l'email est vérifié lorsque cela est requis
          if (requiresVerification && session.user && !session.user.email_confirmed_at) {
            securityService.logSecurityEvent('UNVERIFIED_EMAIL_ACCESS_ATTEMPT', {
              userId: session.user.id,
              path: location.pathname
            });
            
            toast({
              title: "Vérification requise",
              description: "Veuillez vérifier votre email avant d'accéder à cette page.",
              variant: "warning",
            });
            
            navigate('/profil', { replace: true });
            setIsCheckingSession(false);
            return;
          }
        }
        
        setIsCheckingSession(false);
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        securityService.logSecurityEvent('SESSION_CHECK_ERROR', { error });
        setIsCheckingSession(false);
        setHasValidSession(false);
      }
    };

    checkAuth();

    // Configuration du gestionnaire d'événements avec protection contre les attaques
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && isAuthenticated && !handlingLogout.current) {
        console.log('ProtectedRoute: Événement SIGNED_OUT détecté');
        securityService.logSecurityEvent('AUTH_STATE_CHANGED', { 
          event, 
          userId: user?.id 
        });
        
        handlingLogout.current = true;
        
        // Utilisation de setTimeout pour éviter les appels bloquants
        setTimeout(async () => {
          try {
            await logout();
            navigate('/connexion', { state: { from: location }, replace: true });
          } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            securityService.logSecurityEvent('LOGOUT_ERROR', { error });
          } finally {
            handlingLogout.current = false;
          }
        }, 10);
      } else if (event === 'USER_UPDATED' && session) {
        securityService.logSecurityEvent('USER_PROFILE_UPDATED', { 
          userId: session.user.id 
        });
      }
    });

    // Nettoyage de l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthenticated, logout, navigate, location, user?.id, adminOnly, requiresVerification]);

  // Pendant la vérification, afficher un état de chargement ou un écran de transition
  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-mental-600">Vérification de session...</div>
    </div>;
  }

  if (!isAuthenticated || !hasValidSession) {
    securityService.logSecurityEvent('PROTECTED_ROUTE_ACCESS_DENIED', { 
      path: location.pathname,
      authenticated: isAuthenticated,
      validSession: hasValidSession
    });
    
    // Redirection vers la page de connexion avec l'URL de retour
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    securityService.logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', { 
      userId: user?.id,
      path: location.pathname
    });
    
    // Si l'accès administrateur est requis mais que l'utilisateur n'est pas administrateur, redirection vers l'accueil
    toast({
      title: "Accès refusé",
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      variant: "destructive",
    });
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
