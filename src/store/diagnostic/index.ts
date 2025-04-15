
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiagnosticState } from './types';
import { initialQuestions, initialFeedbacks } from './initialData';
import { createDiagnosticActions } from './actions';

// Create the main store with all components combined
export const useDiagnosticStore = create<DiagnosticState>()(
  persist(
    (set, get) => ({
      // Initial state
      questions: initialQuestions,
      results: [],
      feedbacks: initialFeedbacks,
      
      // Include all actions
      ...createDiagnosticActions(set, get)
    }),
    {
      name: 'diagnostic-storage',
    }
  )
);

// Re-export types for convenience
export * from './types';
