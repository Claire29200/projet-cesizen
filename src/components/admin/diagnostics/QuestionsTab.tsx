
import { useState } from "react";
import { useDiagnosticStore } from "@/store/diagnostic";
import { StressQuestion } from "@/store/diagnostic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Search } from "lucide-react";

interface QuestionsTabProps {
  onAddQuestion: () => void;
  onEditQuestion: (question: StressQuestion) => void;
  onDeleteQuestion: (question: StressQuestion) => void;
}

export function QuestionsTab({ 
  onAddQuestion, 
  onEditQuestion, 
  onDeleteQuestion 
}: QuestionsTabProps) {
  const { questions, updateQuestion } = useDiagnosticStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const filteredQuestions = questions.filter(
    (question) =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order - b.order);
  
  const handleMoveQuestion = (id: string, direction: "up" | "down") => {
    const questionIndex = questions.findIndex(q => q.id === id);
    
    if (questionIndex === -1) return;
    
    const targetIndex = direction === "up" ? questionIndex - 1 : questionIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= questions.length) return;
    
    const currentQuestion = { ...questions[questionIndex] };
    const targetQuestion = { ...questions[targetIndex] };
    
    // Swap orders
    const tempOrder = currentQuestion.order;
    currentQuestion.order = targetQuestion.order;
    targetQuestion.order = tempOrder;
    
    updateQuestion(currentQuestion);
    updateQuestion(targetQuestion);
    
    toast({
      title: "Succès",
      description: "L'ordre des questions a été mis à jour.",
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mental-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Rechercher une question..."
            className="pl-10 w-full sm:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={onAddQuestion}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une question
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordre</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{question.order}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => handleMoveQuestion(question.id, "up")}
                          disabled={question.order === 1}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => handleMoveQuestion(question.id, "down")}
                          disabled={question.order === Math.max(...questions.map(q => q.order))}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {question.question}
                  </TableCell>
                  <TableCell>
                    {question.points.join(", ")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        question.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {question.isActive ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => onDeleteQuestion(question)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Aucune question trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
