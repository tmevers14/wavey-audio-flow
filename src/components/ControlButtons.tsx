
interface ControlButtonsProps {
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
  onOptions?: () => void;
}

const ControlButtons = ({ isProcessing, onStart, onStop, onOptions }: ControlButtonsProps) => {
  return (
    <div className="flex gap-8 justify-between items-center w-full">
      <button
        onClick={isProcessing ? onStop : onStart}
        disabled={isProcessing}
        className={`bg-blue-500 rounded-2xl px-16 py-6 flex items-center justify-center transition-all duration-300 shadow-2xl group ${
          isProcessing 
            ? 'cursor-not-allowed' 
            : 'hover:bg-blue-600'
        }`}
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="text-center">
          <div className="text-white font-medium text-xl">
            Start / Go
          </div>
          <div className="text-blue-100 text-sm whitespace-nowrap">
            Commencer | Empezar | Iniziare
          </div>
        </div>
      </button>

      <button
        onClick={onOptions}
        className="bg-blue-500 hover:bg-blue-600 rounded-2xl px-16 py-6 flex items-center justify-center transition-all duration-300 shadow-2xl group"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div className="text-center">
          <div className="text-white font-medium text-xl">
            {isProcessing ? "Cancel / Terminate" : "Next / Again"}
          </div>
          <div className="text-blue-100 text-sm whitespace-nowrap">
            {isProcessing ? "Annuler | Cancelar | Terminare" : "Suivant | Siguiente | Successivo"}
          </div>
        </div>
      </button>
    </div>
  );
};

export default ControlButtons;
