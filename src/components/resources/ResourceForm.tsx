
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InfoPage } from "@/models/content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface ResourceFormProps {
  resource?: InfoPage;
  onSubmit: (resourceData: any) => void;
  onCancel: () => void;
}

export const ResourceForm = ({ resource, onSubmit, onCancel }: ResourceFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isPublished: true,
    sections: [{ title: "", content: "" }]
  });
  
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        slug: resource.slug,
        isPublished: resource.isPublished,
        sections: resource.sections.map(s => ({
          title: s.title,
          content: s.content,
          id: s.id,
          updatedAt: s.updatedAt
        }))
      });
    }
  }, [resource]);
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "title" && !resource) {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handlePublishedChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isPublished: checked
    });
  };
  
  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };
  
  const handleAddSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", content: "" }]
    });
  };
  
  const handleRemoveSection = (index: number) => {
    if (formData.sections.length <= 1) return;
    
    const updatedSections = [...formData.sections];
    updatedSections.splice(index, 1);
    
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            placeholder="Titre de votre ressource"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug{" "}
            <span className="text-xs text-mental-500">
              (utilisé dans l'URL)
            </span>
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="slug-de-votre-ressource"
            value={formData.slug}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.isPublished}
          onCheckedChange={handlePublishedChange}
        />
        <Label htmlFor="published">Publier cette ressource</Label>
      </div>
      
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-mental-800">
            Sections
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSection}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une section
          </Button>
        </div>
        
        {formData.sections.map((section, index) => (
          <Card key={index} className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Section {index + 1}</CardTitle>
                {formData.sections.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleRemoveSection(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`section-${index}-title`}>
                  Titre de la section
                </Label>
                <Input
                  id={`section-${index}-title`}
                  placeholder="Titre de la section"
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`section-${index}-content`}>
                  Contenu de la section
                </Label>
                <Textarea
                  id={`section-${index}-content`}
                  rows={6}
                  placeholder="Contenu de la section..."
                  value={section.content}
                  onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                  required
                />
                <p className="text-xs text-mental-500">
                  Utilisez deux sauts de ligne pour les paragraphes. Entourez le texte de ** pour le mettre en gras.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
