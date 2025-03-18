
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useContentStore } from "@/store/contentStore";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  InfoPageList,
  AddPageDialog,
  DeletePageDialog,
  EditPageForm
} from "@/components/admin/info-pages";
import { InfoPage, Section } from "@/store/contentStore";

const AdminInformations = () => {
  const { infoPages, addInfoPage, updateInfoPage, removeInfoPage } = useContentStore();
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isDeletePageDialogOpen, setIsDeletePageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState<InfoPage | null>(null);
  const { toast } = useToast();
  
  const handleAddPage = (pageData: {
    title: string;
    slug: string;
    isPublished: boolean;
    sections: Omit<Section, "id" | "updatedAt">[];
  }) => {
    if (!pageData.title || !pageData.slug) {
      toast({
        title: "Erreur",
        description: "Le titre et le slug sont obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    const isValidSections = pageData.sections.every(
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
    
    const sectionsWithIds = pageData.sections.map((section) => ({
      ...section,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      updatedAt: new Date().toISOString(),
    }));
    
    addInfoPage({
      title: pageData.title,
      slug: pageData.slug,
      isPublished: pageData.isPublished,
      sections: sectionsWithIds,
    });
    
    setIsAddPageDialogOpen(false);
    
    toast({
      title: "Succès",
      description: "La page d'information a été créée avec succès.",
    });
  };
  
  const handleEditPage = (page: InfoPage) => {
    setSelectedPage({ ...page });
    setIsEditMode(true);
  };
  
  const handleSectionChange = (index: number, field: "title" | "content", value: string) => {
    if (!selectedPage) return;
    
    const updatedSections = [...selectedPage.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    };
    
    setSelectedPage({
      ...selectedPage,
      sections: updatedSections,
    });
  };
  
  const handleAddSection = () => {
    if (selectedPage) {
      setSelectedPage({
        ...selectedPage,
        sections: [...selectedPage.sections, { 
          id: Date.now().toString(),
          title: "",
          content: "",
          updatedAt: new Date().toISOString()
        }],
      });
    }
  };
  
  const handleRemoveSection = (index: number) => {
    if (!selectedPage) return;
    
    const updatedSections = [...selectedPage.sections];
    updatedSections.splice(index, 1);
    setSelectedPage({
      ...selectedPage,
      sections: updatedSections,
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
                  
                  <InfoPageList 
                    pages={infoPages}
                    onEdit={handleEditPage}
                    onDelete={(page) => {
                      setSelectedPage(page);
                      setIsDeletePageDialogOpen(true);
                    }}
                  />
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
                  </div>
                  
                  {selectedPage && (
                    <EditPageForm
                      page={selectedPage}
                      onCancel={() => {
                        setIsEditMode(false);
                        setSelectedPage(null);
                      }}
                      onUpdate={(updatedPage) => {
                        if (updatedPage !== selectedPage) {
                          setSelectedPage(updatedPage);
                        } else {
                          handleUpdatePage();
                        }
                      }}
                      onSectionChange={handleSectionChange}
                      onAddSection={handleAddSection}
                      onRemoveSection={handleRemoveSection}
                    />
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <AddPageDialog
        isOpen={isAddPageDialogOpen}
        onOpenChange={setIsAddPageDialogOpen}
        onAddPage={handleAddPage}
      />
      
      <DeletePageDialog
        isOpen={isDeletePageDialogOpen}
        onOpenChange={setIsDeletePageDialogOpen}
        page={selectedPage}
        onDelete={handleDeletePage}
      />
    </div>
  );
};

export default AdminInformations;
