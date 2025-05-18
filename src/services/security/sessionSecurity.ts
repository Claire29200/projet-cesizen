
/**
 * Session security related functionality
 */

/**
 * Génère un identifiant unique pour les sessions
 */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Vérifie l'inactivité de l'utilisateur
 * @param lastActivity Timestamp de la dernière activité
 * @param threshold Seuil d'inactivité en millisecondes
 * @returns true si l'utilisateur est inactif depuis plus longtemps que le seuil
 */
export function checkInactivity(lastActivity: number, threshold: number = 30 * 60 * 1000): boolean {
  const now = Date.now();
  return (now - lastActivity) > threshold;
}
