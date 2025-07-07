
import { useState } from 'react';

interface URLInputProps {
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

  const isValidUrl = (str: string) => {
    return str.includes('youtube.com') || str.includes('youtu.be');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="wavy-glass rounded-3xl p-8 shadow-2xl">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder=">>> Paste YouTube URL here <<<"
            className="w-full text-center text-2xl font-light bg-transparent text-white placeholder-white/70 outline-none py-4"
            disabled={isProcessing}
          />
          
          {url && (
            <div className="mt-4 text-center">
              <span className={`text-sm ${isValidUrl(url) ? 'text-green-200' : 'text-red-200'}`}>
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
