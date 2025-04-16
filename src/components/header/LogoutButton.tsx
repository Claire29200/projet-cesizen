
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (isLoading) return;
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      console.log('LogoutButton: Déconnexion initiée');
      // Mettre un court délai pour permettre à l'UI de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const success = await logout();
      if (!success) {
        toast.error("Erreur lors de la déconnexion");
      } else {
        console.log('LogoutButton: Déconnexion réussie, redirection');
        toast.success("Déconnexion réussie");
        // Force navigation vers la page d'accueil après déconnexion
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoading(false);
      setShowLogoutDialog(false);
    }
  };

  const handleCancelLogout = () => {
    if (isLoading) return;
    setShowLogoutDialog(false);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleLogoutClick} 
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
        disabled={isLoading}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>

      <LogoutConfirmDialog 
        isOpen={showLogoutDialog}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isLoading={isLoading}
      />
    </>
  );
}
