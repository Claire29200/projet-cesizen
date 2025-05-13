
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResourceForm } from "@/components/resources/ResourceForm";
import { Resource } from "@/models/resource";

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (resourceData: Partial<Resource>) => void;
}

export const AddResourceDialog = ({
  open,
  onOpenChange,
  onSubmit
}: AddResourceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ajouter une ressource</DialogTitle>
          <DialogDescription>
            Créez une nouvelle ressource à mettre à disposition des utilisateurs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ResourceForm
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
