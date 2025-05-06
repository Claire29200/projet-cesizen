
import { describe, it, expect, vi } from 'vitest';
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
    // On utilise getByText pour obtenir le lien
    const buttonElement = screen.getByText('À propos');
    expect(buttonElement).not.toHaveClass('hover:bg-accent');
  });

  it('uses ghost variant when not on about page', () => {
    render(<AboutNavigationButton currentPath="/" />);
    // On utilise getByText pour obtenir le lien
    const buttonElement = screen.getByText('À propos');
    expect(buttonElement).toHaveClass('hover:bg-accent');
  });
});
