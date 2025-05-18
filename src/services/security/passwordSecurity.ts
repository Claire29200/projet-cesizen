
/**
 * Password security related functionality
 */

/**
 * Vérifie la force du mot de passe
 * @param password Mot de passe à vérifier
 * @returns Objet contenant le score et les suggestions
 */
export function checkPasswordStrength(password: string): { 
  score: number; 
  suggestions: string[]; 
  isStrong: boolean;
} {
  const suggestions: string[] = [];
  let score = 0;
  
  if (!password) {
    return { score: 0, suggestions: ['Veuillez entrer un mot de passe'], isStrong: false };
  }
  
  // Longueur minimum
  if (password.length < 8) {
    suggestions.push('Le mot de passe doit contenir au moins 8 caractères');
  } else {
    score += 1;
  }
  
  // Présence de majuscules
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Ajoutez au moins une lettre majuscule');
  } else {
    score += 1;
  }
  
  // Présence de minuscules
  if (!/[a-z]/.test(password)) {
    suggestions.push('Ajoutez au moins une lettre minuscule');
  } else {
    score += 1;
  }
  
  // Présence de chiffres
  if (!/[0-9]/.test(password)) {
    suggestions.push('Ajoutez au moins un chiffre');
  } else {
    score += 1;
  }
  
  // Présence de caractères spéciaux
  if (!/[^A-Za-z0-9]/.test(password)) {
    suggestions.push('Ajoutez au moins un caractère spécial');
  } else {
    score += 1;
  }
  
  // Vérifier les séquences communes
  const commonSequences = ['123456', 'password', 'qwerty', 'azerty'];
  if (commonSequences.some(seq => password.toLowerCase().includes(seq))) {
    suggestions.push('Évitez les séquences communes comme 123456 ou password');
    score = Math.max(0, score - 1);
  }
  
  // Score maximum = 5, considéré comme fort si >= 4
  return {
    score,
    suggestions,
    isStrong: score >= 4
  };
}
