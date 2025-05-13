
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ResourceHeaderProps {
  onAddResource: () => void;
}

export const ResourceHeader = ({ onAddResource }: ResourceHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-mental-800 mb-2">
          Gestion des ressources
        </h1>
        <p className="text-mental-600">
          Gérez les ressources et activités proposées aux utilisateurs
        </p>
      </div>
      <Button
        className="mt-4 sm:mt-0"
        onClick={onAddResource}
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une ressource
      </Button>
    </div>
  );
};
