
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenuToggle } from '../MobileMenuToggle';

describe('MobileMenuToggle', () => {
  it('renders with menu icon when closed', () => {
    render(<MobileMenuToggle isOpen={false} onClick={() => {}} />);
    // Menu icon is visible
    expect(screen.getByLabelText('Menu principal')).toBeInTheDocument();
  });

  it('renders with close icon when open', () => {
    render(<MobileMenuToggle isOpen={true} onClick={() => {}} />);
    // X icon is visible when open
    expect(screen.getByLabelText('Menu principal')).toBeInTheDocument();
    // Check aria-expanded is true
    expect(screen.getByLabelText('Menu principal')).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<MobileMenuToggle isOpen={false} onClick={handleClick} />);
    
    fireEvent.click(screen.getByLabelText('Menu principal'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
