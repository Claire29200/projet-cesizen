
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutConfirmDialog } from "@/components/auth/LogoutConfirmDialog";
import { Logo } from "@/components/header/Logo";
import { DesktopNavigation } from "@/components/header/DesktopNavigation";
import { AuthButtons } from "@/components/header/AuthButtons";
import { MobileMenu } from "@/components/header/MobileMenu";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
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
            <Logo />
          </div>

          {/* Desktop Menu */}
          <DesktopNavigation items={menuItems} currentPath={location.pathname} />

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <AuthButtons 
              isAuthenticated={isAuthenticated} 
              isAdmin={isAdmin} 
              onLogoutClick={handleLogoutClick} 
            />
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
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        items={menuItems}
        currentPath={location.pathname}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogoutClick={handleLogoutClick}
      />

      {/* Dialogue de confirmation de déconnexion */}
      <LogoutConfirmDialog 
        isOpen={showLogoutDialog}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}
