
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/test-utils';
import { AboutNavigationButton } from '../AboutNavigationButton';

describe('AboutNavigationButton', () => {
  it('renders with correct text', () => {
    render(<AboutNavigationButton currentPath="/" />);
    expect(screen.getByText('À propos')).toBeInTheDocument();
  });

  it('uses default variant when on about page', () => {
    render(<AboutNavigationButton currentPath="/a-propos" />);
    const linkElement = screen.getByText('À propos').closest('a');
    const buttonElement = linkElement?.closest('button');
    expect(buttonElement).not.toHaveClass('ghost');
  });

  it('uses ghost variant when not on about page', () => {
    render(<AboutNavigationButton currentPath="/" />);
    const linkElement = screen.getByText('À propos').closest('a');
    const buttonElement = linkElement?.closest('button');
    expect(buttonElement).toHaveClass('ghost');
  });
});
