
import { useState, useRef } from 'react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isProcessing: boolean;
  url: string;
  setUrl: (url: string) => void;
  progress?: number;
  currentTrack?: number;
  totalTracks?: number;
  cursorPosition: { x: number; y: number };
  onStart: () => void;
}

const URLInput = ({ 
  onSubmit, 
  isProcessing, 
  url, 
  setUrl, 
  progress = 0, 
  currentTrack = 0, 
  totalTracks = 0,
  cursorPosition,
  onStart
}: URLInputProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isProcessing && isValidUrl(url.trim())) {
      onStart();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url.trim() && !isProcessing && isValidUrl(url.trim())) {
      onStart();
    }
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
      return 'Download complete';
    }
    if (url && !isProcessing) {
      return isValidUrl(url) ? '✓ Valid YouTube URL' : '⚠ Please enter a valid YouTube URL';
    }
    return '';
  };

  // Calculate inverse lighting effect
  const getInverseLighting = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Normalize cursor position (0 to 1)
    const normalizedX = cursorPosition.x / windowWidth;
    const normalizedY = cursorPosition.y / windowHeight;
    
    // Inverse lighting: when cursor is left, brighten right edge, etc.
    const rightIntensity = normalizedX * 0.3; // Cursor left = brighten right
    const leftIntensity = (1 - normalizedX) * 0.3; // Cursor right = brighten left
    const topIntensity = (1 - normalizedY) * 0.2; // Cursor bottom = brighten top
    
    return {
      right: rightIntensity,
      left: leftIntensity,
      top: topIntensity
    };
  };

  const lighting = getInverseLighting();

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div 
          className="enhanced-frosted-glass rounded-3xl p-8 shadow-2xl relative cursor-text"
          style={{ 
            boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            width: '720px',
            margin: '0 auto',
            borderTop: `2px solid rgba(255, 255, 255, ${0.4 + lighting.top})`,
            borderRight: `2px solid rgba(255, 255, 255, ${0.3 + lighting.right})`,
            borderLeft: `2px solid rgba(255, 255, 255, ${0.3 + lighting.left})`,
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => inputRef.current?.focus()}
        >
          {/* XLR8 AUDIO title overlay with larger size */}
          {shouldShowTitle && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${titleOpacity}`}>
              <h1 className="text-6xl font-futura font-bold italic text-blue-500 tracking-wide">
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
            className="w-full text-center text-3xl font-light bg-transparent text-blue-500 outline-none py-4 relative z-10"
            disabled={isProcessing}
            style={{ 
              fontSize: '32px',
              lineHeight: '1.5',
              caretColor: isFocused ? '#3b82f6' : 'transparent'
            }}
          />
          
          {getStatusText() && (
            <div className="mt-4 text-center">
              <span className={`text-lg font-medium ${
                getStatusText().includes('complete') 
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
