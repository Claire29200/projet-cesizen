
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogoutClick: () => void;
}

export function AuthButtons({ isAuthenticated, isAdmin, onLogoutClick }: AuthButtonsProps) {
  if (!isAuthenticated) {
    return (
      <>
        <Button asChild variant="ghost">
          <Link to="/connexion">Connexion</Link>
        </Button>
        <Button asChild>
          <Link to="/inscription">S'inscrire</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Button asChild variant="outline">
          <Link to="/admin">Administration</Link>
        </Button>
      )}
      <Button asChild variant="ghost">
        <Link to="/profil">
          <User className="w-4 h-4 mr-2" />
          Profil
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        onClick={onLogoutClick} 
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </div>
  );
}
