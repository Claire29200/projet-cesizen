
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { setupAuthSecurityMocks } from './TestSetup';

// Set up all the necessary mocks
setupAuthSecurityMocks();

describe('Admin Access Security Tests', () => {
  beforeEach(() => {
    // Additional setup specific to admin access tests
  });
  
  it('should prevent access to admin resources for non-admin users', async () => {
    // Simulate an authenticated but non-admin user
    (useAuthStore as any).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
      user: { id: 'test-user-id', email: 'test@example.com', isAdmin: false }
    });
    
    // Test component for admin page
    const AdminContent = () => <div>Admin content</div>;
    
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminContent />
            </ProtectedRoute>
          } />
          <Route path="/" element={<div>Home page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    // Wait for validation to complete
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
    expect(screen.getByText('Home page')).toBeInTheDocument();
  });
});
