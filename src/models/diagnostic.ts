
export interface StressQuestion {
  id: string;
  question: string;
  category: string;
}

export interface StressFeedback {
  title: string;
  description: string;
  minScore: number;
  maxScore: number;
}

export interface DiagnosticResult {
  id?: string;
  userId?: string;
  totalScore: number;
  feedbackTitle: string;
  feedbackDescription: string;
  feedbackProvided?: string;
  date: string;
  answers: Record<string, number>;
}
