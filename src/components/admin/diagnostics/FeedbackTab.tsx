
import { useDiagnosticStore } from "@/store/diagnostic";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeedbackTab() {
  const { feedbacks, updateFeedback } = useDiagnosticStore();
  const { toast } = useToast();

  const handleUpdateFeedback = (index: number, field: string, value: string) => {
    const updatedFeedbacks = [...feedbacks];
    updatedFeedbacks[index] = {
      ...updatedFeedbacks[index],
      [field]: value,
    };
    
    updateFeedback(updatedFeedbacks);
    
    toast({
      title: "Succès",
      description: "Les retours ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-mental-800">
          Configuration des retours
        </h2>
        <SlidersHorizontal className="h-5 w-5 text-mental-500" />
      </div>
      
      <div className="space-y-6">
        {feedbacks.map((feedback, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>
                Niveau de stress : {feedback.label}
              </CardTitle>
              <CardDescription>
                Plage de score : {feedback.minScore} - {feedback.maxScore}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`feedback-${index}-label`}>
                  Libellé du niveau
                </Label>
                <Input
                  id={`feedback-${index}-label`}
                  value={feedback.label}
                  onChange={(e) => handleUpdateFeedback(index, "label", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`feedback-${index}-min`}>
                    Score minimum
                  </Label>
                  <Input
                    id={`feedback-${index}-min`}
                    type="number"
                    value={feedback.minScore}
                    onChange={(e) => handleUpdateFeedback(index, "minScore", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`feedback-${index}-max`}>
                    Score maximum
                  </Label>
                  <Input
                    id={`feedback-${index}-max`}
                    type="number"
                    value={feedback.maxScore}
                    onChange={(e) => handleUpdateFeedback(index, "maxScore", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`feedback-${index}-description`}>
                  Description et conseils
                </Label>
                <Textarea
                  id={`feedback-${index}-description`}
                  rows={6}
                  value={feedback.description}
                  onChange={(e) => handleUpdateFeedback(index, "description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
