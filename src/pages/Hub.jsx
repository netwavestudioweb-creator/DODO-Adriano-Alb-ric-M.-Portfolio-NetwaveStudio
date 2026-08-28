import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Code2, ArrowRight, Server, Cpu, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Hub() {
  const navigate = useNavigate();
  const [sliderPosition, setSliderPosition] = useState(50); // 50%
  const [isDragging, setIsDragging] = useState(false);
  const [transitionState, setTransitionState] = useState(null); // 'network' or 'dev'
  const containerRef = useRef(null);

  const triggerTransition = (track, path) => {
    setTransitionState(track);
    setSliderPosition(track === 'network' ? 100 : 0);
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  // Handle Dragging
  const handlePointerDown = (e) => {
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !containerRef.current || transitionState) return;
    
    // Prevent text selection while dragging
    if (e.cancelable) e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    let newPos = ((clientX - rect.left) / rect.width) * 100;
    
    // Auto-Snap Logic (Thresholds)
    if (newPos > 85) {
      setIsDragging(false);
      triggerTransition('network', '/reseaux-telecoms');
      return;
    }
    if (newPos < 15) {
      setIsDragging(false);
      triggerTransition('dev', '/dev-ia');
      return;
    }

    setSliderPosition(newPos);
  };

  // Prevent drag selection issues globally while dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }
  }, [isDragging]);

  const handleSelect = (track, path, e) => {
    if (isDragging) return;
    if (e && e.preventDefault) e.preventDefault();
    triggerTransition(track, path);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchEnd={handlePointerUp}
      className="h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans relative select-none"
    >
      <Helmet>
        <title>ADRIANO DODO | Architecte Réseaux & IA</title>
        <meta name="description" content="Choisissez votre parcours : Infrastructures Réseaux & Télécoms ou Développement Web & IA." />
      </Helmet>

      {/* Central Draggable Handle (Visible on Desktop) */}
      <div 
        className={`absolute top-0 bottom-0 z-50 hidden md:flex flex-col items-center justify-center transition-all ${isDragging ? 'duration-0' : 'duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'} ${transitionState ? 'opacity-0 scale-150' : 'opacity-100'}`}
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div 
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          className="flex flex-col items-center cursor-ew-resize group px-8"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full mb-4 shadow-2xl group-hover:bg-white/20 transition-colors animate-pulse">
            <GripVertical className="w-6 h-6 text-white mix-blend-difference" />
          </div>
          
          <h1 
            className="font-extrabold text-4xl lg:text-5xl tracking-tighter whitespace-nowrap drop-shadow-md"
            style={{ 
              background: 'linear-gradient(to right, #0F172A 50%, #ffffff 50%)', 
              WebkitBackgroundClip: 'text', 
              color: 'transparent' 
            }}
          >
            ADRIANO<br/>DODO<span style={{ color: '#E8634A', WebkitBackgroundClip: 'border-box' }}>.</span>
          </h1>

          <div className="flex items-center gap-2 mt-4 text-white/80 mix-blend-difference">
            <ChevronLeft className="w-3 h-3 animate-slide-hint" />
            <span className="mono-label text-[10px] uppercase tracking-[0.3em]">
              Glissez
            </span>
            <ChevronRight className="w-3 h-3 animate-slide-hint" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
      </div>

      {/* Mobile-only logo (Fixed at top) */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none md:hidden transition-opacity duration-500 ${transitionState ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="font-extrabold text-2xl tracking-tighter text-ink text-center">
          ADRIANO DODO<span className="text-coral">.</span>
        </h1>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* LEFT PANE: NETWORK & TELECOM (Light Theme: White/Blue)       */}
      {/* ----------------------------------------------------------- */}
      <div 
        className={`relative group h-1/2 md:h-full flex flex-col justify-center items-center overflow-hidden cursor-pointer
          bg-snow text-ink border-b md:border-b-0 border-ink/10
          ${isDragging ? 'transition-none' : 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]'}
          ${transitionState === 'dev' ? 'opacity-0' : 'opacity-100'}
        `}
        style={{ width: window.innerWidth >= 768 ? `${sliderPosition}%` : '100%' }}
        onClick={(e) => handleSelect('network', '/reseaux-telecoms', e)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:3rem_3rem] transition-opacity duration-700 opacity-60 group-hover:opacity-100" />
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000 ease-out" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />

        {/* Content Wrapper (Centered) */}
        <div className={`relative z-10 p-8 w-full max-w-lg flex flex-col items-center text-center transform ${sliderPosition > 55 ? 'scale-105' : 'scale-100'} group-hover:-translate-y-2 transition-all duration-700 ease-out`}>
          
          <div className="w-16 h-16 rounded-2xl bg-white border border-ink/10 shadow-xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] group-hover:border-blue-500/50 transition-all duration-500">
            <Network className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 group-hover:text-blue-600 transition-colors duration-500 whitespace-nowrap leading-tight">
            <span className="inline-block word-stagger delay-100">Réseaux</span> &<br/>
            <span className="inline-block word-stagger delay-200">Télécoms</span>
          </h2>
          
          <p className="text-graphite-muted text-sm md:text-base max-w-xs mb-8 font-medium">
            Infrastructures d'entreprise, téléphonie VoIP et ingénierie de la fiabilité.
          </p>

          <div className="inline-flex items-center gap-3 text-blue-600 font-bold uppercase tracking-wider text-xs md:text-sm">
            <span className="relative">
              Explorer le pôle
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-600 group-hover:w-full transition-all duration-500 ease-out"></span>
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
          </div>

          <div className="absolute top-10 right-0 opacity-0 group-hover:opacity-20 transition-all duration-700 -translate-y-4 group-hover:translate-y-0 hidden md:block pointer-events-none">
            <Server className="w-24 h-24 text-blue-600" />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* RIGHT PANE: DEV & IA (Dark Theme: Ink/Orange)                */}
      {/* ----------------------------------------------------------- */}
      <div 
        className={`relative group h-1/2 md:h-full flex flex-col justify-center items-center overflow-hidden cursor-pointer
          bg-[#131315] text-snow
          ${isDragging ? 'transition-none' : 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]'}
          ${transitionState === 'network' ? 'opacity-0' : 'opacity-100'}
        `}
        style={{ width: window.innerWidth >= 768 ? `${100 - sliderPosition}%` : '100%' }}
        onClick={(e) => handleSelect('dev', '/dev-ia', e)}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] transition-opacity duration-700 opacity-30 group-hover:opacity-100" />
        
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#E8634A]/20 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000 ease-out" />
        
        {/* Content Wrapper (Centered) */}
        <div className={`relative z-10 p-8 w-full max-w-lg flex flex-col items-center text-center transform ${sliderPosition < 45 ? 'scale-105' : 'scale-100'} group-hover:-translate-y-2 transition-all duration-700 ease-out`}>
          
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(232,99,74,0.3)] group-hover:border-[#E8634A]/50 transition-all duration-500">
            <Code2 className="w-8 h-8 text-[#E8634A]" />
          </div>

          <h2 className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 group-hover:text-[#E8634A] transition-colors duration-500 whitespace-nowrap leading-tight">
            <span className="inline-block word-stagger delay-300">Développement</span><br/>
            <span className="inline-block word-stagger delay-400">Web</span> &{" "}
            <span className="inline-block word-stagger delay-500">IA</span>
          </h2>
          
          <p className="text-snow/60 text-sm md:text-base max-w-xs mb-8 font-medium">
            Applications sur-mesure, automatisation SaaS et architectures vocales intelligentes.
          </p>

          <div className="inline-flex items-center gap-3 text-[#E8634A] font-bold uppercase tracking-wider text-xs md:text-sm">
            <span className="relative scramble-hover">
              Explorer le pôle
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E8634A] group-hover:w-full transition-all duration-500 ease-out"></span>
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
          </div>

          <div className="absolute top-10 left-0 opacity-0 group-hover:opacity-20 transition-all duration-700 -translate-y-4 group-hover:translate-y-0 hidden md:block pointer-events-none">
            <Cpu className="w-24 h-24 text-[#E8634A]" />
          </div>
        </div>
      </div>
    </div>
  );
}
