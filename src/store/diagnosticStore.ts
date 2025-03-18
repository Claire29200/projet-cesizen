
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StressQuestion {
  id: string;
  question: string;
  category: string;
  points: number[];
  order: number;
}

export interface DiagnosticResult {
  id: string;
  userId: string | null;  // null for anonymous users
  date: Date;
  totalScore: number;
  answers: {
    questionId: string;
    answer: number;
  }[];
  feedbackProvided: string;
}

interface DiagnosticState {
  questions: StressQuestion[];
  results: DiagnosticResult[];
  stressFeedbackLevels: { min: number; max: number; label: string; description: string }[];
  
  // Methods for admin
  updateQuestion: (id: string, data: Partial<StressQuestion>) => void;
  addQuestion: (question: Omit<StressQuestion, 'id'>) => void;
  removeQuestion: (id: string) => void;
  reorderQuestions: (questionIds: string[]) => void;
  updateFeedbackLevel: (index: number, data: Partial<{ min: number; max: number; label: string; description: string }>) => void;
  
  // Methods for users
  saveResult: (result: Omit<DiagnosticResult, 'id' | 'date'>) => string;
  getResultById: (id: string) => DiagnosticResult | undefined;
  getResultsForUser: (userId: string | null) => DiagnosticResult[];
  getLatestResultForUser: (userId: string | null) => DiagnosticResult | undefined;
  getFeedbackForScore: (score: number) => { label: string; description: string };
}

// Initial questions for stress diagnostic
const initialQuestions: StressQuestion[] = [
  {
    id: 'q1',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti nerveux ou stressé ?",
    category: "Perception du stress",
    points: [0, 1, 2, 3, 4],
    order: 1
  },
  {
    id: 'q2',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous eu l'impression de ne pas pouvoir contrôler les choses importantes de votre vie ?",
    category: "Contrôle",
    points: [0, 1, 2, 3, 4],
    order: 2
  },
  {
    id: 'q3',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti confiant dans votre capacité à gérer vos problèmes personnels ?",
    category: "Confiance",
    points: [4, 3, 2, 1, 0], // Reversed scoring
    order: 3
  },
  {
    id: 'q4',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous senti que les choses allaient comme vous le vouliez ?",
    category: "Satisfaction",
    points: [4, 3, 2, 1, 0], // Reversed scoring
    order: 4
  },
  {
    id: 'q5',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous senti que les difficultés s'accumulaient à tel point que vous ne pouviez pas les surmonter ?",
    category: "Surcharge",
    points: [0, 1, 2, 3, 4],
    order: 5
  },
  {
    id: 'q6',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous eu des difficultés à vous endormir ou à rester endormi ?",
    category: "Sommeil",
    points: [0, 1, 2, 3, 4],
    order: 6
  },
  {
    id: 'q7',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti irritable ou facilement agacé ?",
    category: "Irritabilité",
    points: [0, 1, 2, 3, 4],
    order: 7
  },
  {
    id: 'q8',
    question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti débordé par tout ce que vous aviez à faire ?",
    category: "Surcharge",
    points: [0, 1, 2, 3, 4],
    order: 8
  },
  {
    id: 'q9',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous été capable de contrôler votre irritation ?",
    category: "Contrôle émotionnel",
    points: [4, 3, 2, 1, 0], // Reversed scoring
    order: 9
  },
  {
    id: 'q10',
    question: "Au cours du dernier mois, à quelle fréquence avez-vous ressenti des tensions ou douleurs physiques (maux de tête, tensions musculaires, etc.) ?",
    category: "Manifestations physiques",
    points: [0, 1, 2, 3, 4],
    order: 10
  }
];

// Initial feedback levels for stress diagnostic
const initialFeedbackLevels = [
  {
    min: 0,
    max: 13,
    label: "Stress faible",
    description: "Votre niveau de stress est faible. Continuez à prendre soin de vous et à maintenir vos bonnes habitudes de gestion du stress."
  },
  {
    min: 14,
    max: 26,
    label: "Stress modéré",
    description: "Votre niveau de stress est modéré. Même si vous semblez gérer votre stress raisonnablement bien, il serait bénéfique d'explorer de nouvelles stratégies de gestion du stress pour améliorer votre bien-être."
  },
  {
    min: 27,
    max: 40,
    label: "Stress élevé",
    description: "Votre niveau de stress est élevé. Il est recommandé de mettre en place des stratégies de gestion du stress plus efficaces et d'envisager de consulter un professionnel si ce niveau de stress persiste."
  }
];

export const useDiagnosticStore = create<DiagnosticState>()(
  persist(
    (set, get) => ({
      questions: initialQuestions,
      results: [],
      stressFeedbackLevels: initialFeedbackLevels,
      
      updateQuestion: (id, data) => {
        set(state => ({
          questions: state.questions.map(q => 
            q.id === id ? { ...q, ...data } : q
          )
        }));
      },
      
      addQuestion: (question) => {
        const newQuestion: StressQuestion = {
          id: Math.random().toString(36).substring(2, 9),
          ...question
        };
        
        set(state => ({
          questions: [...state.questions, newQuestion]
        }));
      },
      
      removeQuestion: (id) => {
        set(state => ({
          questions: state.questions.filter(q => q.id !== id)
        }));
      },
      
      reorderQuestions: (questionIds) => {
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
      
      updateFeedbackLevel: (index, data) => {
        set(state => ({
          stressFeedbackLevels: state.stressFeedbackLevels.map((level, i) => 
            i === index ? { ...level, ...data } : level
          )
        }));
      },
      
      saveResult: (resultData) => {
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
      
      getResultById: (id) => {
        return get().results.find(r => r.id === id);
      },
      
      getResultsForUser: (userId) => {
        return get().results.filter(r => r.userId === userId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      getLatestResultForUser: (userId) => {
        const userResults = get().getResultsForUser(userId);
        return userResults.length > 0 ? userResults[0] : undefined;
      },
      
      getFeedbackForScore: (score) => {
        const feedback = get().stressFeedbackLevels.find(
          level => score >= level.min && score <= level.max
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
      }
    }),
    {
      name: 'diagnostic-storage',
    }
  )
);
