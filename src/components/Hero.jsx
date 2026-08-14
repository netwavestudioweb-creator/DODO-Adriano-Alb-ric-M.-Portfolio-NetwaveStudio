import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, Sparkles, MapPin, Layers, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
      })
      .from('.hero-title-main', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      }, '-=0.4')
      .from('.hero-serif', {
        y: 20,
        opacity: 0,
        duration: 0.9,
      }, '-=0.6')
      .from('.hero-photo', {
        scale: 0.92,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
      }, '-=0.8')
      .from('.hero-stats', {
        y: 20,
        opacity: 0,
        duration: 0.8,
      }, '-=0.5')
      .from('.hero-ctas', {
        y: 20,
        opacity: 0,
        duration: 0.8,
      }, '-=0.4');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen bg-ink text-snow flex flex-col justify-between pt-28 md:pt-36 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Architectural Ambient Light */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-coral/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full my-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Left Column: Typography & Narrative */}
        <div className="flex-1 text-center lg:text-left">
          
          {/* Availability Badge */}
          <div className="hero-badge inline-flex items-center gap-2.5 bg-white/[0.06] border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-indicator inline-block" />
            <span className="mono-label text-xs tracking-wider uppercase text-snow/90">
              Disponible pour de nouveaux projets
            </span>
          </div>

          {/* Main Hero Title */}
          <h1 className="hero-title-main font-sans font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-4">
            DODI<span className="text-coral">.</span>
          </h1>

          {/* Dramatic Serif Accent - Tagline */}
          <p className="hero-serif serif-italic text-2xl sm:text-3xl md:text-4xl text-coral-soft/90 max-w-xl font-normal leading-tight mb-4">
            Je connecte les réseaux d'aujourd'hui aux intelligences de demain.
          </p>

          {/* Subtitle / Identity */}
          <p className="hero-title-main text-sm sm:text-base text-snow/70 max-w-lg mb-8 font-normal leading-relaxed">
            <strong className="text-snow font-semibold">DODO Albéric Mantey Adriano</strong> — je conçois des solutions qui tiennent la route, du terrain jusqu'au cloud. Fondateur de <span className="text-snow font-semibold">NetWave Studio</span>, où j'accompagne PME et institutions ouest-africaines dans leur transformation digitale.
          </p>

          {/* Monospace Stats Strip */}
          <div className="hero-stats flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 mono-label text-xs sm:text-sm text-snow/75 mb-10 pb-6 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-coral" />
              <span>5+ ans d'expérience</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
              <span>10+ projets livrés</span>
            </div>
            <span className="text-white/30">·</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-coral" />
              <span>Cotonou, Bénin</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-ctas flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#contact"
              className="btn-magnetic inline-flex items-center justify-center bg-coral hover:bg-coral-hover text-snow font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-coral-glow"
            >
              Me contacter
            </a>
            <a
              href="#projects"
              className="btn-magnetic inline-flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 text-snow font-medium text-sm sm:text-base px-7 py-3.5 rounded-full"
            >
              Voir mes projets
            </a>
          </div>
        </div>

        {/* Right Column: High-End Visual Card */}
        <div className="hero-photo relative flex-shrink-0 w-72 sm:w-80 lg:w-96">
          <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-white/15 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4] w-full">
              <img
                src="/photos/dodi_portrait_clean.jpg"
                alt="Portrait de DODI - Dodo Albéric Mantey Adriano"
                className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <p className="mono-label text-[11px] uppercase tracking-widest text-coral font-medium">
                  Fondateur & Lead Tech
                </p>
                <p className="font-sans font-bold text-base text-snow">
                  NetWave Studio
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 text-center mt-6">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-snow/50 hover:text-coral transition-colors mono-label text-xs tracking-widest uppercase"
          aria-label="Faire défiler vers la section À propos"
        >
          <span>Découvrir l'architecture</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
