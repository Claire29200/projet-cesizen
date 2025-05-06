
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogoutClick: () => void;
}

export function AuthButtons({ isAuthenticated, isAdmin, onLogoutClick }: AuthButtonsProps) {
  // Créer automatiquement les utilisateurs de démonstration au chargement de l'application
  const { createDemoUsers } = useAuthStore();
  
  useEffect(() => {
    // Tentative de création des utilisateurs de démonstration au chargement
    const initDemoUsers = async () => {
      try {
        await createDemoUsers();
        console.log('Utilisateurs de démonstration initialisés');
      } catch (error) {
        console.error('Erreur d\'initialisation des utilisateurs de démonstration:', error);
      }
    };
    
    initDemoUsers();
  }, [createDemoUsers]);

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
      <LogoutButton />
    </div>
  );
}
