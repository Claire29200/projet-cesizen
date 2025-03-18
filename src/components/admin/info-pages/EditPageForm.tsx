
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { InfoPage, Section } from "@/store/contentStore";

interface EditPageFormProps {
  page: InfoPage;
  onCancel: () => void;
  onUpdate: (page: InfoPage) => void;
  onSectionChange: (index: number, field: "title" | "content", value: string) => void;
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
}

export const EditPageForm = ({
  page,
  onCancel,
  onUpdate,
  onSectionChange,
  onAddSection,
  onRemoveSection,
}: EditPageFormProps) => {
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Titre</Label>
            <Input
              id="edit-title"
              value={page.title}
              onChange={(e) =>
                onUpdate({
                  ...page,
                  title: e.target.value,
                  slug: page?.slug || generateSlug(e.target.value),
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-slug">
              Slug{" "}
              <span className="text-xs text-mental-500">
                (utilisé dans l'URL)
              </span>
            </Label>
            <Input
              id="edit-slug"
              value={page.slug}
              onChange={(e) =>
                onUpdate({
                  ...page,
                  slug: e.target.value,
                })
              }
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="edit-published"
            checked={page.isPublished}
            onCheckedChange={(checked) =>
              onUpdate({
                ...page,
                isPublished: checked,
              })
            }
          />
          <Label htmlFor="edit-published">Publié</Label>
        </div>
        
        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-mental-800">
              Sections
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onAddSection}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une section
            </Button>
          </div>
          
          {page.sections.map((section: Section, index: number) => (
            <Card key={section.id || index} className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Section {index + 1}</CardTitle>
                  {page.sections.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => onRemoveSection(index)}
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
                    value={section.title}
                    onChange={(e) =>
                      onSectionChange(index, "title", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`section-${index}-content`}>
                    Contenu de la section
                  </Label>
                  <Textarea
                    id={`section-${index}-content`}
                    rows={6}
                    value={section.content}
                    onChange={(e) =>
                      onSectionChange(index, "content", e.target.value)
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
        
        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button onClick={() => onUpdate(page)}>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};
