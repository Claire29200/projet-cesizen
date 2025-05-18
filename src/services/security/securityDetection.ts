
/**
 * Security detection functionality
 */

/**
 * Détecte les tentatives de clickjacking
 * Cette méthode peut être appelée au démarrage de l'application
 */
export function detectFraming(): boolean {
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

/**
 * Vérifie si l'application est exécutée dans un environnement sécurisé (HTTPS)
 */
export function checkSecureContext(): boolean {
  const isSecure = window.isSecureContext;
  if (!isSecure) {
    console.warn('Application exécutée dans un contexte non sécurisé');
  }
  return isSecure;
}

/**
 * Détecte les outils de développement ouverts (peut indiquer une tentative de piratage)
 * Note: Cette détection n'est pas fiable à 100% et peut produire des faux positifs
 */
export function detectDevTools(): void {
  const threshold = 160;
  const devtools = {
    isOpen: false,
    orientation: null
  };
  
  const emitDevToolsStatusChange = (isOpen: boolean) => {
    if (devtools.isOpen !== isOpen) {
      devtools.isOpen = isOpen;
      if (isOpen) {
        console.warn('Outils de développement détectés');
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
