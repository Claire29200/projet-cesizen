
import { useState } from "react";
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

interface AddQuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (questionData: Omit<StressQuestion, "id">) => void;
  questionCount: number;
}

export function AddQuestionDialog({ 
  isOpen, 
  onClose, 
  onAdd, 
  questionCount 
}: AddQuestionDialogProps) {
  const [newQuestionData, setNewQuestionData] = useState({
    question: "",
    category: "Général",
    order: questionCount > 0 ? questionCount + 1 : 1,
    points: [0, 1, 2, 3, 4],
    isActive: true,
  });

  const handleAdd = () => {
    onAdd(newQuestionData);
    
    // Reset form state
    setNewQuestionData({
      question: "",
      category: "Général",
      order: questionCount > 0 ? questionCount + 1 : 1,
      points: [0, 1, 2, 3, 4],
      isActive: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une question</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle question au diagnostic de stress.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Saisissez la question..."
              rows={3}
              value={newQuestionData.question}
              onChange={(e) =>
                setNewQuestionData({
                  ...newQuestionData,
                  question: e.target.value,
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order">Ordre</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={newQuestionData.order}
              onChange={(e) =>
                setNewQuestionData({
                  ...newQuestionData,
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
                  <Label htmlFor={`points-${index}`} className="text-xs">
                    {label}
                  </Label>
                  <Input
                    id={`points-${index}`}
                    type="number"
                    min="0"
                    value={newQuestionData.points[index]}
                    onChange={(e) => {
                      const updatedPoints = [...newQuestionData.points];
                      updatedPoints[index] = parseInt(e.target.value) || 0;
                      setNewQuestionData({
                        ...newQuestionData,
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
              id="active"
              checked={newQuestionData.isActive}
              onCheckedChange={(checked) =>
                setNewQuestionData({
                  ...newQuestionData,
                  isActive: checked,
                })
              }
            />
            <Label htmlFor="active">Actif</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleAdd}>Ajouter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
