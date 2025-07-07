
interface LogoProps {
  isProcessing: boolean;
}

const Logo = ({ isProcessing }: LogoProps) => {
  return (
    <div className="relative w-24 h-24">
      {/* Main logo */}
      <img 
        src="/lovable-uploads/3d3f5bfc-684e-4625-ab9e-5c1d8a4b55d1.png" 
        alt="XLR8 Audio Logo" 
        className="w-full h-full object-contain"
      />
      
      {/* Indeterminate progress ring when processing */}
      {isProcessing && (
        <div className="absolute inset-0">
          <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="70 30"
              className="opacity-80"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Logo;
