
import { StoreApi } from 'zustand';
import { DiagnosticState, StressQuestion, FeedbackLevel, DiagnosticResult, HolmesRaheResult } from './types';
import { holmesRaheEvents, holmesRaheFeedback } from './initialData';

// Create store actions that will be used in the main store
export const createDiagnosticActions = (set: StoreApi<DiagnosticState>['setState'], get: StoreApi<DiagnosticState>['getState']) => ({
  // Admin methods
  updateQuestion: (question: StressQuestion) => {
    set(state => ({
      questions: state.questions.map(q => 
        q.id === question.id ? question : q
      )
    }));
  },
  
  addQuestion: (question: StressQuestion) => {
    set(state => ({
      questions: [...state.questions, question]
    }));
  },
  
  removeQuestion: (id: string) => {
    set(state => ({
      questions: state.questions.filter(q => q.id !== id)
    }));
  },
  
  // Alias for removeQuestion
  deleteQuestion: (id: string) => {
    get().removeQuestion(id);
  },
  
  reorderQuestions: (questionIds: string[]) => {
    set(state => {
      const updatedQuestions = [...state.questions];
      // For each id in the questionIds array, update its order
      questionIds.forEach((id, index) => {
        const questionIndex = updatedQuestions.findIndex(q => q.id === id);
        if (questionIndex !== -1) {
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            order: index + 1
          };
        }
      });
      
      return { questions: updatedQuestions };
    });
  },
  
  updateFeedback: (newFeedbacks: FeedbackLevel[]) => {
    set(() => ({
      feedbacks: newFeedbacks
    }));
  },
  
  // User methods
  saveResult: (resultData: Omit<DiagnosticResult, 'id' | 'date'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newResult: DiagnosticResult = {
      id,
      date: new Date(),
      ...resultData
    };
    
    set(state => ({
      results: [...state.results, newResult]
    }));
    
    return id;
  },
  
  getResultById: (id: string) => {
    return get().results.find(r => r.id === id);
  },
  
  getResultsForUser: (userId: string | null) => {
    return get().results.filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  // Alias for getResultsForUser
  getUserResults: (userId: string | null) => {
    return get().getResultsForUser(userId);
  },
  
  getAllResults: () => {
    return get().results;
  },
  
  getLatestResultForUser: (userId: string | null) => {
    const userResults = get().getResultsForUser(userId);
    return userResults.length > 0 ? userResults[0] : undefined;
  },
  
  getFeedbackForScore: (score: number) => {
    const feedback = get().feedbacks.find(
      level => score >= level.minScore && score <= level.maxScore
    );
    
    if (feedback) {
      return {
        label: feedback.label,
        description: feedback.description
      };
    }
    
    // Fallback if no matching feedback level
    return {
      label: "Score inconnu",
      description: "Nous n'avons pas pu déterminer un feedback pour votre score. Veuillez contacter un professionnel pour une évaluation personnalisée."
    };
  },
  
  holmesRaheEvents: holmesRaheEvents,
  
  getHolmesRaheResultCategory: (score: number) => {
    const feedback = holmesRaheFeedback.find(
      level => score >= level.minScore && score <= level.maxScore
    );
    
    return feedback || {
      label: 'Inconnu',
      description: 'Impossible de déterminer la catégorie de risque.'
    };
  },

  saveHolmesRaheResult: (resultData: Omit<HolmesRaheResult, 'id' | 'date'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newResult: HolmesRaheResult = {
      id,
      date: new Date(),
      ...resultData
    };
    
    set(state => ({
      results: [...state.results, newResult]
    }));
    
    return id;
  }
});
