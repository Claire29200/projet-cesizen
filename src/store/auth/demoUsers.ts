
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_EMAIL, ADMIN_PASSWORD, USER_EMAIL, USER_PASSWORD } from './types';

export const createDemoUsers = async () => {
  try {
    console.log('Tentative de création des utilisateurs de démonstration...');
    
    // Vérifier et créer l'utilisateur admin
    const { data: adminData, error: adminCheckError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (adminCheckError) {
      console.log('Création de l\'utilisateur admin de démonstration...');
      const { error: adminCreateError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
          data: {
            name: 'Administrateur',
            isAdmin: true,
          }
        }
      });
      
      if (adminCreateError) {
        console.error('Erreur lors de la création de l\'utilisateur admin:', adminCreateError);
      } else {
        console.log('Utilisateur admin créé avec succès');
        
        // Attendre un peu pour que la création soit complète
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: (await supabase.auth.getUser()).data.user?.id,
              email: ADMIN_EMAIL,
              name: 'Administrateur',
            }
          ], { onConflict: 'id' });
        
        if (profileError) {
          console.error('Erreur lors de la création du profil admin:', profileError);
        }
      }
    } else {
      console.log('Utilisateur admin existe déjà');
    }
    
    // Vérifier et créer l'utilisateur standard
    const { data: userData, error: userCheckError } = await supabase.auth.signInWithPassword({
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });
    
    if (userCheckError) {
      console.log('Création de l\'utilisateur standard de démonstration...');
      const { error: userCreateError } = await supabase.auth.signUp({
        email: USER_EMAIL,
        password: USER_PASSWORD,
        options: {
          data: {
            name: 'Utilisateur',
            isAdmin: false,
          }
        }
      });
      
      if (userCreateError) {
        console.error('Erreur lors de la création de l\'utilisateur standard:', userCreateError);
      } else {
        console.log('Utilisateur standard créé avec succès');
        
        // Attendre un peu pour que la création soit complète
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: (await supabase.auth.getUser()).data.user?.id,
              email: USER_EMAIL,
              name: 'Utilisateur',
            }
          ], { onConflict: 'id' });
        
        if (profileError) {
          console.error('Erreur lors de la création du profil utilisateur:', profileError);
        }
      }
    } else {
      console.log('Utilisateur standard existe déjà');
    }
    
    console.log('Configuration des utilisateurs de démonstration terminée');
  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs de démonstration:', error);
    throw error;
  }
};
