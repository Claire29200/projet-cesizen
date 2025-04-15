import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { useAuthStore } from "@/store/auth";

export const AccountActions = () => {
  const { logout } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  const handleLogout = () => {
    setShowLogoutDialog(true);
  };
  
  const confirmLogout = () => {
    logout();
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
