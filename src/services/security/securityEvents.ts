
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Type d'événement de sécurité
export interface SecurityEvent {
  eventType: string;
  timestamp: number;
  details: any;
}

/**
 * Gestionnaire d'événements de sécurité
 */
export class SecurityEventsManager {
  private securityEvents: Array<SecurityEvent> = [];
  
  /**
   * Nettoie les événements de sécurité plus anciens que 1 heure
   */
  public cleanupOldEvents(): void {
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
   * Journalise les événements de sécurité importants
   * @param eventType Type d'événement
   * @param details Détails de l'événement
   */
  public async logSecurityEvent(eventType: string, details: any): Promise<void> {
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
   * Récupère la liste d'événements de sécurité (pour des raisons de test ou de débogage)
   */
  public getEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }
}
