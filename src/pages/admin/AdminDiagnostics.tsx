
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, ArrowUp, ArrowDown, SlidersHorizontal } from "lucide-react";

const AdminDiagnostics = () => {
  const { questions, feedbacks, addQuestion, updateQuestion, deleteQuestion, updateFeedback, getAllResults } = useDiagnosticStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] = useState(false);
  const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [newQuestionData, setNewQuestionData] = useState({
    question: "",
    order: questions.length > 0 ? Math.max(...questions.map(q => q.order)) + 1 : 1,
    points: [0, 1, 2, 3, 4],
    isActive: true,
  });
  const [activeTab, setActiveTab] = useState("questions");
  const { toast } = useToast();
  
  const allResults = getAllResults();
  
  const filteredQuestions = questions.filter(
    (question) =>
      question.question.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.order - b.order);
  
  const handleAddQuestion = () => {
    if (!newQuestionData.question) {
      toast({
        title: "Erreur",
        description: "La question est obligatoire.",
        variant: "destructive",
      });
      return;
    }
    
    addQuestion({
      id: Date.now().toString(),
      ...newQuestionData,
    });
    
    setNewQuestionData({
      question: "",
      order: questions.length > 0 ? Math.max(...questions.map(q => q.order)) + 1 : 1,
      points: [0, 1, 2, 3, 4],
      isActive: true,
    });
    
    setIsAddQuestionDialogOpen(false);
    
    toast({
      title: "Succès",
      description: "La question a été ajoutée avec succès.",
    });
  };
  
  const handleUpdateQuestion = () => {
    if (!selectedQuestion) return;
    
    if (!selectedQuestion.question) {
      toast({
        title: "Erreur",
        description: "La question est obligatoire.",
        variant: "destructive",
      });
      return;
    }
    
    updateQuestion(selectedQuestion);
    
    setIsEditQuestionDialogOpen(false);
    setSelectedQuestion(null);
    
    toast({
      title: "Succès",
      description: "La question a été mise à jour avec succès.",
    });
  };
  
  const handleDeleteQuestion = () => {
    if (!selectedQuestion) return;
    
    deleteQuestion(selectedQuestion.id);
    setIsDeleteQuestionDialogOpen(false);
    setSelectedQuestion(null);
    
    toast({
      title: "Succès",
      description: "La question a été supprimée avec succès.",
    });
  };
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar />
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-mental-800 mb-2">
                      Gestion des diagnostics
                    </h1>
                    <p className="text-mental-600">
                      Configurez les questions et feedbacks pour le diagnostic de stress
                    </p>
                  </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="questions">Questions</TabsTrigger>
                    <TabsTrigger value="feedback">Retours</TabsTrigger>
                    <TabsTrigger value="results">Résultats</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="questions">
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
                        <Button onClick={() => setIsAddQuestionDialogOpen(true)}>
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
                                        onClick={() => {
                                          setSelectedQuestion(question);
                                          setIsEditQuestionDialogOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => {
                                          setSelectedQuestion(question);
                                          setIsDeleteQuestionDialogOpen(true);
                                        }}
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
                  </TabsContent>
                  
                  <TabsContent value="feedback">
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
                  </TabsContent>
                  
                  <TabsContent value="results">
                    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-mental-800">
                          Résultats des diagnostics
                        </h2>
                        <span className="text-sm text-mental-500">
                          {allResults.length} résultats au total
                        </span>
                      </div>
                      
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Utilisateur</TableHead>
                              <TableHead>Score</TableHead>
                              <TableHead>Feedback</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allResults.length > 0 ? (
                              allResults
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((result) => (
                                  <TableRow key={result.id}>
                                    <TableCell className="font-medium">
                                      #{result.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                      {result.userId ? result.userId : "Anonyme"}
                                    </TableCell>
                                    <TableCell>{result.totalScore}</TableCell>
                                    <TableCell>{result.feedbackProvided}</TableCell>
                                    <TableCell>
                                      {new Date(result.date).toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </TableCell>
                                  </TableRow>
                                ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                  Aucun résultat trouvé
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Question Dialog */}
      <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsAddQuestionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddQuestion}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Question Dialog */}
      <Dialog open={isEditQuestionDialogOpen} onOpenChange={setIsEditQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la question</DialogTitle>
            <DialogDescription>
              Modifiez les détails de la question.
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-question">Question</Label>
                <Textarea
                  id="edit-question"
                  rows={3}
                  value={selectedQuestion.question}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
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
                  value={selectedQuestion.order}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
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
                        value={selectedQuestion.points[index]}
                        onChange={(e) => {
                          const updatedPoints = [...selectedQuestion.points];
                          updatedPoints[index] = parseInt(e.target.value) || 0;
                          setSelectedQuestion({
                            ...selectedQuestion,
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
                  checked={selectedQuestion.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
                      isActive: checked,
                    })
                  }
                />
                <Label htmlFor="edit-active">Actif</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditQuestionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateQuestion}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Question Dialog */}
      <Dialog open={isDeleteQuestionDialogOpen} onOpenChange={setIsDeleteQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la question</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="py-4">
              <p className="text-mental-800">
                Vous êtes sur le point de supprimer la question :
              </p>
              <p className="font-medium mt-2">"{selectedQuestion.question}"</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteQuestionDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDiagnostics;
