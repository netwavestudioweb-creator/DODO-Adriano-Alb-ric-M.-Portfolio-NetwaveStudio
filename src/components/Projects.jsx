import React, { useState } from 'react';
import projectsData from '../data/projects.json';
import { ArrowUpRight, ExternalLink, Activity, Sparkles, Layers, Info } from 'lucide-react';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

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
            Cas d'usage réels combinant optimisation réseau, architectures vocales IA et interfaces web réactives.
          </p>
        </div>

        {/* Projects Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((proj) => (
            <article
              key={proj.id}
              className="card-premium group bg-white border border-ink/10 rounded-[2.5rem] overflow-hidden flex flex-col justify-between shadow-card hover:border-coral/40"
            >
              <div>
                {/* Visual Image Preview */}
                <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Category Pill Top Left */}
                  <div className="absolute top-4 left-4">
                    <span className="mono-label text-[11px] font-semibold bg-ink/80 backdrop-blur-md text-snow px-3 py-1 rounded-full border border-white/10">
                      {proj.category}
                    </span>
                  </div>

                  {/* Year Top Right */}
                  <div className="absolute top-4 right-4">
                    <span className="mono-label text-[11px] bg-white/90 backdrop-blur-md text-ink px-2.5 py-1 rounded-full font-medium shadow-sm">
                      {proj.year}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 md:p-7">
                  
                  {/* Key Metric Badge */}
                  {proj.metrics && (
                    <div className="inline-flex items-center gap-1.5 mono-label text-[11px] text-coral bg-coral-soft/40 px-2.5 py-0.5 rounded-full mb-3">
                      <Activity className="w-3 h-3" />
                      <span>{proj.metrics}</span>
                    </div>
                  )}

                  <h3 className="font-sans font-bold text-xl text-ink group-hover:text-coral transition-colors mb-2">
                    {proj.name}
                  </h3>

                  <p className="text-xs md:text-sm text-graphite-muted line-clamp-2 leading-relaxed mb-4">
                    {proj.tagline}
                  </p>

                  <p className="text-xs text-graphite leading-relaxed mb-5 bg-snow-2/60 p-3 rounded-2xl border border-ink/5">
                    {proj.description}
                  </p>

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
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2 border-t border-ink/5 flex items-center justify-between">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-coral transition-colors group/btn"
                >
                  <span>Échanger sur ce projet</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-coral transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
                <span className="mono-label text-[10px] text-graphite-muted">NetWave</span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
