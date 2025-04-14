
import { toast } from "@/components/ui/use-toast";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { supabase } from "@/integrations/supabase/client";
import { StressQuestion, DiagnosticResult } from "@/models/diagnostic";

export const diagnosticController = {
  // Récupération des questions du diagnostic
  getQuestions(): StressQuestion[] {
    return useDiagnosticStore.getState().questions;
  },

  // Calcul du résultat du diagnostic
  calculateResult(answers: Record<string, number>): DiagnosticResult {
    const { calculateScore, getFeedbackForScore } = useDiagnosticStore.getState();
    
    // Calculer le score total
    const totalScore = calculateScore(answers);
    
    // Obtenir le feedback correspondant au score
    const feedback = getFeedbackForScore(totalScore);
    
    return {
      totalScore,
      feedbackTitle: feedback.title,
      feedbackDescription: feedback.description,
      date: new Date().toISOString(),
      answers,
    };
  },

  // Enregistrement du résultat pour un utilisateur
  async saveUserResult(userId: string, result: DiagnosticResult) {
    try {
      // Enregistrer le résultat dans le store local
      const { addUserResult } = useDiagnosticStore.getState();
      const resultId = addUserResult(userId, {
        ...result,
        id: crypto.randomUUID(),
        feedbackProvided: result.feedbackTitle,
        userId
      });
      
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
  getUserResults(userId: string) {
    const { getUserResults } = useDiagnosticStore.getState();
    return getUserResults(userId);
  }
};
