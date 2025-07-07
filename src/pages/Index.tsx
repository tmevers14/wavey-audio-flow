
import { useState, useEffect } from 'react';
import WavyHeader from '@/components/WavyHeader';
import URLInput from '@/components/URLInput';
import ControlButtons from '@/components/ControlButtons';
import ProgressIndicator from '@/components/ProgressIndicator';
import Logo from '@/components/Logo';

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Organic texture background */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: 'url(/lovable-uploads/df105e19-7b57-44ea-8f49-f6b2174d3688.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Overlay for better content visibility */}
      <div className="absolute inset-0 bg-white/20"></div>

      <div className="relative z-10">
        <WavyHeader />
        
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
          {/* Logo and title positioned using rule of thirds */}
          <div className="flex flex-col items-center mb-16">
            <Logo isProcessing={isProcessing} />
            
            <h1 className="text-6xl font-futura font-bold italic text-blue-500 tracking-wide mt-8">
              XLR8 AUDIO.
            </h1>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
            <URLInput 
              onSubmit={handleUrlSubmit} 
              isProcessing={isProcessing}
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
