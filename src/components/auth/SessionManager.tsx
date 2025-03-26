
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

const SESSION_TIMEOUT = 7200000; // 2 heures en millisecondes
const WARNING_TIME = 300000; // 5 minutes avant expiration

export function SessionManager() {
  const { isAuthenticated, logout } = useAuthStore();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Enregistre le dernier timestamp d'activité
    let lastActivity = Date.now();
    
    // Réinitialise le timer d'activité sur interactions utilisateur
    const resetTimer = () => {
      lastActivity = Date.now();
    };
    
    // Vérifie périodiquement si la session a expiré
    const interval = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;
      
      // Si proche de l'expiration, afficher un avertissement
      if (timeElapsed > SESSION_TIMEOUT - WARNING_TIME && timeElapsed < SESSION_TIMEOUT) {
        toast({
          title: "Attention",
          description: "Votre session va expirer dans 5 minutes. Souhaitez-vous rester connecté?",
          action: (
            <button 
              onClick={resetTimer}
              className="bg-cesi-500 text-white px-3 py-1 rounded"
            >
              Rester connecté
            </button>
          ),
          duration: 10000,
        });
      }
      
      // Si la session a expiré, déconnecter l'utilisateur
      if (timeElapsed >= SESSION_TIMEOUT) {
        toast({
          title: "Session expirée",
          description: "Vous avez été déconnecté pour des raisons de sécurité.",
          variant: "destructive",
        });
        logout();
      }
    }, 60000); // Vérifie toutes les minutes
    
    // Ajoute les écouteurs d'événements pour suivre l'activité
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [isAuthenticated, logout, toast]);
  
  return null; // Composant sans rendu
}
