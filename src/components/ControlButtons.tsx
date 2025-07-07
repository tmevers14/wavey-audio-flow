
interface ControlButtonsProps {
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  onOptions?: () => void;
}

const ControlButtons = ({ isProcessing, onStart, onStop, onOptions }: ControlButtonsProps) => {
  return (
    <div className="flex gap-8 justify-center items-center">
      <button
        onClick={isProcessing ? onStop : onStart}
        className="bg-blue-500 hover:bg-blue-600 rounded-2xl px-16 py-8 flex items-center justify-center transition-all duration-300 shadow-2xl group"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          minWidth: '280px' 
        }}
      >
        <div className="text-center">
          <div className="text-white font-medium text-xl">
            {isProcessing ? "Continue" : "Start / Go"}
          </div>
          <div className="text-blue-100 text-base">
            {isProcessing ? "Continuer | Kontinuar | Continuare" : "Commencer | Empezar | Iniziare"}
          </div>
        </div>
      </button>

      <button
        onClick={onOptions}
        className="bg-blue-500 hover:bg-blue-600 rounded-2xl px-16 py-8 flex items-center justify-center transition-all duration-300 shadow-2xl group"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
          minWidth: '280px' 
        }}
      >
        <div className="text-center">
          <div className="text-white font-medium text-xl">Next / Again</div>
          <div className="text-blue-100 text-base">Suivant | Siguiente | Successivo</div>
        </div>
      </button>
    </div>
  );
};

export default ControlButtons;
