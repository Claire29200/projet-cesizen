
import { toast } from "@/components/ui/use-toast";
import { useDiagnosticStore } from "@/store/diagnostic";
import { supabase } from "@/integrations/supabase/client";
import { StressQuestion, DiagnosticResult } from "@/models/diagnostic";

export const diagnosticController = {
  // Récupération des questions du diagnostic
  getQuestions(): StressQuestion[] {
    return useDiagnosticStore.getState().questions;
  },

  // Calcul du résultat du diagnostic
  calculateResult(answers: Record<string, number>): DiagnosticResult {
    const store = useDiagnosticStore.getState();
    
    // Calculer le score total
    let totalScore = 0;
    const questions = store.questions.filter(q => q.isActive);
    
    for (const questionId in answers) {
      const question = questions.find(q => q.id === questionId);
      if (question && question.points) {
        totalScore += question.points[answers[questionId]];
      }
    }
    
    // Obtenir le feedback correspondant au score
    const feedback = store.getFeedbackForScore(totalScore);
    
    return {
      totalScore,
      feedbackProvided: feedback.label,
      feedbackDescription: feedback.description,
      date: new Date().toISOString(),
      answers,
    };
  },

  // Enregistrement du résultat pour un utilisateur
  async saveUserResult(userId: string, result: DiagnosticResult) {
    try {
      // Enregistrer le résultat dans le store local
      const store = useDiagnosticStore.getState();
      const formattedResult = {
        userId,
        totalScore: result.totalScore,
        answers: Object.entries(result.answers as Record<string, number>).map(([questionId, answer]) => ({
          questionId,
          answer
        })),
        feedbackProvided: result.feedbackProvided || "",
        date: new Date()
      };
      
      const resultId = store.saveResult(formattedResult);
      
      // Ici, on pourrait également sauvegarder le résultat dans Supabase
      // si une table appropriée était disponible
      
      return { success: true, resultId };
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le résultat du diagnostic",
        variant: "destructive",
      });
      return { success: false, error };
    }
  },

  // Récupération des résultats d'un utilisateur
  getUserResults(userId: string): DiagnosticResult[] {
    const { getUserResults } = useDiagnosticStore.getState();
    const results = getUserResults(userId);
    
    return results.map(result => ({
      id: result.id,
      userId: result.userId,
      totalScore: result.totalScore,
      feedbackProvided: result.feedbackProvided,
      feedbackDescription: result.feedbackProvided ? useDiagnosticStore.getState().getFeedbackForScore(result.totalScore).description : "",
      date: result.date.toString(),
      answers: result.answers
    })) as DiagnosticResult[];
  }
};
