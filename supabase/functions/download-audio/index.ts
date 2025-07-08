import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Title and artist extraction logic
function extractArtistTitle(youtubeTitle: string): { artist: string | null, title: string } {
  // Remove common non-title garbage
  let cleaned = youtubeTitle.replace(/\(.*?\)|\[.*?\]|\|.*$/g, '');
  cleaned = cleaned.replace(/(?:official video|lyrics|HD|audio|live|mv|feat\.?.*)/gi, '').trim();

  // Pattern: Artist - Title
  if (cleaned.includes('-')) {
    const parts = cleaned.split('-');
    if (parts.length >= 2) {
      const artist = parts[0].trim();
      const title = parts[1].trim();
      return { artist, title };
    }
  }

  return { artist: null, title: cleaned.trim() };
}

function fallbackArtist(channelName: string): string {
  return channelName.replace(' - Topic', '').trim();
}

// Enhanced metadata fetching from iTunes API
async function enhanceMetadata(artist: string, title: string) {
  try {
    const searchQuery = encodeURIComponent(`${artist} ${title}`);
    const response = await fetch(`https://itunes.apple.com/search?term=${searchQuery}&media=music&limit=1`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const track = data.results[0];
      return {
        album: track.collectionName,
        genre: track.primaryGenreName,
        year: track.releaseDate ? new Date(track.releaseDate).getFullYear() : null,
        artwork_url: track.artworkUrl100?.replace('100x100', '600x600'),
      };
    }
  } catch (error) {
    console.log('iTunes API enhancement failed:', error);
  }
  return {};
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { youtube_url, download_id } = await req.json();

    if (!youtube_url) {
      throw new Error('YouTube URL is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Extract video info using yt-dlp
    const infoProcess = new Deno.Command('yt-dlp', {
      args: [
        '--dump-json',
        '--no-download',
        youtube_url
      ],
      stdout: 'piped',
      stderr: 'piped',
    });

    const infoResult = await infoProcess.output();
    
    if (!infoResult.success) {
      throw new Error('Failed to extract video information');
    }

    const videoInfo = JSON.parse(new TextDecoder().decode(infoResult.stdout));
    const isPlaylist = Array.isArray(videoInfo) || videoInfo.entries;
    
    let videos = isPlaylist ? (videoInfo.entries || videoInfo) : [videoInfo];
    if (!Array.isArray(videos)) videos = [videos];

    // Update download record with total tracks
    await supabase
      .from('downloads')
      .update({ 
        total_tracks: videos.length,
        status: 'processing'
      })
      .eq('id', download_id);

    // Process each video
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const { artist, title } = extractArtistTitle(video.title);
      const finalArtist = artist || fallbackArtist(video.uploader || 'Unknown');

      // Update progress
      await supabase
        .from('downloads')
        .update({ 
          current_track: i + 1,
          progress: Math.round(((i + 1) / videos.length) * 100),
          title: title,
          artist: finalArtist,
          channel_name: video.uploader
        })
        .eq('id', download_id);

      // Download audio with highest quality
      const filename = `${finalArtist} - ${title}`.replace(/[^\w\s-]/g, '').trim() + '.mp3';
      const filepath = `/tmp/${filename}`;

      const downloadProcess = new Deno.Command('yt-dlp', {
        args: [
          '--extract-audio',
          '--audio-format', 'mp3',
          '--audio-quality', '0', // Highest quality available
          '--output', filepath.replace('.mp3', '.%(ext)s'),
          '--embed-thumbnail',
          '--add-metadata',
          video.webpage_url || youtube_url
        ],
        stdout: 'piped',
        stderr: 'piped',
      });

      const downloadResult = await downloadProcess.output();
      
      if (!downloadResult.success) {
        console.error('Download failed:', new TextDecoder().decode(downloadResult.stderr));
        continue;
      }

      // Enhance metadata with external APIs
      const enhancedMetadata = await enhanceMetadata(finalArtist, title);

      // Read the downloaded file
      const fileData = await Deno.readFile(filepath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filename, fileData, {
          contentType: 'audio/mpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload failed:', uploadError);
        continue;
      }

      // Update download record with final metadata
      await supabase
        .from('downloads')
        .update({
          metadata: {
            title,
            artist: finalArtist,
            channel_name: video.uploader,
            duration: video.duration,
            view_count: video.view_count,
            upload_date: video.upload_date,
            ...enhancedMetadata
          },
          file_path: uploadData.path
        })
        .eq('id', download_id);

      // Clean up temp file
      try {
        await Deno.remove(filepath);
      } catch {}
    }

    // Mark as completed
    await supabase
      .from('downloads')
      .update({ 
        status: 'completed',
        progress: 100
      })
      .eq('id', download_id);

    return new Response(
      JSON.stringify({ success: true, message: 'Download completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});