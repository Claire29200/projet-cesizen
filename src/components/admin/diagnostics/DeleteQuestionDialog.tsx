
import { StressQuestion } from "@/store/diagnostic";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  question: StressQuestion | null;
}

export function DeleteQuestionDialog({ 
  isOpen, 
  onClose, 
  onDelete, 
  question 
}: DeleteQuestionDialogProps) {
  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la question</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-mental-800">
            Vous êtes sur le point de supprimer la question :
          </p>
          <p className="font-medium mt-2">"{question.question}"</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
