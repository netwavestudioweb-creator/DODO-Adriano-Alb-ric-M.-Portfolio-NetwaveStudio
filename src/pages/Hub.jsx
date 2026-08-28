import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Code2, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Hub() {
  const navigate = useNavigate();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [transitionState, setTransitionState] = useState(null);
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerTransition = (track, path) => {
    setTransitionState(track);
    setSliderPosition(track === 'network' ? 100 : 0);
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current || transitionState) return;
    if (e.cancelable) e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    let newPos;
    if (isMobile) {
      newPos = ((clientY - rect.top) / rect.height) * 100;
    } else {
      newPos = ((clientX - rect.left) / rect.width) * 100;
    }
    
    if (newPos > 85) {
      setIsDragging(false);
      triggerTransition(isMobile ? 'dev' : 'network', isMobile ? '/dev-ia' : '/reseaux-telecoms');
      return;
    }
    if (newPos < 15) {
      setIsDragging(false);
      triggerTransition(isMobile ? 'network' : 'dev', isMobile ? '/reseaux-telecoms' : '/dev-ia');
      return;
    }
    setSliderPosition(newPos);
  };

  useEffect(() => {
    document.body.style.userSelect = isDragging ? 'none' : 'auto';
  }, [isDragging]);

  const handleSelect = (track, path, e) => {
    if (isDragging) return;
    if (e && e.preventDefault) e.preventDefault();
    triggerTransition(track, path);
  };

  // CLIP PATH LOGIC
  const skewDesktop = 25; 
  const leftClipDesktop = `polygon(0 0, ${sliderPosition + skewDesktop}% 0, ${sliderPosition - skewDesktop}% 100%, 0 100%)`;
  
  const skewMobile = 15;
  const topClipMobile = `polygon(0 0, 100% 0, 100% ${sliderPosition - skewMobile}%, 0 ${sliderPosition + skewMobile}%)`;

  const leftClip = isMobile ? topClipMobile : leftClipDesktop;

  // ANIMATION OPACITIES & POSITIONS
  // Dev (Right/Bottom)
  const devOpacity = Math.max(0, Math.min(1, (100 - sliderPosition) / 40));
  const devScale = 1 + Math.max(0, (50 - sliderPosition) / 300);
  const devX = isMobile ? 0 : sliderPosition / 2.2;
  const devY = isMobile ? sliderPosition / 2.2 : 0;
  const devTransform = `translate(${devX}vw, ${devY}vh) scale(${devScale})`;
  
  // Network (Left/Top)
  const networkOpacity = Math.max(0, Math.min(1, sliderPosition / 40));
  const networkScale = 1 + Math.max(0, (sliderPosition - 50) / 300);
  const networkX = isMobile ? 0 : (sliderPosition - 100) / 2.2;
  const networkY = isMobile ? (sliderPosition - 100) / 2.2 : 0;
  const networkTransform = `translate(${networkX}vw, ${networkY}vh) scale(${networkScale})`;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchEnd={handlePointerUp}
      className="h-[100dvh] w-full relative overflow-hidden font-sans select-none bg-[#131315]"
    >
      <Helmet>
        <title>ADRIANO DODO | Architecte Réseaux & IA</title>
        <meta name="description" content="Choisissez votre parcours : Infrastructures Réseaux & Télécoms ou Développement Web & IA." />
      </Helmet>

      {/* DRAG HANDLE */}
      <div 
        className={`absolute z-[70] flex flex-col items-center justify-center transition-all ${isDragging ? 'duration-0' : 'duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} ${transitionState ? 'opacity-0 scale-150' : 'opacity-100'}`}
        style={{ 
          left: isMobile ? '50%' : `${sliderPosition}%`, 
          top: isMobile ? `${sliderPosition}%` : '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div 
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          className="flex flex-col items-center cursor-move p-4 md:p-8"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 lg:p-3 rounded-full shadow-2xl hover:bg-white/20 transition-colors animate-pulse mb-3">
            <GripVertical className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          {/* Arrow Hints */}
          <div className="flex items-center gap-2 text-white/70 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            <ChevronLeft className="w-3 h-3 animate-slide-hint" />
            <span className="mono-label text-[9px] uppercase tracking-widest font-bold">
              Glissez
            </span>
            <ChevronRight className="w-3 h-3 animate-slide-hint" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* PANE: DEV & IA (Background / Bottom Right) */}
      {/* ----------------------------------------------------------- */}
      <div 
        className={`absolute inset-0 group flex flex-col items-center justify-center cursor-pointer bg-[#131315] text-snow ${isDragging ? 'transition-none' : 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]'}`}
        onClick={(e) => handleSelect('dev', '/dev-ia', e)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] transition-opacity duration-700 opacity-30 group-hover:opacity-100" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E8634A]/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000 ease-out" />
        
        {/* BRANDING BACK (WHITE TEXT) */}
        <div className={`absolute inset-x-0 bottom-10 pointer-events-none z-[20] flex items-center justify-center transition-opacity duration-700 ${transitionState ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="font-extrabold text-[12vw] md:text-[8vw] tracking-tighter whitespace-nowrap text-white drop-shadow-2xl">
            ADRIANO DODO<span className="text-[#E8634A]">.</span>
          </h1>
        </div>

        {/* Content Wrapper */}
        <div 
          className={`relative z-10 p-8 w-full max-w-lg flex flex-col items-center text-center ${isDragging ? '' : 'transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'}`}
          style={{ opacity: devOpacity, transform: devTransform }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(232,99,74,0.3)] transition-all duration-500">
            <Code2 className="w-6 h-6 md:w-8 md:h-8 text-[#E8634A]" />
          </div>
          <h2 className="font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2 group-hover:text-[#E8634A] transition-colors duration-500 leading-tight">
            Développement<br/>Web & IA
          </h2>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* PANE: NETWORK & TELECOM (Clipped Overlay / Top Left) */}
      {/* ----------------------------------------------------------- */}
      <div 
        className={`absolute inset-0 group flex flex-col items-center justify-center cursor-pointer bg-snow text-ink ${isDragging ? 'transition-none' : 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]'}`}
        style={{ clipPath: leftClip }}
        onClick={(e) => handleSelect('network', '/reseaux-telecoms', e)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000 ease-out" />

        {/* BRANDING FRONT (DARK TEXT) */}
        <div className={`absolute inset-x-0 bottom-10 pointer-events-none z-[20] flex items-center justify-center transition-opacity duration-700 ${transitionState ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="font-extrabold text-[12vw] md:text-[8vw] tracking-tighter whitespace-nowrap text-ink drop-shadow-2xl">
            ADRIANO DODO<span className="text-blue-600">.</span>
          </h1>
        </div>

        {/* Content Wrapper */}
        <div 
          className={`relative z-10 p-8 w-full max-w-lg flex flex-col items-center text-center ${isDragging ? '' : 'transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'}`}
          style={{ opacity: networkOpacity, transform: networkTransform }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-ink/10 shadow-xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
            <Network className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          <h2 className="font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2 group-hover:text-blue-600 transition-colors duration-500 leading-tight">
            Réseaux &<br/>Télécoms
          </h2>
        </div>
      </div>
    </div>
  );
}
