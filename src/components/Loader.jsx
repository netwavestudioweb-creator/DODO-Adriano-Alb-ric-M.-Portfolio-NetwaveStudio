import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Keep loader on for a minimum of 800ms to feel deliberate, 
    // but wait for window.onload for actual assets if needed.
    // Since React handles components, we'll just use a timeout
    // combined with document.readyState
    
    const handleComplete = () => {
      setFade(true);
      setTimeout(() => setLoading(false), 500); // 500ms fade out duration
    };

    if (document.readyState === 'complete') {
      setTimeout(handleComplete, 800);
    } else {
      window.addEventListener('load', () => setTimeout(handleComplete, 800));
    }

    return () => window.removeEventListener('load', handleComplete);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={twMerge(
        clsx(
          "fixed inset-0 z-[100] flex items-center justify-center bg-snow transition-opacity duration-500 ease-in-out",
          fade ? "opacity-0 pointer-events-none" : "opacity-100"
        )
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Simple elegant spinner */}
        <div className="w-10 h-10 border-2 border-graphite/20 border-t-coral rounded-full animate-spin"></div>
        <div className="text-graphite font-mono uppercase tracking-widest text-xs animate-pulse">
          Loading
        </div>
      </div>
    </div>
  );
}
