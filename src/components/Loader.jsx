import React, { useEffect, useState } from 'react';

export default function Loader({ onComplete }) {
  const [stage, setStage] = useState('entering');

  useEffect(() => {
    // Hold the loading screen for a bit
    const t1 = setTimeout(() => {
      setStage('exiting');
    }, 2000);

    // Call onComplete after exit animation finishes
    const t2 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0c] transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="overflow-hidden mb-8">
        <h1 
          className={`font-extrabold text-4xl md:text-5xl lg:text-7xl tracking-tighter whitespace-nowrap text-snow transition-transform duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            stage === 'exiting' ? '-translate-y-[120%]' : 'translate-y-0 animate-fade-up'
          }`}
        >
          ADRIANO DODO<span className="text-coral">.</span>
        </h1>
      </div>
      
      {/* Progress Line */}
      <div 
        className={`w-48 md:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden transition-opacity duration-500 ${stage === 'exiting' ? 'opacity-0' : 'opacity-100'}`}
      >
        <div 
          className="h-full bg-coral origin-left rounded-full" 
          style={{ 
            animation: 'loader-progress 2s cubic-bezier(0.76,0,0.24,1) forwards' 
          }} 
        />
      </div>

      <style>{`
        @keyframes loader-progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.4); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
