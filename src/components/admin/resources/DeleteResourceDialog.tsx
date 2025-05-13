
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Resource } from "@/models/resource";

interface DeleteResourceDialogProps {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteResourceDialog = ({
  resource,
  open,
  onOpenChange,
  onConfirm
}: DeleteResourceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la ressource</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette ressource ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        {resource && (
          <div className="py-4">
            <p className="text-mental-800">
              Vous êtes sur le point de supprimer la ressource{" "}
              <span className="font-medium">{resource.title}</span>.
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
