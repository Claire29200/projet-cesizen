
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if data already exists
    const { data: existingPages, error: checkError } = await supabase
      .from('info_pages')
      .select('id')
      .limit(1);
    
    if (checkError) {
      throw new Error(`Erreur lors de la vérification des données existantes: ${checkError.message}`);
    }
    
    // Si des données existent déjà, ne pas migrer
    if (existingPages && existingPages.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Des données existent déjà dans Supabase. Migration annulée." 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Données initiales à migrer (exemple)
    const initialPages = [
      {
        title: "La santé mentale",
        slug: "sante-mentale-introduction",
        is_published: true,
        sections: [
          {
            title: "Comprendre la santé mentale",
            content: "La santé mentale est un état de bien-être..."
          }
        ]
      }
      // Ajoutez d'autres pages ici
    ];

    // Migration des pages
    for (const page of initialPages) {
      const { data: pageData, error: pageError } = await supabase
        .from('info_pages')
        .insert({
          title: page.title,
          slug: page.slug,
          is_published: page.is_published
        })
        .select()
        .single();

      if (pageError) {
        throw new Error(`Erreur lors de l'insertion de la page ${page.title}: ${pageError.message}`);
      }

      // Insérer les sections
      for (const section of page.sections) {
        const { error: sectionError } = await supabase
          .from('content_sections')
          .insert({
            page_id: pageData.id,
            title: section.title,
            content: section.content,
            position: 0
          });

        if (sectionError) {
          throw new Error(`Erreur lors de l'insertion des sections: ${sectionError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${initialPages.length} pages ont été migrées avec succès.` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Erreur lors de la migration: ${error instanceof Error ? error.message : String(error)}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
