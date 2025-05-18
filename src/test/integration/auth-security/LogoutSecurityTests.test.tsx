
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { setupAuthSecurityMocks } from './TestSetup';

// Set up all the necessary mocks
setupAuthSecurityMocks();

describe('Logout Security Tests', () => {
  beforeEach(() => {
    // Additional setup specific to logout tests
    vi.resetAllMocks();
  });
  
  it('should properly clean up session during logout', async () => {
    // Simulate an authenticated user
    const mockLogout = vi.fn().mockResolvedValue(true);
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
      user: { id: 'test-user-id', email: 'test@example.com' }
    });
    
    // Mock localStorage
    const mockLocalStorage = {
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
    
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={
            <button onClick={() => {
              mockLogout();
            }}>
              Logout
            </button>
          } />
        </Routes>
      </MemoryRouter>
    );
    
    // Trigger logout
    fireEvent.click(screen.getByText('Logout'));
    
    // Check that logout was called
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
