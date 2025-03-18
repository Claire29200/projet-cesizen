
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, FileText, Activity, Home } from "lucide-react";

export function AdminSidebar() {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Tableau de bord",
      path: "/admin",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      title: "Utilisateurs",
      path: "/admin/utilisateurs",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      title: "Informations",
      path: "/admin/informations",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      title: "Diagnostics",
      path: "/admin/diagnostics",
      icon: <Activity className="h-4 w-4 mr-2" />,
    },
  ];
  
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-lg border p-4 mb-6 md:mb-0 md:sticky md:top-24">
        <h2 className="font-semibold text-mental-800 mb-4 px-2">Administration</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  location.pathname === item.path
                    ? "bg-mental-100 text-mental-800"
                    : "text-mental-600 hover:text-mental-800"
                }`}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-6 pt-6 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full">
              Retour au site
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
