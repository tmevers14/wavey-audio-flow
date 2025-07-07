
import { useState, useRef } from 'react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isProcessing: boolean;
  url: string;
  setUrl: (url: string) => void;
}

const URLInput = ({ onSubmit, isProcessing, url, setUrl }: URLInputProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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

  const isValidUrl = (str: string) => {
    return str.includes('youtube.com') || str.includes('youtu.be');
  };

  const shouldShowTitle = url.length === 0 && !isFocused;
  const titleOpacity = isHovered ? 'opacity-50' : 'opacity-100';

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div 
          className="wavy-glass rounded-3xl p-8 shadow-2xl relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* XLR8 AUDIO title overlay */}
          {shouldShowTitle && (
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${titleOpacity}`}>
              <h1 className="text-4xl font-futura font-bold italic text-blue-500 tracking-wide">
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
            className="w-full text-center text-2xl font-light bg-transparent text-gray-700 outline-none py-4 relative z-10"
            disabled={isProcessing}
            style={{ 
              caretColor: '#3b82f6',
              fontSize: '24px',
              lineHeight: '1.5'
            }}
          />
          
          {url && (
            <div className="mt-4 text-center">
              <span className={`text-sm ${isValidUrl(url) ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}`}>
                {isValidUrl(url) ? '✓ Valid YouTube URL' : '⚠ Please enter a valid YouTube URL'}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default URLInput;
