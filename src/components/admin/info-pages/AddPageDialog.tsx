
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentSection } from "@/store/contentStore";

interface AddPageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPage: (pageData: {
    title: string;
    slug: string;
    isPublished: boolean;
    sections: Omit<ContentSection, "id" | "updatedAt">[];
  }) => void;
}

export const AddPageDialog = ({
  isOpen,
  onOpenChange,
  onAddPage,
}: AddPageDialogProps) => {
  const [newPageData, setNewPageData] = useState({
    title: "",
    slug: "",
    isPublished: true,
    sections: [{ title: "", content: "" }],
  });

  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    const updatedSections = [...newPageData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    setNewPageData({
      ...newPageData,
      sections: updatedSections,
    });
  };

  const handleAddSection = () => {
    setNewPageData({
      ...newPageData,
      sections: [...newPageData.sections, { title: "", content: "" }],
    });
  };

  const handleRemoveSection = (index: number) => {
    const updatedSections = [...newPageData.sections];
    updatedSections.splice(index, 1);
    setNewPageData({
      ...newPageData,
      sections: updatedSections,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleSubmit = () => {
    onAddPage(newPageData);
    setNewPageData({
      title: "",
      slug: "",
      isPublished: true,
      sections: [{ title: "", content: "" }],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajouter une page d'information</DialogTitle>
          <DialogDescription>
            Créez une nouvelle page d'information pour le site.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Titre de la page"
                value={newPageData.title}
                onChange={(e) =>
                  setNewPageData({
                    ...newPageData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
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
                placeholder="slug-de-la-page"
                value={newPageData.slug}
                onChange={(e) =>
                  setNewPageData({
                    ...newPageData,
                    slug: e.target.value,
                  })
                }
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={newPageData.isPublished}
              onCheckedChange={(checked) =>
                setNewPageData({
                  ...newPageData,
                  isPublished: checked,
                })
              }
            />
            <Label htmlFor="published">Publié</Label>
          </div>
          
          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-mental-800">
                Sections
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSection}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une section
              </Button>
            </div>
            
            {newPageData.sections.map((section, index) => (
              <Card key={index} className="mb-6">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle>Section {index + 1}</CardTitle>
                    {newPageData.sections.length > 1 && (
                      <Button
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
                    <Label htmlFor={`new-section-${index}-title`}>
                      Titre de la section
                    </Label>
                    <Input
                      id={`new-section-${index}-title`}
                      placeholder="Titre de la section"
                      value={section.title}
                      onChange={(e) =>
                        handleSectionChange(index, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`new-section-${index}-content`}>
                      Contenu de la section
                    </Label>
                    <Textarea
                      id={`new-section-${index}-content`}
                      rows={6}
                      placeholder="Contenu de la section..."
                      value={section.content}
                      onChange={(e) =>
                        handleSectionChange(index, "content", e.target.value)
                      }
                    />
                    <p className="text-xs text-mental-500">
                      Utilisez deux sauts de ligne pour les paragraphes. Entourez le texte de ** pour le mettre en gras.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer la page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
