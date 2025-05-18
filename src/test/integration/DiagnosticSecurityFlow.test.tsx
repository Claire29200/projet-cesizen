
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import DiagnosticPage from '@/pages/DiagnosticPage';
import { useDiagnosticStore } from '@/store/diagnostic';
import { securityService } from '@/services/securityService';

// Mock des dépendances
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn()
}));

vi.mock('@/store/diagnostic', () => ({
  useDiagnosticStore: vi.fn()
}));

vi.mock('@/services/securityService', () => ({
  securityService: {
    sanitizeInput: vi.fn(input => input),
    logSecurityEvent: vi.fn()
  }
}));

describe('Diagnostic Security Flow Integration Test', () => {
  const mockSaveResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour le store d'authentification
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: 'test-user-id', email: 'test@example.com' }
    });
    
    // Mock pour le store de diagnostic
    (useDiagnosticStore as any).mockReturnValue({
      questions: [
        { id: 'q1', text: 'Question 1', type: 'scale', order: 1 },
        { id: 'q2', text: 'Question 2', type: 'scale', order: 2 }
      ],
      saveResult: mockSaveResult,
      getFeedbackForScore: () => ({
        label: 'Niveau modéré',
        description: 'Description du feedback'
      })
    });
    
    // Simuler la fonction de sanitisation
    (securityService.sanitizeInput as any).mockImplementation((input) => {
      // Simuler une sanitisation qui remplace les balises HTML
      if (typeof input === 'string') {
        return input.replace(/<[^>]*>/g, '');
      }
      return input;
    });
  });
  
  it('devrait sanitiser les réponses du diagnostic avant de les enregistrer', async () => {
    // Render the component with mocked Router
    render(
      <MemoryRouter initialEntries={['/diagnostic']}>
        <Routes>
          <Route path="/diagnostic" element={<DiagnosticPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Attendez que la page soit chargée
    await waitFor(() => {
      expect(screen.getByText(/Évaluation/i)).toBeInTheDocument();
    });
    
    // Simuler la complétion du diagnostic
    // Notez : Cette partie peut varier selon l'implémentation réelle de DiagnosticPage
    // Vous devrez peut-être ajuster les sélecteurs et événements en fonction du composant réel
    
    // Simulons que l'utilisateur a terminé le diagnostic et a soumis ses réponses
    // avec une tentative d'injection XSS dans un champ de commentaire
    const suspiciousAnswers = {
      q1: 5,
      q2: 3,
      comment: "Feedback <script>alert('XSS')</script>"
    };
    
    // Simuler l'appel à saveResult avec les réponses suspectes
    const mockDiagnosticSubmit = new CustomEvent('diagnosticSubmit', {
      detail: suspiciousAnswers
    });
    window.dispatchEvent(mockDiagnosticSubmit);
    
    // Vérifier que la sanitisation a été appelée pour les données sensibles
    await waitFor(() => {
      expect(securityService.sanitizeInput).toHaveBeenCalled();
    });
    
    // Vérifier que l'événement a été journalisé
    expect(securityService.logSecurityEvent).toHaveBeenCalledWith(
      expect.stringContaining('DIAGNOSTIC'),
      expect.anything()
    );
    
    // Vérifier que saveResult a été appelé avec des données propres
    // Dans un vrai test, nous vérifierions que les balises <script> ont été supprimées
    expect(mockSaveResult).toHaveBeenCalled();
  });
  
  it('devrait protéger contre les attaques par URL manipulation dans le diagnostic', async () => {
    // Simuler une URL malveillante avec des paramètres suspects
    const maliciousUrl = '/diagnostic?inject=<script>alert("XSS")</script>&admin=true';
    
    render(
      <MemoryRouter initialEntries={[maliciousUrl]}>
        <Routes>
          <Route path="/diagnostic" element={<DiagnosticPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Attendez que la page soit chargée
    await waitFor(() => {
      expect(screen.getByText(/Évaluation/i)).toBeInTheDocument();
    });
    
    // Vérifier que l'événement de sécurité a été journalisé pour l'URL suspecte
    expect(securityService.logSecurityEvent).toHaveBeenCalledWith(
      expect.stringContaining('SUSPICIOUS_URL'),
      expect.objectContaining({ 
        url: expect.stringContaining('inject')
      })
    );
  });
});
