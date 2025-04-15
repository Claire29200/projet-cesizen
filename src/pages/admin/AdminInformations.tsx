import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { InfoPage } from "@/models/content";
import { contentController } from "@/controllers/contentController";
import {
  InfoPageList,
  AddPageDialog,
  DeletePageDialog,
  EditPageForm,
  MigrateContentButton
} from "@/components/admin/info-pages";

const AdminInformations = () => {
  const [infoPages, setInfoPages] = useState<InfoPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isDeletePageDialogOpen, setIsDeletePageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState<InfoPage | null>(null);
  const { toast } = useToast();

  const fetchInfoPages = async () => {
    setLoading(true);
    try {
      const pages = await contentController.getInfoPages();
      setInfoPages(pages);
    } catch (error) {
      console.error("Erreur lors de la récupération des pages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les pages d'information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfoPages();
  }, []);
  
  const handleAddPage = async (pageData: {
    title: string;
    slug: string;
    isPublished: boolean;
    sections: {
      title: string;
      content: string;
    }[];
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
    
    try {
      await contentController.addInfoPage({
        title: pageData.title,
        slug: pageData.slug,
        isPublished: pageData.isPublished,
        sections: pageData.sections.map(section => ({
          ...section,
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          updatedAt: new Date().toISOString()
        })),
      });
      
      setIsAddPageDialogOpen(false);
      fetchInfoPages();
      
      toast({
        title: "Succès",
        description: "La page d'information a été créée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la création de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la page d'information",
        variant: "destructive",
      });
    }
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
  
  const handleUpdatePage = async () => {
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
    
    try {
      await contentController.updateInfoPage(selectedPage.id, {
        ...selectedPage,
        updatedAt: new Date().toISOString(),
      });
      
      setIsEditMode(false);
      setSelectedPage(null);
      fetchInfoPages();
      
      toast({
        title: "Succès",
        description: "La page d'information a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la page d'information",
        variant: "destructive",
      });
    }
  };
  
  const handleDeletePage = async () => {
    if (!selectedPage) return;
    
    try {
      await contentController.deleteInfoPage(selectedPage.id);
      
      setIsDeletePageDialogOpen(false);
      setSelectedPage(null);
      fetchInfoPages();
      
      toast({
        title: "Succès",
        description: "La page d'information a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la page:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la page d'information",
        variant: "destructive",
      });
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mental-600 mx-auto"></div>
                  <p className="text-mental-600 mt-4">Chargement des pages d'information...</p>
                </div>
              ) : !isEditMode ? (
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
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <MigrateContentButton />
                      <Button
                        onClick={() => setIsAddPageDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une page
                      </Button>
                    </div>
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
