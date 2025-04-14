
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavigationItem {
  title: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  items: NavigationItem[];
  currentPath: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogoutClick: () => void;
}

export function MobileMenu({ 
  isOpen, 
  items, 
  currentPath, 
  isAuthenticated, 
  isAdmin, 
  onLogoutClick 
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in">
        {items.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
              currentPath === item.path
                ? "bg-cesi-100 dark:bg-cesi-900/20 text-cesi-500"
                : "text-cesi-700 dark:text-gray-300 hover:bg-cesi-50 dark:hover:bg-cesi-900/10 hover:text-cesi-500"
            }`}
          >
            {item.title}
          </Link>
        ))}
        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-700">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-2 px-3">
              <Button asChild variant="outline" className="w-full justify-center">
                <Link to="/connexion">Connexion</Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link to="/inscription">S'inscrire</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-3">
              {isAdmin && (
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link to="/admin">Administration</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full justify-center">
                <Link to="/profil">Profil</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-center text-destructive"
                onClick={onLogoutClick}
              >
                Déconnexion
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
