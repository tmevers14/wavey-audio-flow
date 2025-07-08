
import { useState, useEffect } from 'react';
import WavyHeader from '@/components/WavyHeader';
import URLInput from '@/components/URLInput';
import ControlButtons from '@/components/ControlButtons';
import FileSaveDialog from '@/components/FileSaveDialog';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [url, setUrl] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savePath, setSavePath] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [downloadId, setDownloadId] = useState<string | null>(null);

  // Track cursor position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Poll download status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing && downloadId) {
      interval = setInterval(async () => {
        try {
          const { data, error } = await supabase.functions.invoke('get-download-status', {
            body: { id: downloadId }
          });
          
          if (error) throw error;
          
          if (data) {
            setProgress(data.progress || 0);
            setCurrentTrack(data.current_track || 0);
            setTotalTracks(data.total_tracks || 0);
            
            if (data.status === 'completed') {
              setIsProcessing(false);
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 3000);
            }
          }
        } catch (error) {
          console.error('Failed to get download status:', error);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, downloadId]);

  const handleStart = () => {
    if (!url) return;
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async (path: string, createFolder: boolean, folderName?: string) => {
    const finalPath = createFolder && folderName ? `${path}/${folderName}` : path;
    setSavePath(finalPath);
    setShowSaveDialog(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('start-download', {
        body: { 
          youtube_url: url,
          save_path: finalPath
        }
      });
      
      if (error) throw error;
      
      setDownloadId(data.download_id);
      setIsProcessing(true);
      setProgress(0);
      setCurrentTrack(0);
      setTotalTracks(0);
    } catch (error) {
      console.error('Failed to start download:', error);
    }
  };

  const handleStop = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentTrack(0);
    setTotalTracks(0);
    setShowSuccess(false);
  };

  const handleUrlSubmit = (submittedUrl: string) => {
    setUrl(submittedUrl);
    console.log('URL submitted:', submittedUrl);
  };

  const handleReset = () => {
    console.log('Reset button clicked');
    setIsProcessing(false);
    setProgress(0);
    setCurrentTrack(0);
    setTotalTracks(0);
    setUrl('');
    setSavePath('');
    setShowSuccess(false);
  };

  return (
    <div className="w-full h-screen bg-[#f2f2f2] relative overflow-hidden">
      {/* Static background image - opacity-20 when idle or success, opacity-0 during processing */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          isProcessing ? 'opacity-0' : 'opacity-20'
        }`}
        style={{
          backgroundImage: 'url(/lovable-uploads/4e3109d5-05cf-43ac-a429-ba199fd8ae52.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Video background - only visible during processing at 20% opacity with border fix */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isProcessing ? 'opacity-20' : 'opacity-0 pointer-events-none'
      }`}>
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=df2ohmntv&public_id=fluid_movie_smaller_fzvobk&profile=cld-looping"
          width="100%"
          height="100%"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          frameBorder="0"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            transform: 'scale(1.15)',
            filter: 'blur(0.5px)'
          }}
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        {/* Perfectly centered unified column */}
        <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-none">
          <div className="flex flex-col items-center space-y-8">
            <URLInput 
              onSubmit={handleUrlSubmit} 
              isProcessing={isProcessing}
              url={url}
              setUrl={setUrl}
              progress={progress}
              currentTrack={currentTrack}
              totalTracks={totalTracks}
              cursorPosition={cursorPosition}
              onStart={handleStart}
              showSuccess={showSuccess}
            />
            
            <ControlButtons
              isProcessing={isProcessing}
              onStart={handleStart}
              onStop={handleStop}
              onOptions={handleReset}
            />
          </div>
        </div>
      </div>

      <FileSaveDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onConfirm={handleSaveConfirm}
      />
    </div>
  );
};

export default Index;
