
import { Menu } from 'lucide-react';

const WavyHeader = () => {
  return (
    <header className="flex justify-between items-center p-6 relative z-10">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white/60"></div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          XLR8 AUDIO
        </h1>
      </div>
      
      <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
        <Menu size={24} className="text-white" />
      </button>
    </header>
  );
};

export default WavyHeader;
