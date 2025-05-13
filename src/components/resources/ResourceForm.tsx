
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Resource, ResourceCategory } from "@/models/resource";
import { resourceController } from "@/controllers/resourceController";
import { useToast } from "@/components/ui/use-toast";
import { Clock } from "lucide-react";

interface ResourceFormProps {
  resource?: Resource;
  onSubmit: (resourceData: Partial<Resource>) => void;
  onCancel: () => void;
}

export const ResourceForm = ({ resource, onSubmit, onCancel }: ResourceFormProps) => {
  const { toast } = useToast();
  const categories = resourceController.getResourceCategories();
  
  const [formData, setFormData] = useState<Partial<Resource>>({
    title: "",
    description: "",
    content: "",
    category: categories[0]?.name || "",
    duration: 10,
    isActive: true,
  });
  
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        content: resource.content || "",
        category: resource.category,
        duration: resource.duration || 10,
        isActive: resource.isActive
      });
    }
  }, [resource]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };
  
  const handleActiveChange = (checked: boolean) => {
    setFormData({ ...formData, isActive: checked });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Titre de la ressource"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="duration"
                name="duration"
                type="number"
                min={1}
                max={120}
                value={formData.duration}
                onChange={handleNumberChange}
              />
              <Clock className="h-5 w-5 text-mental-400" />
            </div>
            <p className="text-xs text-mental-500">
              Durée estimée pour cette activité (en minutes)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description courte *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brève description de la ressource"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu détaillé</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Instructions détaillées, conseils et informations supplémentaires..."
              rows={6}
              value={formData.content}
              onChange={handleInputChange}
            />
            <p className="text-xs text-mental-500">
              Vous pouvez utiliser du texte simple ou du Markdown pour le formatage
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={handleActiveChange}
            />
            <Label htmlFor="active">Activer cette ressource</Label>
            <p className="text-xs text-mental-500 ml-2">
              (Les ressources inactives ne sont pas visibles par les utilisateurs)
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="pt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {resource ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};
