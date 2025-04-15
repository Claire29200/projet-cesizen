
import { StressQuestion } from "@/store/diagnostic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  question: StressQuestion | null;
  setQuestion: (question: StressQuestion | null) => void;
}

export function EditQuestionDialog({ 
  isOpen, 
  onClose, 
  onUpdate, 
  question,
  setQuestion 
}: EditQuestionDialogProps) {
  if (!question) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la question</DialogTitle>
          <DialogDescription>
            Modifiez les détails de la question.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-question">Question</Label>
            <Textarea
              id="edit-question"
              rows={3}
              value={question.question}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  question: e.target.value,
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-order">Ordre</Label>
            <Input
              id="edit-order"
              type="number"
              min="1"
              value={question.order}
              onChange={(e) =>
                setQuestion({
                  ...question,
                  order: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label>Points pour chaque réponse</Label>
            <div className="grid grid-cols-5 gap-2">
              {["Jamais", "Rarement", "Parfois", "Souvent", "Très souvent"].map((label, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`edit-points-${index}`} className="text-xs">
                    {label}
                  </Label>
                  <Input
                    id={`edit-points-${index}`}
                    type="number"
                    min="0"
                    value={question.points[index]}
                    onChange={(e) => {
                      const updatedPoints = [...question.points];
                      updatedPoints[index] = parseInt(e.target.value) || 0;
                      setQuestion({
                        ...question,
                        points: updatedPoints,
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-active"
              checked={question.isActive}
              onCheckedChange={(checked) =>
                setQuestion({
                  ...question,
                  isActive: checked,
                })
              }
            />
            <Label htmlFor="edit-active">Actif</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={onUpdate}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
