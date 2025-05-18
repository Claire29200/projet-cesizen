
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { authController } from '@/controllers/authController';
import { setupAuthSecurityMocks } from './TestSetup';

// Set up all the necessary mocks
setupAuthSecurityMocks();

describe('Session Validation Security Tests', () => {
  beforeEach(() => {
    // Additional setup specific to session validation tests
  });
  
  it('should verify session validity for protected routes', async () => {
    // Simulate an invalid session
    (authController.validateSession as any).mockResolvedValue({ valid: false });
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      logout: vi.fn().mockResolvedValue(true),
      user: { id: 'test-user-id', email: 'test@example.com' }
    });
    
    // Test component for protected route
    const ProtectedContent = () => <div>Protected content</div>;
    
    render(
      <MemoryRouter initialEntries={['/protege']}>
        <Routes>
          <Route path="/protege" element={
            <ProtectedRoute>
              <ProtectedContent />
            </ProtectedRoute>
          } />
          <Route path="/connexion" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for session validation to complete
    await waitFor(() => {
      // Check that redirect happens
      expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    });
  });
});
