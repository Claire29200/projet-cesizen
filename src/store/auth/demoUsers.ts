
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
    
    if (adminCheckError && adminCheckError.message.includes('Invalid login credentials')) {
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
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userData.user.id,
                email: ADMIN_EMAIL,
                name: 'Administrateur',
              }
            ]);
          
          if (profileError) {
            console.error('Erreur lors de la création du profil admin:', profileError);
          }
        }
      }
    }
    
    // Vérifier et créer l'utilisateur standard
    const { data: userData, error: userCheckError } = await supabase.auth.signInWithPassword({
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });
    
    if (userCheckError && userCheckError.message.includes('Invalid login credentials')) {
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
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userData.user.id,
                email: USER_EMAIL,
                name: 'Utilisateur',
              }
            ]);
          
          if (profileError) {
            console.error('Erreur lors de la création du profil utilisateur:', profileError);
          }
        }
      }
    }
    
    console.log('Configuration des utilisateurs de démonstration terminée');
  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs de démonstration:', error);
    throw error;
  }
};
