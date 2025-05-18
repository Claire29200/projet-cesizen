
import { SecurityEventsManager } from './securityEvents';
import * as passwordSecurity from './passwordSecurity';
import * as inputSecurity from './inputSecurity';
import * as sessionSecurity from './sessionSecurity';
import * as securityDetection from './securityDetection';

/**
 * Service centralisé pour les fonctionnalités de sécurité
 */
class SecurityService {
  private eventsManager: SecurityEventsManager;
  
  constructor() {
    this.eventsManager = new SecurityEventsManager();
    // Nettoyage périodique des anciens événements
    setInterval(() => this.eventsManager.cleanupOldEvents(), 15 * 60 * 1000);
  }
  
  // Méthodes du gestionnaire d'événements
  async logSecurityEvent(eventType: string, details: any): Promise<void> {
    return this.eventsManager.logSecurityEvent(eventType, details);
  }
  
  // Fonctions de sécurité des mots de passe
  checkPasswordStrength(password: string) {
    return passwordSecurity.checkPasswordStrength(password);
  }
  
  // Fonctions de sécurité des entrées
  sanitizeInput(input: string): string {
    return inputSecurity.sanitizeInput(input);
  }
  
  validateCondition(condition: unknown): boolean {
    return inputSecurity.validateCondition(condition);
  }
  
  validateOrigin(): boolean {
    return inputSecurity.validateOrigin();
  }
  
  // Fonctions de sécurité des sessions
  generateSessionId(): string {
    return sessionSecurity.generateSessionId();
  }
  
  checkInactivity(lastActivity: number, threshold?: number): boolean {
    return sessionSecurity.checkInactivity(lastActivity, threshold);
  }
  
  // Fonctions de détection de sécurité
  detectFraming(): boolean {
    return securityDetection.detectFraming();
  }
  
  checkSecureContext(): boolean {
    return securityDetection.checkSecureContext();
  }
  
  detectDevTools(): void {
    return securityDetection.detectDevTools();
  }
}

// Exporter une instance singleton du service de sécurité
export const securityService = new SecurityService();

// Réexporter les fonctions individuelles pour un import direct si nécessaire
export {
  passwordSecurity,
  inputSecurity,
  sessionSecurity,
  securityDetection
};
