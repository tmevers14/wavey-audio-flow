
import { Play, Square, Settings } from 'lucide-react';

interface ControlButtonsProps {
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  onOptions?: () => void;
}

const ControlButtons = ({ isProcessing, onStart, onStop, onOptions }: ControlButtonsProps) => {
  return (
    <div className="flex gap-6 justify-center items-center mt-12">
      <button
        onClick={isProcessing ? onStop : onStart}
        className="wavy-glass rounded-2xl px-12 py-6 flex items-center justify-center gap-4 hover:bg-white/30 transition-all duration-300 shadow-xl group min-w-[200px]"
      >
        {isProcessing ? (
          <>
            <Square size={32} className="text-white group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="text-white font-medium text-lg">Continue</div>
              <div className="text-white/70 text-sm">Continuer | Kontinuar | Continuare</div>
            </div>
          </>
        ) : (
          <>
            <Play size={32} className="text-white group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <div className="text-white font-medium text-lg">Start / Go</div>
              <div className="text-white/70 text-sm">Commencer | Empezar | Iniziare</div>
            </div>
          </>
        )}
      </button>

      <button
        onClick={onOptions}
        className="wavy-glass rounded-2xl px-12 py-6 flex items-center justify-center gap-4 hover:bg-white/30 transition-all duration-300 shadow-xl group min-w-[200px]"
      >
        <Settings size={32} className="text-white group-hover:scale-110 transition-transform" />
        <div className="text-center">
          <div className="text-white font-medium text-lg">Options</div>
          <div className="text-white/70 text-sm">Options | Opciones | Opzioni</div>
        </div>
      </button>
    </div>
  );
};

export default ControlButtons;
