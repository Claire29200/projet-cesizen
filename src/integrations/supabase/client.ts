
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuration des variables d'environnement pour Supabase
// Ces valeurs devraient idéalement être stockées dans des variables d'environnement
// mais sont laissées ici pour faciliter le développement
const SUPABASE_URL = "https://fksilcutrywgzlvxqdks.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2lsY3V0cnl3Z3psdnhxZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzk3ODUsImV4cCI6MjA2MDIxNTc4NX0.0b70zPidWwylIfOHgNvl-4NBbZJjBFvY0F1go0aznZ8";

// Création du client Supabase avec configuration sécurisée
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Désactiver la détection de session dans l'URL pour éviter les vulnérabilités
    storage: localStorage, // Considérer l'utilisation de cookies sécurisés dans les environnements de production
    flowType: 'pkce', // Utiliser PKCE pour plus de sécurité
    debug: false, // Désactiver le debug en production
  },
  global: {
    headers: {
      'X-Client-Info': 'cesizen-app', // Identifier clairement votre application
    },
  },
  realtime: {
    headers: {
      'X-Client-Info': 'cesizen-app',
    },
  },
});

// Exporter les fonctions utilitaires
export const auth = supabase.auth;

// Fonction pour valider la session courante
export const validateSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { 
    isValid: !!data.session && !error,
    session: data.session
  };
};
