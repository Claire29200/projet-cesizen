
import { useState, useEffect } from "react";
import { Resource } from "@/models/resource";
import { resourceController } from "@/controllers/resourceController";
import { useToast } from "@/components/ui/use-toast";
import { FormCard } from "./FormCard";
import {
  TitleField,
  CategoryField,
  DurationField,
  DescriptionField,
  ContentField,
  ActiveToggle,
  FormButtons
} from "./form-fields";

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
      <FormCard title="Informations générales">
        <TitleField 
          value={formData.title || ""}
          onChange={handleInputChange}
        />
        
        <CategoryField
          value={formData.category || ""}
          categories={categories}
          onChange={handleCategoryChange}
        />
        
        <DurationField
          value={formData.duration || 0}
          onChange={handleNumberChange}
        />
        
        <DescriptionField
          value={formData.description || ""}
          onChange={handleInputChange}
        />
        
        <ContentField
          value={formData.content || ""}
          onChange={handleInputChange}
        />
        
        <ActiveToggle
          checked={formData.isActive || false}
          onCheckedChange={handleActiveChange}
        />
      </FormCard>
      
      <FormButtons 
        isEditing={!!resource}
        onCancel={onCancel}
      />
    </form>
  );
};
