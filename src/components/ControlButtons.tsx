
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
        className="bg-blue-500 hover:bg-blue-600 rounded-2xl px-12 py-6 flex items-center justify-center transition-all duration-300 shadow-xl group min-w-[200px]"
      >
        <div className="text-center">
          <div className="text-white font-medium text-lg">
            {isProcessing ? "Continue" : "Start / Go"}
          </div>
          <div className="text-blue-100 text-sm">
            {isProcessing ? "Continuer | Kontinuar | Continuare" : "Commencer | Empezar | Iniziare"}
          </div>
        </div>
      </button>

      <button
        onClick={onOptions}
        className="bg-blue-500 hover:bg-blue-600 rounded-2xl px-12 py-6 flex items-center justify-center transition-all duration-300 shadow-xl group min-w-[200px]"
      >
        <div className="text-center">
          <div className="text-white font-medium text-lg">Next / Again</div>
          <div className="text-blue-100 text-sm">Suivant | Siguiente | Successivo</div>
        </div>
      </button>
    </div>
  );
};

export default ControlButtons;
