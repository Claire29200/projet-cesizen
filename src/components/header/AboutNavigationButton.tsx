
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AboutNavigationButtonProps {
  currentPath: string;
}

export function AboutNavigationButton({ currentPath }: AboutNavigationButtonProps) {
  return (
    <Button asChild variant={currentPath === "/a-propos" ? "default" : "ghost"}>
      <Link to="/a-propos">
        À propos
      </Link>
    </Button>
  );
}
