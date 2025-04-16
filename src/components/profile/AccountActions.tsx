
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AccountActions = () => {
  const { logout } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };
  
  const confirmLogout = async () => {
    setIsLoading(true);
    try {
      console.log('AccountActions: Déconnexion initiée');
      const success = await logout();
      if (!success) {
        toast.error("Erreur lors de la déconnexion");
      } else {
        console.log('AccountActions: Déconnexion réussie, redirection');
        toast.success("Déconnexion réussie");
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
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
      
      <LogoutConfirmDialog 
        isOpen={showLogoutDialog} 
        onClose={() => !isLoading && setShowLogoutDialog(false)} 
        onConfirm={confirmLogout} 
      />
    </>
  );
};
