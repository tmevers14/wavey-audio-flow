
interface ProgressIndicatorProps {
  progress: number;
  currentTrack: number;
  totalTracks: number;
  isVisible: boolean;
}

const ProgressIndicator = ({ progress, currentTrack, totalTracks, isVisible }: ProgressIndicatorProps) => {
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 px-6">
      <div className="wavy-glass rounded-3xl p-8 shadow-2xl">
        {/* Track Counter */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white/90 text-2xl font-light">
            {currentTrack} / {totalTracks}
          </div>
          <div className="text-white/90 text-3xl font-bold">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-24 bg-white/20 rounded-full overflow-hidden shadow-inner">
          <div 
            className="absolute inset-0 wavy-progress rounded-full transition-all duration-500 ease-out flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            {/* Progress indicator dot */}
            <div className="absolute right-2 w-6 h-6 bg-white rounded-full shadow-lg animate-pulse"></div>
          </div>
          
          {/* Center progress text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/80 font-medium text-lg">
              Downloading...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
