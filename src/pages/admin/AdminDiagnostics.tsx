
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useDiagnosticStore, StressQuestion } from "@/store/diagnostic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

import {
  QuestionsTab,
  FeedbackTab, 
  ResultsTab,
  AddQuestionDialog,
  EditQuestionDialog,
  DeleteQuestionDialog
} from "@/components/admin/diagnostics";

const AdminDiagnostics = () => {
  const { addQuestion, updateQuestion, deleteQuestion } = useDiagnosticStore();
  const [activeTab, setActiveTab] = useState("questions");
  const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
  const [isEditQuestionDialogOpen, setIsEditQuestionDialogOpen] = useState(false);
  const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<StressQuestion | null>(null);
  const { toast } = useToast();
  
  const handleAddQuestion = (questionData: Omit<StressQuestion, "id">) => {
    if (!questionData.question) {
      toast({
        title: "Erreur",
        description: "La question est obligatoire.",
        variant: "destructive",
      });
      return;
    }
    
    addQuestion({
      id: Date.now().toString(),
      ...questionData,
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
                    <QuestionsTab 
                      onAddQuestion={() => setIsAddQuestionDialogOpen(true)}
                      onEditQuestion={(question) => {
                        setSelectedQuestion(question);
                        setIsEditQuestionDialogOpen(true);
                      }}
                      onDeleteQuestion={(question) => {
                        setSelectedQuestion(question);
                        setIsDeleteQuestionDialogOpen(true);
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="feedback">
                    <FeedbackTab />
                  </TabsContent>
                  
                  <TabsContent value="results">
                    <ResultsTab />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Dialogs */}
      <AddQuestionDialog 
        isOpen={isAddQuestionDialogOpen}
        onClose={() => setIsAddQuestionDialogOpen(false)}
        onAdd={handleAddQuestion}
        questionCount={useDiagnosticStore().questions.length}
      />
      
      <EditQuestionDialog 
        isOpen={isEditQuestionDialogOpen}
        onClose={() => setIsEditQuestionDialogOpen(false)}
        onUpdate={handleUpdateQuestion}
        question={selectedQuestion}
        setQuestion={setSelectedQuestion}
      />
      
      <DeleteQuestionDialog 
        isOpen={isDeleteQuestionDialogOpen}
        onClose={() => setIsDeleteQuestionDialogOpen(false)}
        onDelete={handleDeleteQuestion}
        question={selectedQuestion}
      />
    </div>
  );
};

export default AdminDiagnostics;
