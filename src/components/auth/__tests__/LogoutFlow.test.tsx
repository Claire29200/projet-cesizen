
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { LogoutButton } from '@/components/header/LogoutButton';
import { LogoutConfirmDialog } from '@/components/auth/LogoutConfirmDialog';
import { useAuthStore } from '@/store/auth';

// Mock de authStore avec une implémentation correcte
vi.mock('@/store/auth', () => ({
  useAuthStore: {
    getState: vi.fn().mockReturnValue({
      logout: vi.fn().mockResolvedValue(undefined),
    }),
    subscribe: vi.fn(),
  }
}));

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }) => (
    <a href={to}>{children}</a>
  ),
}));

// Mock de composants
vi.mock('lucide-react', () => ({
  LogOut: () => <div data-testid="logout-icon">LogoutIcon</div>
}));

// Scénario 2: Je suis un utilisateur et je me déconnecte
describe('Scénario 2: Déconnexion utilisateur', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le bouton de déconnexion', () => {
    render(<LogoutButton />);
    
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });
  
  it('ouvre la boîte de dialogue de confirmation au clic sur le bouton', () => {
    // Rendu du composant LogoutButton avec ses dépendances
    render(
      <>
        <LogoutButton />
      </>
    );
    
    // Vérifie que la boîte de dialogue n'est pas visible initialement
    expect(screen.queryByText('Confirmer la déconnexion')).not.toBeInTheDocument();
    
    // Clic sur le bouton de déconnexion
    fireEvent.click(screen.getByText('Déconnexion'));
    
    // Vérifie que la boîte de dialogue est maintenant visible
    expect(screen.getByText('Confirmer la déconnexion')).toBeInTheDocument();
  });
  
  it('se déconnecte lorsque l\'utilisateur confirme', async () => {
    const logoutMock = vi.fn().mockResolvedValue(undefined);
    useAuthStore.getState = vi.fn().mockReturnValue({ logout: logoutMock });
    
    // Rendu direct de la boîte de dialogue ouverte pour tester la confirmation
    render(
      <LogoutConfirmDialog 
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={logoutMock}
      />
    );
    
    // Clic sur le bouton de confirmation
    fireEvent.click(screen.getByText('Oui, me déconnecter'));
    
    // Vérifie que la fonction logout a été appelée
    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });
  
  it('annule la déconnexion lorsque l\'utilisateur refuse', () => {
    const onCloseMock = vi.fn();
    const logoutMock = vi.fn();
    
    // Rendu direct de la boîte de dialogue ouverte pour tester l'annulation
    render(
      <LogoutConfirmDialog 
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={logoutMock}
      />
    );
    
    // Clic sur le bouton d'annulation
    fireEvent.click(screen.getByText('Annuler'));
    
    // Vérifie que onClose a été appelé et que logout n'a pas été appelé
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    expect(logoutMock).not.toHaveBeenCalled();
  });
});
