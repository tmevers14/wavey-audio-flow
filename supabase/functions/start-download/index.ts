import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { youtube_url, save_path } = await req.json();

    if (!youtube_url) {
      throw new Error('YouTube URL is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create download record
    const { data: download, error: createError } = await supabase
      .from('downloads')
      .insert({
        youtube_url,
        status: 'pending',
        progress: 0
      })
      .select()
      .single();

    if (createError) {
      throw new Error(`Failed to create download record: ${createError.message}`);
    }

    // Start background download process
    fetch(`${supabaseUrl}/functions/v1/download-audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        youtube_url,
        download_id: download.id,
        save_path
      })
    }).catch(error => {
      console.error('Background download failed:', error);
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        download_id: download.id,
        message: 'Download started successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Start download error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});