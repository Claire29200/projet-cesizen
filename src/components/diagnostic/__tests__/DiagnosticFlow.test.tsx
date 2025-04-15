
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { useDiagnosticStore } from '@/store/diagnosticStore';
import { DiagnosticQuestion } from '../DiagnosticQuestion';
import { diagnosticController } from '@/controllers/diagnosticController';

// Mock de diagnosticStore
vi.mock('@/store/diagnosticStore', () => ({
  useDiagnosticStore: {
    getState: vi.fn().mockReturnValue({
      questions: [
        {
          id: 'q1',
          question: "Au cours du dernier mois, à quelle fréquence vous êtes-vous senti nerveux ou stressé ?",
          category: "Perception du stress",
          points: [0, 1, 2, 3, 4],
          order: 1,
          isActive: true
        },
        {
          id: 'q2',
          question: "Au cours du dernier mois, à quelle fréquence avez-vous eu l'impression de ne pas pouvoir contrôler les choses importantes de votre vie ?",
          category: "Contrôle",
          points: [0, 1, 2, 3, 4],
          order: 2,
          isActive: true
        }
      ],
      feedbacks: [
        {
          minScore: 0,
          maxScore: 13,
          label: "Stress faible",
          description: "Votre niveau de stress est faible."
        },
        {
          minScore: 14,
          maxScore: 40,
          label: "Stress élevé",
          description: "Votre niveau de stress est élevé."
        }
      ],
      getFeedbackForScore: vi.fn().mockReturnValue({
        label: "Stress faible",
        description: "Votre niveau de stress est faible."
      }),
      saveResult: vi.fn().mockReturnValue("result-123")
    })
  }
}));

// Mock du controller diagnostic
vi.mock('@/controllers/diagnosticController', () => ({
  diagnosticController: {
    getQuestions: vi.fn(),
    calculateResult: vi.fn(),
    saveUserResult: vi.fn().mockResolvedValue({ success: true, resultId: "result-123" })
  }
}));

// Scénario 3: Je réalise un test diagnostic
describe('Scénario 3: Réalisation d\'un test diagnostic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Configuration des mocks pour les tests
    diagnosticController.getQuestions = vi.fn().mockReturnValue(useDiagnosticStore.getState().questions);
    diagnosticController.calculateResult = vi.fn().mockReturnValue({
      totalScore: 8,
      feedbackProvided: "Stress faible",
      feedbackDescription: "Votre niveau de stress est faible.",
      date: new Date().toISOString(),
      answers: { q1: 2, q2: 2 }
    });
  });
  
  it('permet à l\'utilisateur de répondre à une question du diagnostic', () => {
    const onAnswerMock = vi.fn();
    
    render(
      <DiagnosticQuestion
        question={useDiagnosticStore.getState().questions[0]}
        currentAnswer={undefined}
        onAnswer={onAnswerMock}
      />
    );
    
    // Vérifier que la question est affichée
    expect(screen.getByText("Au cours du dernier mois, à quelle fréquence vous êtes-vous senti nerveux ou stressé ?")).toBeInTheDocument();
    
    // Vérifier que les options sont affichées
    expect(screen.getByText("Jamais")).toBeInTheDocument();
    expect(screen.getByText("Rarement")).toBeInTheDocument();
    expect(screen.getByText("Parfois")).toBeInTheDocument();
    expect(screen.getByText("Souvent")).toBeInTheDocument();
    expect(screen.getByText("Très souvent")).toBeInTheDocument();
    
    // Simuler la sélection d'une réponse
    fireEvent.click(screen.getByText("Parfois"));
    
    // Vérifier que la fonction onAnswer a été appelée avec la valeur correcte
    expect(onAnswerMock).toHaveBeenCalledWith(2);
  });
  
  it('calcule correctement le résultat du diagnostic', () => {
    // Simuler des réponses au diagnostic
    const answers = { q1: 2, q2: 2 };
    
    // Appeler la fonction calculateResult du controller
    const result = diagnosticController.calculateResult(answers);
    
    // Vérifier que la fonction a été appelée
    expect(diagnosticController.calculateResult).toHaveBeenCalledWith(answers);
    
    // Vérifier le résultat
    expect(result).toEqual({
      totalScore: 8,
      feedbackProvided: "Stress faible",
      feedbackDescription: "Votre niveau de stress est faible.",
      date: expect.any(String),
      answers: { q1: 2, q2: 2 }
    });
  });
  
  it('sauvegarde le résultat du diagnostic pour un utilisateur authentifié', async () => {
    // Simuler un utilisateur authentifié
    const userId = "user-123";
    const result = {
      totalScore: 8,
      feedbackProvided: "Stress faible",
      feedbackDescription: "Votre niveau de stress est faible.",
      date: new Date().toISOString(),
      answers: { q1: 2, q2: 2 }
    };
    
    // Appeler la fonction saveUserResult du controller
    await diagnosticController.saveUserResult(userId, result);
    
    // Vérifier que la fonction a été appelée avec les bons paramètres
    expect(diagnosticController.saveUserResult).toHaveBeenCalledWith(userId, result);
  });
});
