
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuToggle({ isOpen, onClick }: MobileMenuToggleProps) {
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label="Menu principal"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </Button>
  );
}
