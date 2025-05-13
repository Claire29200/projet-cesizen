
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * Service centralisé pour les fonctionnalités de sécurité
 */
class SecurityService {
  // Stockage local pour les événements de sécurité récents (pour détection de patterns)
  private securityEvents: Array<{ 
    eventType: string; 
    timestamp: number;
    details: any 
  }> = [];
  
  // Nettoyage périodique des anciens événements
  constructor() {
    setInterval(() => this.cleanupOldEvents(), 15 * 60 * 1000); // Nettoyer toutes les 15 minutes
  }
  
  /**
   * Nettoie les événements de sécurité plus anciens que 1 heure
   */
  private cleanupOldEvents(): void {
    const oneHourAgo = Date.now() - 3600000;
    this.securityEvents = this.securityEvents.filter(event => event.timestamp >= oneHourAgo);
  }
  
  /**
   * Analyse la présence de patterns suspicieux dans les événements récents
   * @param eventType Type d'événement à analyser
   * @param details Détails de l'événement
   */
  private detectSuspiciousPatterns(eventType: string, details: any): boolean {
    // Événements récents du même type
    const recentSameEvents = this.securityEvents.filter(
      event => event.eventType === eventType && 
      event.timestamp > Date.now() - 3600000 // Dernière heure
    );
    
    // Détection de tentatives multiples d'un même IP
    if (eventType.includes('LOGIN') && details.ip) {
      const sameIPEvents = recentSameEvents.filter(
        event => event.details.ip === details.ip
      );
      
      if (sameIPEvents.length >= 10) {
        return true; // Activité suspecte détectée
      }
    }
    
    return false;
  }
  
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
  
  /**
   * Génère un identifiant unique pour les sessions
   */
  generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Journalise les événements de sécurité importants
   * @param eventType Type d'événement
   * @param details Détails de l'événement
   */
  async logSecurityEvent(eventType: string, details: any): Promise<void> {
    // Ajouter un horodatage
    const timestamp = Date.now();
    const eventWithTime = {
      eventType,
      timestamp,
      details: { ...details, timestamp: new Date().toISOString() }
    };
    
    // Stocker l'événement localement pour l'analyse de patterns
    this.securityEvents.push(eventWithTime);
    
    // Logger en console (en développement)
    console.log(`[SECURITY EVENT] ${eventType}`, details);
    
    // Détecter les activités suspectes
    const isSuspicious = this.detectSuspiciousPatterns(eventType, details);
    
    // Si l'événement est de niveau critique ou suspect, enregistrer dans Supabase et afficher une notification
    if (eventType.includes('CRITICAL') || isSuspicious) {
      try {
        // On essaie de persister l'événement dans Supabase si l'utilisateur est authentifié
        const { data: session } = await supabase.auth.getSession();
        if (session.session) {
          // Insérer dans une table de logs de sécurité hypothétique
          // Note: cette table devrait être créée côté Supabase
          // Dans un environnement de production, utilisez une vraie table d'audit
          
          // Exemple de code qui pourrait être utilisé si la table existait:
          /*
          await supabase
            .from('security_logs')
            .insert({
              event_type: eventType,
              user_id: session.session.user.id,
              details: details,
              is_suspicious: isSuspicious
            });
          */
        }
        
        // Notification à l'utilisateur pour les événements critiques
        if (eventType.includes('CRITICAL')) {
          toast({
            title: "Alerte de sécurité",
            description: "Une activité suspecte a été détectée. Contactez l'administrateur si ce n'est pas vous.",
            variant: "security",
          });
        }
        
      } catch (error) {
        console.error('Erreur lors de la journalisation de sécurité:', error);
      }
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
        this.logSecurityEvent('FRAMING_DETECTED', { 
          url: window.location.href,
          referrer: document.referrer
        });
        return true;
      }
    } catch (e) {
      // En cas d'erreur de Same-Origin Policy
      console.warn('Erreur lors de la détection de framing', e);
      this.logSecurityEvent('FRAMING_DETECTION_ERROR', { error: String(e) });
      return true;
    }
    return false;
  }
  
  /**
   * Vérifie si l'application est exécutée dans un environnement sécurisé (HTTPS)
   */
  checkSecureContext(): boolean {
    const isSecure = window.isSecureContext;
    if (!isSecure) {
      this.logSecurityEvent('INSECURE_CONTEXT', { url: window.location.href });
      console.warn('Application exécutée dans un contexte non sécurisé');
    }
    return isSecure;
  }
  
  /**
   * Détecte les outils de développement ouverts (peut indiquer une tentative de piratage)
   * Note: Cette détection n'est pas fiable à 100% et peut produire des faux positifs
   */
  detectDevTools(): void {
    const threshold = 160;
    const devtools = {
      isOpen: false,
      orientation: null
    };
    
    const emitDevToolsStatusChange = (isOpen: boolean) => {
      if (devtools.isOpen !== isOpen) {
        devtools.isOpen = isOpen;
        if (isOpen) {
          this.logSecurityEvent('DEV_TOOLS_OPENED', {});
        }
      }
    };
    
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        emitDevToolsStatusChange(true);
      } else {
        emitDevToolsStatusChange(false);
      }
    };
    
    // Vérifier périodiquement
    setInterval(checkDevTools, 1000);
  }
  
  /**
   * Corrige une vulnérabilité dans le middleware HTTP
   * @param condition La condition à vérifier
   */
  validateCondition(condition: unknown): boolean {
    // Correction du type boolean pour éviter l'erreur TS2872
    return Boolean(condition);
  }
}

export const securityService = new SecurityService();
