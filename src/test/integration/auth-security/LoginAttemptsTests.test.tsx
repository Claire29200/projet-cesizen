
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import { toast } from 'sonner';
import { authController } from '@/controllers/authController';
import { setupAuthSecurityMocks } from './TestSetup';

// Set up all the necessary mocks
setupAuthSecurityMocks();

describe('Login Attempts Security Tests', () => {
  beforeEach(() => {
    // Additional setup specific to login attempts tests
    vi.mocked(toast.error).mockReset();
    vi.mocked(toast.warning).mockReset();
  });
  
  it('should block access after multiple failed login attempts', async () => {
    // Simulate a locked account
    (authController.isUserLocked as any).mockReturnValue(true);
    (authController.login as any).mockResolvedValue({ success: false, error: "Account locked" });
    
    render(
      <MemoryRouter initialEntries={['/connexion']}>
        <Routes>
          <Route path="/connexion" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Fill the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));
    
    // Check that the attempt is blocked
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
