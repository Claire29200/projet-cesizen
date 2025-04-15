import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { useAuthStore } from "@/store/auth";

export function LogoutButton() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useAuthStore();

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={handleLogoutClick} 
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>

      <LogoutConfirmDialog 
        isOpen={showLogoutDialog}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
