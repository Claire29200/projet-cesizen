
export interface StressQuestion {
  id: string;
  question: string;
  category: string;
  points?: number[];
  order?: number;
  isActive?: boolean;
}

export interface StressFeedback {
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
}

export interface DiagnosticResult {
  id?: string;
  userId?: string | null;
  totalScore: number;
  feedbackTitle?: string;
  feedbackDescription?: string;
  feedbackProvided?: string;
  date: string | Date;
  answers: Record<string, number> | { questionId: string; answer: number }[];
}
