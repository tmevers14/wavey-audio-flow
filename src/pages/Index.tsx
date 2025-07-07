
import { useState, useEffect } from 'react';
import WavyHeader from '@/components/WavyHeader';
import URLInput from '@/components/URLInput';
import ControlButtons from '@/components/ControlButtons';
import ProgressIndicator from '@/components/ProgressIndicator';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [totalTracks, setTotalTracks] = useState(0);
  const [url, setUrl] = useState('');

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
    
    setIsProcessing(true);
    setProgress(0);
    setCurrentTrack(0);
    // Simulate playlist detection
    setTotalTracks(Math.floor(Math.random() * 15) + 1);
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
    // Auto-start when URL is submitted via Enter
    if (submittedUrl.trim() && !isProcessing) {
      handleStart();
    }
  };

  const handleReset = () => {
    console.log('Reset button clicked');
    setIsProcessing(false);
    setProgress(0);
    setCurrentTrack(0);
    setTotalTracks(0);
    setUrl('');
  };

  return (
    <div className="w-full h-screen bg-[#f2f2f2] relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Background image with opacity */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/lovable-uploads/4e3109d5-05cf-43ac-a429-ba199fd8ae52.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      <div className="relative z-10 h-full">
        <WavyHeader />
        
        <main className="flex flex-col items-center justify-center h-[calc(100%-120px)]">
          {/* Centered group containing input and buttons */}
          <div className="flex flex-col items-center justify-center space-y-12">
            <URLInput 
              onSubmit={handleUrlSubmit} 
              isProcessing={isProcessing}
              url={url}
              setUrl={setUrl}
            />
            
            <ControlButtons
              isProcessing={isProcessing}
              onStart={handleStart}
              onStop={handleStop}
              onOptions={handleReset}
            />

            <ProgressIndicator
              progress={progress}
              currentTrack={currentTrack}
              totalTracks={totalTracks}
              isVisible={isProcessing || progress > 0}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
