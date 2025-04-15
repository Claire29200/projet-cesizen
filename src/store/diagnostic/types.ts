
// Types related to diagnostic functionality
export interface StressQuestion {
  id: string;
  question: string;
  category: string;
  points: number[];
  order: number;
  isActive: boolean;
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

// Interface for feedback levels
export interface FeedbackLevel {
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
}

export interface DiagnosticState {
  questions: StressQuestion[];
  results: DiagnosticResult[];
  feedbacks: FeedbackLevel[];
  
  // Methods for admin
  updateQuestion: (question: StressQuestion) => void;
  addQuestion: (question: StressQuestion) => void;
  removeQuestion: (id: string) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (questionIds: string[]) => void;
  updateFeedback: (feedbacks: FeedbackLevel[]) => void;
  
  // Methods for users
  saveResult: (result: Omit<DiagnosticResult, 'id' | 'date'>) => string;
  getResultById: (id: string) => DiagnosticResult | undefined;
  getResultsForUser: (userId: string | null) => DiagnosticResult[];
  getUserResults: (userId: string | null) => DiagnosticResult[]; 
  getAllResults: () => DiagnosticResult[];
  getLatestResultForUser: (userId: string | null) => DiagnosticResult | undefined;
  getFeedbackForScore: (score: number) => { label: string; description: string };
}
