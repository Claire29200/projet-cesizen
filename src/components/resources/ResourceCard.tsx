
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Clock, Calendar, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/auth";

interface Resource {
  id: string;
  title: string;
  description: string;
  duration?: number;
  category: string;
  isFavorite?: boolean;
  createdAt: string;
}

interface ResourceCardProps {
  resource: Resource;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  isAdmin?: boolean;
  onEdit?: (resource: Resource) => void;
  onDelete?: (resource: Resource) => void;
}

export const ResourceCard = ({ 
  resource, 
  onToggleFavorite, 
  isAdmin = false,
  onEdit,
  onDelete
}: ResourceCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(resource.isFavorite || false);
  
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter une ressource à vos favoris.",
        variant: "destructive",
      });
      return;
    }
    
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    if (onToggleFavorite) {
      onToggleFavorite(resource.id, newFavoriteStatus);
    }
    
    toast({
      title: newFavoriteStatus ? "Ajouté aux favoris" : "Retiré des favoris",
      description: `"${resource.title}" a été ${newFavoriteStatus ? "ajouté à" : "retiré de"} vos favoris.`,
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <CardDescription className="mt-1">
              {resource.category && (
                <Badge variant="outline" className="mr-2 bg-mental-50">
                  {resource.category}
                </Badge>
              )}
            </CardDescription>
          </div>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className={`${
                isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
              }`}
              onClick={handleToggleFavorite}
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-mental-600 line-clamp-3">{resource.description}</p>
        
        <div className="flex items-center gap-4 mt-4">
          {resource.duration && (
            <div className="flex items-center text-mental-500 text-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{resource.duration} min</span>
            </div>
          )}
          <div className="flex items-center text-mental-500 text-xs">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{new Date(resource.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          <Info className="h-3.5 w-3.5 mr-1" />
          Détails
        </Button>
        
        {isAdmin && (
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => onEdit(resource)}
              >
                Modifier
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm" 
                className="text-xs"
                onClick={() => onDelete(resource)}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
