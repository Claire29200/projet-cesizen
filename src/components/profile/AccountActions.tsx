
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
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };
  
  const confirmLogout = async () => {
    const success = await logout();
    if (!success) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      navigate('/', { replace: true });
    }
    setShowLogoutDialog(false);
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
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </CardContent>
      </Card>
      
      <LogoutConfirmDialog 
        isOpen={showLogoutDialog} 
        onClose={() => setShowLogoutDialog(false)} 
        onConfirm={confirmLogout} 
      />
    </>
  );
};
