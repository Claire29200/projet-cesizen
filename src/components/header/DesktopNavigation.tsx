
import { Link } from "react-router-dom";

interface NavigationItem {
  title: string;
  path: string;
}

interface DesktopNavigationProps {
  items: NavigationItem[];
  currentPath: string;
}

export function DesktopNavigation({ items, currentPath }: DesktopNavigationProps) {
  return (
    <nav className="hidden md:flex space-x-6">
      {items.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`transition-colors duration-200 font-medium hover:text-cesi-500 ${
            currentPath === item.path ? "text-cesi-500" : "text-cesi-700 dark:text-white"
          }`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
