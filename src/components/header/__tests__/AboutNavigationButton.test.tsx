
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { AboutNavigationButton } from '../AboutNavigationButton';

// Mock de react-router-dom pour éviter les erreurs avec BrowserRouter
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, className }) => (
    <a href={to} className={className} data-testid={`link-${to.replace(/\//g, '-')}`}>
      {children}
    </a>
  ),
}));

describe('AboutNavigationButton', () => {
  it('renders with correct text', () => {
    render(<AboutNavigationButton currentPath="/" />);
    expect(screen.getByText('À propos')).toBeInTheDocument();
  });

  it('uses default variant when on about page', () => {
    render(<AboutNavigationButton currentPath="/a-propos" />);
    // Vérifie le texte et la présence de l'attribut data-state="active"
    const buttonElement = screen.getByRole('link');
    expect(buttonElement).not.toHaveClass('bg-transparent');
  });

  it('uses ghost variant when not on about page', () => {
    render(<AboutNavigationButton currentPath="/" />);
    // Vérifie le texte et la présence de l'attribut ghost
    const buttonElement = screen.getByRole('link');
    expect(buttonElement).toHaveClass('bg-transparent');
  });
});
