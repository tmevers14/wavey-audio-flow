
import { useState } from 'react';

interfaceURLInputProps {
  onSubmit: (url: string) => void;
  isProcessing: boolean;
}

const URLInput = ({ onSubmit, isProcessing }: URLInputProps) => {
  const [url, setUrl] = useState('');

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

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="wavy-glass rounded-3xl p-8 shadow-2xl">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full text-center text-2xl font-light bg-transparent text-gray-700 outline-none py-4"
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
