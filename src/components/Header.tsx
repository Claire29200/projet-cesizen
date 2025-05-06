
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/header/Logo";
import { DesktopNavigation } from "@/components/header/DesktopNavigation";
import { AuthButtons } from "@/components/header/AuthButtons";
import { MobileMenu } from "@/components/header/MobileMenu";
import { MobileMenuToggle } from "@/components/header/MobileMenuToggle";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuthStore();

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
              onLogoutClick={() => {}} 
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1">
            <ThemeToggle />
            <MobileMenuToggle 
              isOpen={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            />
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
        onLogoutClick={() => {}}
      />
    </header>
  );
}
