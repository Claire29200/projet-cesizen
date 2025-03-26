
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const menuItems = [
    { title: "Accueil", path: "/" },
    { title: "Informations", path: "/informations" },
    { title: "Diagnostic", path: "/diagnostic" },
    { title: "À propos", path: "/a-propos" },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center"
              aria-label="Accueil"
            >
              <div className="w-10 h-10 rounded-full bg-cesi-500 flex items-center justify-center text-white font-semibold text-lg mr-2">
                <svg viewBox="0 0 100 100" width="24" height="24" className="fill-current">
                  <path d="M50 10 C60 30, 80 40, 50 60 C20 40, 40 30, 50 10" strokeWidth="2" className="stroke-white"/>
                </svg>
              </div>
              <div className="font-semibold text-xl tracking-tight">
                <span className="text-cesi-500">CESI</span>
                <span className="text-zen-500">ZEN</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-200 font-medium hover:text-cesi-500 ${
                  location.pathname === item.path ? "text-cesi-500" : "text-cesi-700 dark:text-white"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {!isAuthenticated ? (
              <>
                <Button asChild variant="ghost">
                  <Link to="/connexion">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link to="/inscription">S'inscrire</Link>
                </Button>
              </>
            ) : (
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
                <Button variant="ghost" onClick={logout}>
                  Déconnexion
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
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
                    className="w-full justify-center"
                    onClick={logout}
                  >
                    Déconnexion
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
