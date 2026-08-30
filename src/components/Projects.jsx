import React, { useState, useEffect } from 'react';
import projectsData from '../data/projects.json';
import { ArrowUpRight, ExternalLink, Activity, Sparkles, Layers, Info, Volume2, ShieldCheck, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

function ProjectCard({ proj, isBentoHero }) {
  const images = proj.images && proj.images.length > 0 ? proj.images : [proj.image];
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentImgIdx((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <article
      className={`card-premium group bg-white border border-ink/10 rounded-[2.5rem] overflow-hidden flex shadow-card hover:border-coral/40 hover:shadow-coral/5 transition-all ${
        isBentoHero ? 'flex-col lg:flex-row lg:col-span-2' : 'flex-col'
      }`}
    >
      {/* Visual Image Preview */}
      <div
        className={`relative overflow-hidden bg-ink/5 flex-shrink-0 ${isBentoHero ? 'lg:w-[50%] aspect-[16/10] lg:aspect-auto' : 'w-full aspect-[16/10]'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((imgSrc, i) => (
          <img
            key={i}
            src={imgSrc}
            alt={`${proj.name} - aperçu ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
              i === currentImgIdx ? 'opacity-100 z-0 scale-100' : 'opacity-0 pointer-events-none scale-95'
            }`}
            loading="lazy"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Category Pill Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="mono-label text-[11px] font-semibold bg-ink/80 backdrop-blur-md text-snow px-3 py-1 rounded-full border border-white/10">
            {proj.category}
          </span>
        </div>

        {/* Year Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <span className="mono-label text-[11px] bg-white/90 backdrop-blur-md text-ink px-2.5 py-1 rounded-full font-medium shadow-sm">
            {proj.year}
          </span>
        </div>

        {/* Multi-Image Controls when multiple images are present */}
        {images.length > 1 && (
          <>
            {/* Arrows */}
            <button
              type="button"
              onClick={prevImage}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-ink/70 hover:bg-coral text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md hover:scale-110"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-ink/70 hover:bg-coral text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md hover:scale-110"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-ink/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
              {images.map((_, dotIdx) => (
                <button
                  type="button"
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImgIdx(dotIdx);
                  }}
                  aria-label={`Afficher l'image ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    dotIdx === currentImgIdx ? 'bg-coral w-4' : 'bg-white/50 hover:bg-white w-1.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content Details Container */}
      <div className={`flex flex-col justify-between ${isBentoHero ? 'lg:w-[50%]' : 'w-full'}`}>
        {/* Content Top */}
        <div className={`p-6 ${isBentoHero ? 'md:p-8 lg:p-10' : 'md:p-7'}`}>
          
          {/* Metric & Audio Demo Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {proj.metrics && (
              <div className="inline-flex items-center gap-1.5 mono-label text-[11px] text-coral bg-coral-soft/40 px-2.5 py-0.5 rounded-full">
                <Activity className="w-3 h-3" />
                <span>{proj.metrics}</span>
              </div>
            )}
            {proj.hasAudioDemo && (
              <div className="inline-flex items-center gap-1.5 mono-label text-[11px] text-emerald-700 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <Volume2 className="w-3 h-3 text-emerald-600" />
                <span>Démo vocale temps réel</span>
              </div>
            )}
          </div>

          <h3 className="font-sans font-bold text-xl text-ink group-hover:text-coral transition-colors mb-2">
            {proj.name}
          </h3>

          <p className="text-xs md:text-sm text-graphite-muted line-clamp-2 leading-relaxed mb-4">
            {proj.tagline}
          </p>

          <p className="text-xs text-graphite leading-relaxed mb-4 bg-snow-2/60 p-3 rounded-2xl border border-ink/5">
            {proj.description}
          </p>

          {/* In-depth Technical Challenge & Engineering Solution Block */}
          {proj.challenge && proj.solution && (
            <div className="mb-4 bg-coral/5 border border-coral/15 rounded-2xl p-3.5 space-y-2 text-xs">
              <div>
                <span className="mono-label text-[10px] uppercase font-bold text-coral block mb-0.5 tracking-wider">
                  Défi technique rencontré :
                </span>
                <p className="text-graphite leading-relaxed">{proj.challenge}</p>
              </div>
              <div className="pt-1.5 border-t border-coral/10">
                <span className="mono-label text-[10px] uppercase font-bold text-ink block mb-0.5 tracking-wider">
                  Solution d'ingénierie :
                </span>
                <p className="text-graphite-muted leading-relaxed">{proj.solution}</p>
              </div>
            </div>
          )}

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5">
            {proj.stack.map((tech, i) => (
              <span
                key={i}
                className="mono-label text-[10px] bg-snow-2 border border-ink/5 px-2 py-0.5 rounded-md text-graphite-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer Link */}
        <div className="px-6 pb-6 pt-2 border-t border-ink/5 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 w-full">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-coral transition-colors group/btn mr-1"
            >
              <span>Échanger sur ce projet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-coral transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
            
            {proj.liveUrl && (
              <a
                href={proj.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-coral hover:text-white bg-coral-soft/50 hover:bg-coral transition-all px-2.5 py-1 rounded-md border border-coral/30 shadow-xs"
              >
                <ExternalLink className="w-3 h-3" />
                Démo live
              </a>
            )}

            {proj.githubUrl && (
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-graphite-muted hover:text-ink hover:border-ink/20 transition-colors bg-snow-2 px-2.5 py-1 rounded-md border border-ink/10"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Code source
              </a>
            )}

            {proj.caseStudyUrl && (
              <a
                href={proj.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-graphite-muted hover:text-ink hover:border-ink/20 transition-colors bg-snow-2 px-2.5 py-1 rounded-md border border-ink/10"
              >
                <FileText className="w-3 h-3" />
                Étude de cas
              </a>
            )}

            {!proj.githubUrl && !proj.liveUrl && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-graphite-muted/70 bg-snow-2/60 px-2.5 py-1 rounded-md border border-ink/5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-graphite-muted/40" />
                Code source à venir
              </span>
            )}
          </div>
          <span className="hidden md:inline-block mono-label text-[10px] text-coral font-semibold shrink-0">Réalisation Adriano Dodo</span>
        </div>
      </div>
    </article>
  );
}

export default function Projects({ track }) {
  const filteredProjects = track ? projectsData.filter(p => p.track.includes(track)) : projectsData;

  return (
    <section id="projects" className="py-24 md:py-32 bg-snow-2 relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Réalisations Marquantes
            </div>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl text-ink tracking-tight">
              Projets Sélectionnés<span className="text-coral">.</span>
            </h2>
          </div>
          <p className="text-graphite-muted max-w-md text-sm md:text-base font-normal leading-relaxed">
            {track === 'dev'
              ? "Cas d'usage réels combinant architectures logicielles scalables, agents vocaux IA et interfaces web réactives."
              : track === 'network'
              ? "Cas d'usage réels en déploiement d'infrastructures physiques, liaisons sécurisées et téléphonie VoIP."
              : "Cas d'usage réels combinant optimisation réseau, architectures vocales IA et interfaces web réactives."}
          </p>
        </div>

        {/* Projects Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${track === 'dev' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
          {filteredProjects.map((proj, idx) => {
            const isBentoHero = track === 'dev' && idx === 0;
            return <ProjectCard key={proj.id} proj={proj} isBentoHero={isBentoHero} />;
          })}
        </div>
      </div>
    </section>
  );
}

