
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import Login from '@/pages/Login';
import { toast } from 'sonner';

// Mock de authStore
vi.mock('@/store/auth', () => ({
  useAuthStore: vi.fn(() => ({
    login: vi.fn()
  }))
}));

// Mock de sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props} data-testid={`link-${to.replace(/\//g, '-')}`}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: { from: { pathname: "/" } } })
}));

// Mock des composants
vi.mock('@/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>
}));

// Mock de framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

// Mock des composants UI de shadcn
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ htmlFor, children }) => <label htmlFor={htmlFor}>{children}</label>
}));

vi.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>
}));

describe('Login Page - Scénario de connexion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('affiche le formulaire de connexion', () => {
    render(<Login />);
    
    expect(screen.getByText("Connexion")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });
  
  // Simplified test for pending fields check
  it('permet d\'accéder à la page d\'inscription', () => {
    render(<Login />);
    
    const signupLink = screen.getByText("S'inscrire");
    expect(signupLink.closest('a')).toHaveAttribute('href', '/inscription');
  });
});
