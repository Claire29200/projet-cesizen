
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_EMAIL, ADMIN_PASSWORD, USER_EMAIL, USER_PASSWORD } from './types';

export const createDemoUsers = async () => {
  try {
    console.log('Tentative de création des utilisateurs de démonstration...');
    
    // Tenter de créer l'utilisateur admin
    console.log('Création de l\'utilisateur admin de démonstration...');
    const { data: existingAdminData, error: checkAdminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', ADMIN_EMAIL)
      .maybeSingle();
    
    if (!existingAdminData) {
      try {
        // Supprimer l'utilisateur s'il existe déjà (pour réinitialiser)
        await supabase.auth.admin.deleteUser(ADMIN_EMAIL);
      } catch (deleteError) {
        console.log('Utilisateur admin non trouvé ou déjà supprimé:', deleteError);
      }

      const { data: adminData, error: adminCreateError } = await supabase.auth.signUp({
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
        console.log('Utilisateur admin créé avec succès:', adminData);
        
        // Attendre un peu pour que la création soit complète
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: adminData.user?.id,
              email: ADMIN_EMAIL,
              name: 'Administrateur',
            }
          ], { onConflict: 'id' });
        
        if (profileError) {
          console.error('Erreur lors de la création du profil admin:', profileError);
        } else {
          console.log('Profil admin créé avec succès');
        }
      }
    } else {
      console.log('Utilisateur admin existe déjà');
    }
    
    // Tenter de créer l'utilisateur standard
    console.log('Création de l\'utilisateur standard de démonstration...');
    const { data: existingUserData, error: checkUserError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', USER_EMAIL)
      .maybeSingle();
    
    if (!existingUserData) {
      try {
        // Supprimer l'utilisateur s'il existe déjà (pour réinitialiser)
        await supabase.auth.admin.deleteUser(USER_EMAIL);
      } catch (deleteError) {
        console.log('Utilisateur standard non trouvé ou déjà supprimé:', deleteError);
      }

      const { data: userData, error: userCreateError } = await supabase.auth.signUp({
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
        console.log('Utilisateur standard créé avec succès:', userData);
        
        // Attendre un peu pour que la création soit complète
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: userData.user?.id,
              email: USER_EMAIL,
              name: 'Utilisateur',
            }
          ], { onConflict: 'id' });
        
        if (profileError) {
          console.error('Erreur lors de la création du profil utilisateur:', profileError);
        } else {
          console.log('Profil utilisateur créé avec succès');
        }
      }
    } else {
      console.log('Utilisateur standard existe déjà');
    }
    
    console.log('Configuration des utilisateurs de démonstration terminée');
    return true;
  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs de démonstration:', error);
    throw error;
  }
};
