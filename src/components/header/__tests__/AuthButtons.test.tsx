
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { AuthButtons } from '../AuthButtons';

describe('AuthButtons', () => {
  it('shows login and register buttons when not authenticated', () => {
    render(<AuthButtons isAuthenticated={false} isAdmin={false} onLogoutClick={() => {}} />);
    
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('S\'inscrire')).toBeInTheDocument();
  });

  it('shows profile button when authenticated', () => {
    render(<AuthButtons isAuthenticated={true} isAdmin={false} onLogoutClick={() => {}} />);
    
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });

  it('shows admin button when user is admin', () => {
    render(<AuthButtons isAuthenticated={true} isAdmin={true} onLogoutClick={() => {}} />);
    
    expect(screen.getByText('Administration')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });
});
