import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { contentController } from "@/controllers/contentController";
import { InfoPage, Section } from "@/models/content";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ResourceForm } from "@/components/resources/ResourceForm";

const UserResources = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [resources, setResources] = useState<InfoPage[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<InfoPage | null>(null);
  
  const fetchUserResources = () => {
    if (user?.id) {
      const userResources = contentController.getUserInfoPages(user.id);
      setResources(userResources);
    }
  };
  
  useEffect(() => {
    fetchUserResources();
  }, [user]);
  
  const handleAddResource = (resourceData: {
    title: string;
    slug: string;
    isPublished: boolean;
    sections: Section[];
  }) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter une ressource.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      contentController.addInfoPage({
        ...resourceData,
        userId: user.id,
      });
      
      setIsAddDialogOpen(false);
      fetchUserResources();
      
      toast({
        title: "Succès",
        description: "Votre ressource a été ajoutée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre ressource.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateResource = (resourceData: InfoPage) => {
    if (!selectedResource) return;
    
    try {
      contentController.updateInfoPage(selectedResource.id, resourceData);
      
      setIsEditDialogOpen(false);
      setSelectedResource(null);
      fetchUserResources();
      
      toast({
        title: "Succès",
        description: "Votre ressource a été mise à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre ressource.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteResource = () => {
    if (!selectedResource) return;
    
    try {
      contentController.deleteInfoPage(selectedResource.id);
      
      setIsDeleteDialogOpen(false);
      setSelectedResource(null);
      fetchUserResources();
      
      toast({
        title: "Succès",
        description: "Votre ressource a été supprimée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer votre ressource.",
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-mental-800 mb-4">Mes ressources</h1>
            <p className="text-mental-600 mb-8">Vous devez être connecté pour gérer vos ressources.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-mental-800 mb-2">
                  Mes ressources
                </h1>
                <p className="text-mental-600">
                  Gérez vos articles et ressources personnelles sur la santé mentale
                </p>
              </div>
              <Button
                className="mt-4 sm:mt-0"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une ressource
              </Button>
            </div>
            
            {resources.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <FileText className="h-12 w-12 text-mental-300" />
                  </div>
                  <h3 className="text-xl font-medium text-mental-700 mb-2">Aucune ressource trouvée</h3>
                  <p className="text-mental-500 mb-6">
                    Vous n'avez pas encore créé de ressources. Commencez par en ajouter une.
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter ma première ressource
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                  <Card key={resource.id} className="h-full">
                    <CardHeader>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs mr-2 ${
                          resource.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {resource.isPublished ? "Publié" : "Brouillon"}
                        </span>
                        <span className="text-mental-500 text-xs">
                          Dernière mise à jour: {new Date(resource.updatedAt).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-mental-600 line-clamp-3">
                        {resource.sections[0]?.content.substring(0, 150)}...
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" asChild>
                        <a href={`/informations/${resource.slug}`} target="_blank" rel="noopener noreferrer">
                          Voir
                        </a>
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedResource(resource);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedResource(resource);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Ajouter une ressource</DialogTitle>
            <DialogDescription>
              Créez une nouvelle ressource sur la santé mentale pour partager vos connaissances.
            </DialogDescription>
          </DialogHeader>
          
          <ResourceForm
            onSubmit={handleAddResource}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Modifier une ressource</DialogTitle>
            <DialogDescription>
              Mettez à jour votre ressource sur la santé mentale.
            </DialogDescription>
          </DialogHeader>
          
          {selectedResource && (
            <ResourceForm
              resource={selectedResource}
              onSubmit={handleUpdateResource}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedResource(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement votre ressource et toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedResource && (
            <div className="py-4">
              <p className="text-mental-800">
                Vous êtes sur le point de supprimer la ressource <span className="font-medium">{selectedResource.title}</span>.
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteResource} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserResources;
