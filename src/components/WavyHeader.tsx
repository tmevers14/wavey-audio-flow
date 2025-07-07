
import { Menu } from 'lucide-react';

const WavyHeader = () => {
  return (
    <header className="flex justify-end items-center p-6 relative z-10">
      <button className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200">
        <Menu size={32} className="text-blue-500" strokeWidth={3} />
      </button>
    </header>
  );
};

export default WavyHeader;
