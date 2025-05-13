
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { Resource } from "@/models/resource";
import { resourceController } from "@/controllers/resourceController";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Search, Plus, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>(resourceController.getActiveResources());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [isEditResourceDialogOpen, setIsEditResourceDialogOpen] = useState(false);
  const [isDeleteResourceDialogOpen, setIsDeleteResourceDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "edit">("list");
  const { toast } = useToast();
  
  // Filtrer les ressources en fonction de la recherche et de la catégorie
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Récupérer les catégories uniques
  const categories = resourceController.getResourceCategories();
  
  // Gérer l'ajout d'une ressource
  const handleAddResource = (resourceData: Partial<Resource>) => {
    const newResource = resourceController.createResource({
      title: resourceData.title!,
      description: resourceData.description!,
      content: resourceData.content,
      category: resourceData.category!,
      duration: resourceData.duration,
      isActive: resourceData.isActive ?? true,
    });
    
    setResources([...resources, newResource]);
    setIsAddResourceDialogOpen(false);
    
    toast({
      title: "Succès",
      description: "La ressource a été créée avec succès.",
    });
  };
  
  // Gérer la mise à jour d'une ressource
  const handleUpdateResource = (resourceData: Partial<Resource>) => {
    if (!selectedResource) return;
    
    const updatedResource = resourceController.updateResource(
      selectedResource.id,
      resourceData
    );
    
    if (updatedResource) {
      setResources(
        resources.map((r) => (r.id === updatedResource.id ? updatedResource : r))
      );
      
      toast({
        title: "Succès",
        description: "La ressource a été mise à jour avec succès.",
      });
      
      setViewMode("list");
      setSelectedResource(null);
    }
  };
  
  // Gérer la suppression d'une ressource
  const handleDeleteResource = () => {
    if (!selectedResource) return;
    
    const success = resourceController.deleteResource(selectedResource.id);
    
    if (success) {
      setResources(resources.filter((r) => r.id !== selectedResource.id));
      
      toast({
        title: "Succès",
        description: "La ressource a été supprimée avec succès.",
      });
      
      setIsDeleteResourceDialogOpen(false);
      setSelectedResource(null);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {viewMode === "list" ? (
                  <>
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
                        onClick={() => setIsAddResourceDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une ressource
                      </Button>
                    </div>
                    
                    <Card className="mb-6">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                          <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
                            <Input
                              type="text"
                              placeholder="Rechercher une ressource..."
                              className="pl-10"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="flex-shrink-0 flex items-center">
                            <Filter className="h-5 w-5 text-mental-500 mr-2" />
                            <select
                              className="border rounded py-2 px-3 bg-white"
                              value={selectedCategory || ""}
                              onChange={(e) => setSelectedCategory(e.target.value || null)}
                            >
                              <option value="">Toutes catégories</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredResources.length > 0 ? (
                            filteredResources.map((resource) => (
                              <ResourceCard
                                key={resource.id}
                                resource={resource}
                                isAdmin={true}
                                onEdit={(resource) => {
                                  setSelectedResource(resource);
                                  setViewMode("edit");
                                }}
                                onDelete={(resource) => {
                                  setSelectedResource(resource);
                                  setIsDeleteResourceDialogOpen(true);
                                }}
                              />
                            ))
                          ) : (
                            <div className="col-span-full py-8 text-center">
                              <p className="text-mental-500">Aucune ressource trouvée</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-mental-800">
                        {selectedResource ? "Modifier la ressource" : "Nouvelle ressource"}
                      </h2>
                      <Button variant="outline" onClick={() => {
                        setViewMode("list");
                        setSelectedResource(null);
                      }}>
                        Retour à la liste
                      </Button>
                    </div>
                    
                    <ResourceForm
                      resource={selectedResource || undefined}
                      onSubmit={selectedResource ? handleUpdateResource : handleAddResource}
                      onCancel={() => {
                        setViewMode("list");
                        setSelectedResource(null);
                      }}
                    />
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Resource Dialog */}
      <Dialog open={isAddResourceDialogOpen} onOpenChange={setIsAddResourceDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ajouter une ressource</DialogTitle>
            <DialogDescription>
              Créez une nouvelle ressource à mettre à disposition des utilisateurs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ResourceForm
              onSubmit={handleAddResource}
              onCancel={() => setIsAddResourceDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Resource Dialog */}
      <Dialog open={isDeleteResourceDialogOpen} onOpenChange={setIsDeleteResourceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la ressource</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {selectedResource && (
            <div className="py-4">
              <p className="text-mental-800">
                Vous êtes sur le point de supprimer la ressource{" "}
                <span className="font-medium">{selectedResource.title}</span>.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteResourceDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteResource}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminResources;
