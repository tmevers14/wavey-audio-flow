
import { useState, useEffect } from 'react';
import WavyHeader from '@/components/WavyHeader';
import URLInput from '@/components/URLInput';
import ControlButtons from '@/components/ControlButtons';
import ProgressIndicator from '@/components/ProgressIndicator';
import FileSaveDialog from '@/components/FileSaveDialog';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [url, setUrl] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savePath, setSavePath] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Track cursor position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulate download progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsProcessing(false);
            return 100;
          }
          
          // Update track count based on progress
          const newProgress = prev + Math.random() * 3;
          const tracks = Math.ceil((newProgress / 100) * totalTracks);
          setCurrentTrack(Math.min(tracks, totalTracks));
          
          return Math.min(newProgress, 100);
        });
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, totalTracks]);

  const handleStart = () => {
    if (!url) return;
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = (path: string, createFolder: boolean, folderName?: string) => {
    setSavePath(createFolder && folderName ? `${path}/${folderName}` : path);
    setIsProcessing(true);
    setProgress(0);
    setCurrentTrack(0);
    // Simulate playlist detection
    setTotalTracks(Math.floor(Math.random() * 15) + 1);
    console.log('Saving to:', createFolder && folderName ? `${path}/${folderName}` : path);
  };

  const handleStop = () => {
    setIsProcessing(false);
    setProgress(0);
    setCurrentTrack(0);
    setTotalTracks(0);
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
  };

  return (
    <div className="w-full h-screen bg-[#f2f2f2] relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Background image with opacity */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/lovable-uploads/4e3109d5-05cf-43ac-a429-ba199fd8ae52.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <div className="relative z-10 h-full flex items-center justify-center">
        {/* Unified container for perfect alignment */}
        <div className="flex flex-col items-center justify-center space-y-16">
          {/* Container that defines the width for both input and buttons */}
          <div className="w-[592px] flex flex-col items-center space-y-16">
            <URLInput 
              onSubmit={handleUrlSubmit} 
              isProcessing={isProcessing}
              url={url}
              setUrl={setUrl}
              progress={progress}
              currentTrack={currentTrack}
              totalTracks={totalTracks}
              cursorPosition={cursorPosition}
            />
            
            <ControlButtons
              isProcessing={isProcessing}
              onStart={handleStart}
              onStop={handleStop}
              onOptions={handleReset}
            />
          </div>

          <ProgressIndicator
            progress={progress}
            currentTrack={currentTrack}
            totalTracks={totalTracks}
            isVisible={isProcessing || progress > 0}
          />
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
