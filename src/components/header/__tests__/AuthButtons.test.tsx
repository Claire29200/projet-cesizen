
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';
import { AuthButtons } from '../AuthButtons';
import { act } from 'react-dom/test-utils';

// Mock the auth store as a function
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn(() => ({
    createDemoUsers: vi.fn().mockResolvedValue(undefined),
  }))
}));

// Mock the router with explicit implementation
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props} data-testid={`link-${to.replace(/\//g, '-')}`}>
      {children}
    </a>
  ),
}));

// Mock the LogoutButton component
vi.mock('../LogoutButton', () => ({
  LogoutButton: () => <button data-testid="logout-button">Déconnexion</button>
}));

describe('AuthButtons - Scénarios utilisateur', () => {
  
  // Scénario 1: Je suis un utilisateur et je me connecte
  describe('Scénario 1: Connexion utilisateur', () => {
    it("affiche les boutons de connexion et d'inscription quand l'utilisateur n'est pas authentifié", () => {
      render(<AuthButtons isAuthenticated={false} isAdmin={false} onLogoutClick={() => {}} />);
      
      expect(screen.getByText('Connexion')).toBeInTheDocument();
      expect(screen.getByText('S\'inscrire')).toBeInTheDocument();
    });
    
    it("permet à l'utilisateur de naviguer vers la page de connexion", () => {
      render(<AuthButtons isAuthenticated={false} isAdmin={false} onLogoutClick={() => {}} />);
      
      const loginButton = screen.getByText('Connexion');
      expect(loginButton.closest('a')).toHaveAttribute('href', '/connexion');
    });
  });
  
  // Scénario 2: Je suis un utilisateur et je me déconnecte
  describe('Scénario 2: Déconnexion utilisateur', () => {
    it("affiche le bouton de déconnexion quand l'utilisateur est authentifié", () => {
      render(<AuthButtons isAuthenticated={true} isAdmin={false} onLogoutClick={() => {}} />);
      
      expect(screen.getByText('Profil')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });
    
    it("déclenche la fonction de déconnexion quand le bouton est cliqué", async () => {
      // Définir le mock de logout ici
      const logoutMock = vi.fn();
      
      // Utiliser un mock personnalisé pour LogoutButton uniquement dans ce test
      vi.mock('../LogoutButton', () => ({
        LogoutButton: () => (
          <button 
            data-testid="logout-button" 
            onClick={logoutMock}
          >
            Déconnexion
          </button>
        )
      }), { virtual: true });
      
      render(<AuthButtons isAuthenticated={true} isAdmin={false} onLogoutClick={logoutMock} />);
      
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);
      
      // Vérifier que la fonction mock a été appelée
      await waitFor(() => {
        expect(logoutMock).toHaveBeenCalled();
      });
    });
  });
});
