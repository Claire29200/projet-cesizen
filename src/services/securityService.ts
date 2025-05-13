
import { toast } from 'sonner';

/**
 * Service centralisé pour les fonctionnalités de sécurité
 */
class SecurityService {
  
  /**
   * Nettoie et échappe les données pour prévenir les attaques XSS
   * @param input Chaîne à sanitizer
   * @returns Chaîne sanitizée
   */
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Échapper les caractères spéciaux HTML
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  /**
   * Vérifie la force du mot de passe
   * @param password Mot de passe à vérifier
   * @returns Objet contenant le score et les suggestions
   */
  checkPasswordStrength(password: string): { 
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
    
    // Score maximum = 5, considéré comme fort si >= 4
    return {
      score,
      suggestions,
      isStrong: score >= 4
    };
  }
  
  /**
   * Génère un identifiant unique pour les sessions
   */
  generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Journalise les événements de sécurité importants
   */
  logSecurityEvent(eventType: string, details: any): void {
    // En production, cette fonction pourrait envoyer les logs à un serveur
    console.log(`[SECURITY EVENT] ${eventType}`, details);
    
    // Si l'événement est critique, afficher une notification
    if (eventType.includes('CRITICAL')) {
      toast.error('Une activité suspecte a été détectée. Contactez l\'administrateur si ce n\'est pas vous.');
    }
  }
  
  /**
   * Détecte les tentatives de clickjacking
   * Cette méthode peut être appelée au démarrage de l'application
   */
  detectFraming(): boolean {
    try {
      if (window.self !== window.top) {
        // L'application est chargée dans un iframe
        console.warn('Application possiblement chargée dans un iframe');
        return true;
      }
    } catch (e) {
      // En cas d'erreur de Same-Origin Policy
      console.warn('Erreur lors de la détection de framing', e);
      return true;
    }
    return false;
  }
}

export const securityService = new SecurityService();
