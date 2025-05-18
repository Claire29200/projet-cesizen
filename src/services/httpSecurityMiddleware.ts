
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
  const headers = config.headers || {};
  
  // Ajouter des en-têtes de sécurité
  headers['X-XSS-Protection'] = '1; mode=block';
  headers['X-Content-Type-Options'] = 'nosniff';
  headers['X-Frame-Options'] = 'DENY';
  headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()';
  
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
    
    // Correction pour éviter l'erreur TS2872 - utilisation de Boolean explicite
    return Boolean(allowedOrigins.includes(origin));
  } catch (error) {
    console.error('URL invalide:', error);
    return false;
  }
}

/**
 * Valide les paramètres de requête pour éviter les injections
 * @param params Paramètres à valider
 * @returns Paramètres sanitisés
 */
export function sanitizeRequestParams(params: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      
      if (typeof value === 'string') {
        // Sanitiser les chaînes de caractères
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        // Recursion pour les objets imbriqués
        sanitized[key] = sanitizeRequestParams(value);
      } else {
        // Copier les valeurs non-chaînes telles quelles
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Sanitise une chaîne pour échapper HTML et attributs
 */
function sanitizeString(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/onerror/gi, 'data-sanitized')
    .replace(/onclick/gi, 'data-sanitized')
    .replace(/onload/gi, 'data-sanitized')
    .replace(/onmouseover/gi, 'data-sanitized')
    .replace(/javascript:/gi, 'sanitized:');
}

/**
 * Détecte les tentatives d'injection SQL dans les chaînes
 * @param input Chaîne à vérifier
 * @returns True si la chaîne contient des motifs suspects
 */
export function detectSqlInjection(input: string): boolean {
  if (!input) return false;
  
  const sqlPatterns = [
    /'\s*OR\s*'1'\s*=\s*'1/i,
    /'\s*OR\s*1\s*=\s*1/i,
    /'\s*;\s*DROP\s+TABLE/i,
    /'\s*;\s*SELECT\s+/i,
    /'\s*UNION\s+SELECT/i,
    /'\s*--\s+/i,
    /'\s*;\s*--\s+/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}
