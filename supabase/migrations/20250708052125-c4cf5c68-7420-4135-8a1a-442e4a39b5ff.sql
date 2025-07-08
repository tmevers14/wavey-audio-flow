-- Create downloads table for tracking jobs
CREATE TABLE public.downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  youtube_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  current_track INTEGER DEFAULT 0,
  total_tracks INTEGER DEFAULT 0,
  title TEXT,
  artist TEXT,
  channel_name TEXT,
  metadata JSONB,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Create policies for downloads
CREATE POLICY "Anyone can create downloads" 
ON public.downloads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view downloads" 
ON public.downloads 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update downloads" 
ON public.downloads 
FOR UPDATE 
USING (true);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', true);

-- Create policies for audio files
CREATE POLICY "Audio files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio-files');

CREATE POLICY "Anyone can upload audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio-files');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_downloads_updated_at
BEFORE UPDATE ON public.downloads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();