import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useContentStore } from "@/store/contentStore";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Eye, FileText } from "lucide-react";

const AdminInformations = () => {
  const { infoPages, addInfoPage, updateInfoPage, removeInfoPage } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isDeletePageDialogOpen, setIsDeletePageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [newPageData, setNewPageData] = useState({
    title: "",
    slug: "",
    isPublished: true,
    sections: [{ title: "", content: "" }],
  });
  const { toast } = useToast();
  
  const filteredPages = infoPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddSection = () => {
    if (isEditMode && selectedPage) {
      setSelectedPage({
        ...selectedPage,
        sections: [...selectedPage.sections, { id: Date.now().toString(), title: "", content: "" }],
      });
    } else {
      setNewPageData({
        ...newPageData,
        sections: [...newPageData.sections, { title: "", content: "" }],
      });
    }
  };
  
  const handleRemoveSection = (index: number) => {
    if (isEditMode && selectedPage) {
      const updatedSections = [...selectedPage.sections];
      updatedSections.splice(index, 1);
      setSelectedPage({
        ...selectedPage,
        sections: updatedSections,
      });
    } else {
      const updatedSections = [...newPageData.sections];
      updatedSections.splice(index, 1);
      setNewPageData({
        ...newPageData,
        sections: updatedSections,
      });
    }
  };
  
  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    if (isEditMode && selectedPage) {
      const updatedSections = [...selectedPage.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value,
      };
      setSelectedPage({
        ...selectedPage,
        sections: updatedSections,
      });
    } else {
      const updatedSections = [...newPageData.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value,
      };
      setNewPageData({
        ...newPageData,
        sections: updatedSections,
      });
    }
  };
  
  const handleAddPage = () => {
    if (!newPageData.title || !newPageData.slug) {
      toast({
        title: "Erreur",
        description: "Le titre et le slug sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    const isValidSections = newPageData.sections.every(
      (section) => section.title.trim() !== "" && section.content.trim() !== ""
    );
    
    if (!isValidSections) {
      toast({
        title: "Erreur",
        description: "Tous les titres et contenus des sections doivent être remplis.",
        variant: "destructive",
      });
      return;
    }
    
    const sectionsWithIds = newPageData.sections.map((section) => ({
      ...section,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      updatedAt: new Date(),
    }));
    
    addInfoPage({
      title: newPageData.title,
      slug: newPageData.slug,
      isPublished: newPageData.isPublished,
      sections: sectionsWithIds,
    });
    
    setNewPageData({
      title: "",
      slug: "",
      isPublished: true,
      sections: [{ title: "", content: "" }],
    });
    
    setIsAddPageDialogOpen(false);
    
    toast({
      title: "Succès",
      description: "La page d'information a été créée avec succès.",
    });
  };
  
  const handleUpdatePage = () => {
    if (!selectedPage) return;
    
    if (!selectedPage.title || !selectedPage.slug) {
      toast({
        title: "Erreur",
        description: "Le titre et le slug sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    const isValidSections = selectedPage.sections.every(
      (section: any) => section.title.trim() !== "" && section.content.trim() !== ""
    );
    
    if (!isValidSections) {
      toast({
        title: "Erreur",
        description: "Tous les titres et contenus des sections doivent être remplis.",
        variant: "destructive",
      });
      return;
    }
    
    updateInfoPage({
      ...selectedPage,
      updatedAt: new Date().toISOString(),
    });
    
    setIsEditMode(false);
    setSelectedPage(null);
    
    toast({
      title: "Succès",
      description: "La page d'information a été mise à jour avec succès.",
    });
  };
  
  const handleDeletePage = () => {
    if (!selectedPage) return;
    
    removeInfoPage(selectedPage.id);
    setIsDeletePageDialogOpen(false);
    setSelectedPage(null);
    
    toast({
      title: "Succès",
      description: "La page d'information a été supprimée avec succès.",
    });
  };
  
  const handleEditPage = (page: any) => {
    setSelectedPage({ ...page });
    setIsEditMode(true);
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            
            <div className="flex-1">
              {!isEditMode ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-mental-800 mb-2">
                        Gestion des informations
                      </h1>
                      <p className="text-mental-600">
                        Gérez les pages d'informations de la plateforme
                      </p>
                    </div>
                    <Button
                      className="mt-4 sm:mt-0"
                      onClick={() => setIsAddPageDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une page
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
                        <Input
                          type="text"
                          placeholder="Rechercher une page..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Sections</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Dernière modification</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPages.length > 0 ? (
                            filteredPages.map((page) => (
                              <TableRow key={page.id}>
                                <TableCell className="font-medium">{page.title}</TableCell>
                                <TableCell>{page.slug}</TableCell>
                                <TableCell>{page.sections.length}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                      page.isPublished
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {page.isPublished ? "Publié" : "Brouillon"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {new Date(page.updatedAt).toLocaleDateString("fr-FR")}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      asChild
                                    >
                                      <a
                                        href={`/informations/${page.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </a>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditPage(page)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-600"
                                      onClick={() => {
                                        setSelectedPage(page);
                                        setIsDeletePageDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                Aucune page trouvée
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-mental-800 mb-2">
                        Modifier une page
                      </h1>
                      <p className="text-mental-600">
                        Modifiez le contenu de la page d'information
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(false);
                        setSelectedPage(null);
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Titre</Label>
                          <Input
                            id="edit-title"
                            value={selectedPage?.title || ""}
                            onChange={(e) =>
                              setSelectedPage({
                                ...selectedPage,
                                title: e.target.value,
                                slug: selectedPage?.slug || generateSlug(e.target.value),
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
                            value={selectedPage?.slug || ""}
                            onChange={(e) =>
                              setSelectedPage({
                                ...selectedPage,
                                slug: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-published"
                          checked={selectedPage?.isPublished || false}
                          onCheckedChange={(checked) =>
                            setSelectedPage({
                              ...selectedPage,
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
                            onClick={handleAddSection}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter une section
                          </Button>
                        </div>
                        
                        {selectedPage?.sections.map((section: any, index: number) => (
                          <Card key={section.id || index} className="mb-6">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-center">
                                <CardTitle>Section {index + 1}</CardTitle>
                                {selectedPage.sections.length > 1 && (
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
                                <Label htmlFor={`section-${index}-title`}>
                                  Titre de la section
                                </Label>
                                <Input
                                  id={`section-${index}-title`}
                                  value={section.title}
                                  onChange={(e) =>
                                    handleSectionChange(index, "title", e.target.value)
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
                      
                      <div className="pt-4 flex justify-end">
                        <Button onClick={handleUpdatePage}>
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Page Dialog */}
      <Dialog open={isAddPageDialogOpen} onOpenChange={setIsAddPageDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddPageDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddPage}>
              Créer la page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Page Dialog */}
      <Dialog open={isDeletePageDialogOpen} onOpenChange={setIsDeletePageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la page</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedPage && (
            <div className="py-4">
              <p className="text-mental-800">
                Vous êtes sur le point de supprimer la page <span className="font-medium">{selectedPage.title}</span>.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletePageDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminInformations;
