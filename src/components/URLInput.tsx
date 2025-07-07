
import { useState, useRef } from 'react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isProcessing: boolean;
  url: string;
  setUrl: (url: string) => void;
  progress?: number;
  currentTrack?: number;
  totalTracks?: number;
}

const URLInput = ({ 
  onSubmit, 
  isProcessing, 
  url, 
  setUrl, 
  progress = 0, 
  currentTrack = 0, 
  totalTracks = 0 
}: URLInputProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isProcessing) {
      onSubmit(url.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isValidUrl = (str: string) => {
    return str.includes('youtube.com') || str.includes('youtu.be');
  };

  const shouldShowTitle = url.length === 0 && !isFocused && !isProcessing;
  const titleOpacity = isHovered ? 'opacity-50' : 'opacity-100';

  const getStatusText = () => {
    if (isProcessing && totalTracks > 0) {
      return `Processing ${currentTrack}/${totalTracks} | ${Math.round(progress)}% Complete`;
    }
    if (progress === 100 && !isProcessing) {
      return 'Success!';
    }
    if (url && !isProcessing) {
      return isValidUrl(url) ? '✓ Valid YouTube URL' : '⚠ Please enter a valid YouTube URL';
    }
    return '';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div 
          className="frosted-glass rounded-3xl p-12 shadow-2xl relative cursor-text"
          style={{ 
            boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.4)',
            width: '608px', // Match combined button width (280px + 48px gap + 280px)
            margin: '0 auto'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Dynamic lighting effect */}
          <div 
            className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 150px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(59, 130, 246, 0.15) 0%, transparent 70%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
          
          {/* XLR8 AUDIO title overlay */}
          {shouldShowTitle && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${titleOpacity}`}>
              <h1 className="text-7xl font-futura font-bold italic text-blue-500 tracking-wide">
                XLR8 AUDIO.
              </h1>
            </div>
          )}
          
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full text-center text-3xl font-light bg-transparent text-blue-500 outline-none py-6 relative z-10"
            disabled={isProcessing}
            style={{ 
              fontSize: '28px',
              lineHeight: '1.5'
            }}
          />
          
          {getStatusText() && (
            <div className="mt-6 text-center">
              <span className={`text-base font-medium ${
                getStatusText().includes('Success') 
                  ? 'text-green-600' 
                  : getStatusText().includes('Processing')
                  ? 'text-blue-600'
                  : getStatusText().includes('Valid') 
                  ? 'text-green-600' 
                  : 'text-red-500'
              }`}>
                {getStatusText()}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default URLInput;
