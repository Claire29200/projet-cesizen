
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InfoPage } from "@/store/contentStore";

interface DeletePageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  page: InfoPage | null;
  onDelete: () => void;
}

export const DeletePageDialog = ({
  isOpen,
  onOpenChange,
  page,
  onDelete,
}: DeletePageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la page</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette page ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        {page && (
          <div className="py-4">
            <p className="text-mental-800">
              Vous êtes sur le point de supprimer la page <span className="font-medium">{page.title}</span>.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
