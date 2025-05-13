
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Resource } from "@/models/resource";
import { resourceController } from "@/controllers/resourceController";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
  ResourceHeader,
  ResourceSearch,
  ResourceGrid,
  DeleteResourceDialog,
  AddResourceDialog
} from "@/components/admin/resources";
import { ResourceForm } from "@/components/resources/ResourceForm";

const AdminResources = () => {
  const [resources, setResources] = useState<Resource[]>(resourceController.getActiveResources());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value || null);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setViewMode("edit");
  };

  const handleDeleteClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteResourceDialogOpen(true);
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
                    <ResourceHeader onAddResource={() => setIsAddResourceDialogOpen(true)} />
                    
                    <Card className="mb-6">
                      <CardContent className="pt-6">
                        <ResourceSearch 
                          searchQuery={searchQuery}
                          onSearchChange={handleSearchChange}
                          selectedCategory={selectedCategory}
                          onCategoryChange={handleCategoryChange}
                          categories={categories}
                        />
                        
                        <ResourceGrid 
                          resources={filteredResources}
                          onEdit={handleEditResource}
                          onDelete={handleDeleteClick}
                        />
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-mental-800">
                        {selectedResource ? "Modifier la ressource" : "Nouvelle ressource"}
                      </h2>
                      <button
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        onClick={() => {
                          setViewMode("list");
                          setSelectedResource(null);
                        }}
                      >
                        Retour à la liste
                      </button>
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
      <AddResourceDialog
        open={isAddResourceDialogOpen}
        onOpenChange={setIsAddResourceDialogOpen}
        onSubmit={handleAddResource}
      />
      
      {/* Delete Resource Dialog */}
      <DeleteResourceDialog
        resource={selectedResource}
        open={isDeleteResourceDialogOpen}
        onOpenChange={setIsDeleteResourceDialogOpen}
        onConfirm={handleDeleteResource}
      />
    </div>
  );
};

export default AdminResources;
