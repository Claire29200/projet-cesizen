
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { migrateInitialContent } from "@/utils/migrateInitialContent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export const MigrateContentHome = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ success: boolean, message: string } | null>(null);

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    
    try {
      const result = await migrateInitialContent();
      setMigrationResult(result);
      
      if (result.success) {
        toast({
          title: "Succès",
          description: result.message,
        });
      } else {
        toast({
          title: "Information",
          description: result.message,
        });
      }
    } catch (error) {
      setMigrationResult({
        success: false,
        message: `Une erreur est survenue: ${error instanceof Error ? error.message : String(error)}`
      });
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la migration des données",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="mt-8 mb-12 flex flex-col items-center">
      <p className="text-center text-mental-600 mb-4">
        Pour initialiser le contenu de l'application, vous devez d'abord migrer les données.
      </p>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="default"
        className="bg-mental-600 hover:bg-mental-700"
      >
        Migrer les données initiales
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Migration des données initiales</DialogTitle>
            <DialogDescription>
              Cette action migrera les données initiales du store vers Supabase. Cette opération ne doit être effectuée qu'une seule fois.
              Si des données existent déjà dans Supabase, la migration sera annulée.
            </DialogDescription>
          </DialogHeader>
          
          {migrationResult ? (
            <div className={`p-4 rounded-md ${migrationResult.success ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
              {migrationResult.message}
            </div>
          ) : (
            <p className="py-4">
              Voulez-vous procéder à la migration des données initiales ?
            </p>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                Fermer
              </Button>
            </DialogClose>
            
            {!migrationResult && (
              <Button 
                onClick={handleMigration} 
                disabled={isMigrating}
              >
                {isMigrating ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                    Migration en cours...
                  </>
                ) : (
                  "Confirmer la migration"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
