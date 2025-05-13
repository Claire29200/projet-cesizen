
/**
 * Middleware pour ajouter des en-têtes de sécurité HTTP
 * À utiliser dans les composants qui effectuent des appels API externes
 */

interface RequestConfig {
  headers?: Record<string, string>;
  [key: string]: any;
}

/**
 * Ajoute des en-têtes de sécurité à une configuration de requête
 * @param config Configuration de requête existante
 * @returns Configuration avec en-têtes de sécurité
 */
export function addSecurityHeaders(config: RequestConfig): RequestConfig {
  const updatedConfig = { ...config };
  const headers = { ...config.headers } || {};
  
  // Ajouter des en-têtes de sécurité
  headers['X-XSS-Protection'] = '1; mode=block';
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  
  // Ajouter un jeton CSRF si disponible
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }
  
  // Ne pas exposer les informations de version
  headers['X-Powered-By'] = 'CESIZen';
  
  updatedConfig.headers = headers;
  return updatedConfig;
}

/**
 * Récupère un jeton CSRF du stockage local ou en génère un nouveau
 */
function getCsrfToken(): string | null {
  try {
    let token = localStorage.getItem('csrf-token');
    if (!token) {
      token = generateCsrfToken();
      localStorage.setItem('csrf-token', token);
    }
    return token;
  } catch (error) {
    console.error('Erreur lors de la gestion du jeton CSRF:', error);
    return null;
  }
}

/**
 * Génère un jeton CSRF aléatoire
 */
function generateCsrfToken(): string {
  return Array(40)
    .fill(0)
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

/**
 * Hook pour valider l'origine des requêtes
 * @param url URL à valider
 * @returns Bool indiquant si l'URL est sûre
 */
export function validateUrlOrigin(url: string): boolean {
  try {
    const allowedOrigins = [
      'https://fksilcutrywgzlvxqdks.supabase.co',
      window.location.origin
    ];
    
    const urlObject = new URL(url);
    const origin = urlObject.origin;
    
    return allowedOrigins.includes(origin);
  } catch (error) {
    console.error('URL invalide:', error);
    return false;
  }
}
