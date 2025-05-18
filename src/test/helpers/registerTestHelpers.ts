
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms: boolean;
}

/**
 * Rend le composant Register dans le contexte d'un test
 */
export function renderRegisterComponent() {
  return render(
    <MemoryRouter initialEntries={['/inscription']}>
      <Routes>
        <Route path="/inscription" element={<Register />} />
        <Route path="/" element={<div>Page d'accueil</div>} />
      </Routes>
    </MemoryRouter>
  );
}

/**
 * Remplit le formulaire d'inscription avec les données spécifiées
 */
export function fillRegisterForm({
  name,
  email,
  password,
  confirmPassword = password,
  acceptTerms
}: UserFormData) {
  // Remplit les champs du formulaire
  fireEvent.change(screen.getByLabelText(/Nom/i), {
    target: { value: name }
  });
  
  fireEvent.change(screen.getByLabelText(/Email/i), {
    target: { value: email }
  });
  
  fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
    target: { value: password }
  });
  
  fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), {
    target: { value: confirmPassword }
  });

  // Accepte les conditions si demandé
  if (acceptTerms) {
    fireEvent.click(screen.getByText(/J'accepte les/i));
  }
}

/**
 * Soumet le formulaire d'inscription
 */
export function submitRegisterForm() {
  fireEvent.click(screen.getByRole('button', { name: /S'inscrire/i }));
}
