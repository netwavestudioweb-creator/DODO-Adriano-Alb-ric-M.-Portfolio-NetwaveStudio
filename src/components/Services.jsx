import React, { useState } from 'react';
import servicesData from '../data/services.json';
import { Network, Code2, Bot, Workflow, Server, Palette, ArrowRight, ChevronUp, CheckCircle2, Sparkles } from 'lucide-react';

const iconMap = {
  Network: Network,
  Code2: Code2,
  Bot: Bot,
  Workflow: Workflow,
  Server: Server,
  Palette: Palette,
};

export default function Services({ track }) {
  const [expanded, setExpanded] = useState({});

  const filteredServices = track ? servicesData.filter(s => s.track.includes(track)) : servicesData;

  const toggleService = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-ink text-snow relative overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Champs d'Intervention
            </div>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight text-snow">
              Services & Solutions<span className="text-coral">.</span>
            </h2>
          </div>
          <p className="text-snow/70 max-w-md text-sm md:text-base font-normal leading-relaxed">
            {track === 'dev'
              ? "Des plateformes web performantes, des architectures logicielles scalables et des agents vocaux IA sur-mesure."
              : track === 'network'
              ? "Des infrastructures réseau robustes, des liaisons sécurisées et des solutions de téléphonie VoIP haute disponibilité."
              : "Des infrastructures réseau robustes, des plateformes web optimisées et des pipelines vocaux IA adaptés au terrain."}
          </p>
        </div>

        {/* Services Grid (4 Pillars aligned horizontally) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {filteredServices.map((srv, idx) => {
            const Icon = iconMap[srv.icon] || Network;
            const isExpanded = !!expanded[srv.id];
            const numLabel = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={srv.id || idx}
                className="card-premium group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-coral/40 rounded-[2.5rem] p-6 md:p-7 flex flex-col justify-between backdrop-blur-sm transition-all duration-300 shadow-card h-full"
              >
                <div className="flex-1 flex flex-col">
                  {/* Top Bar: Icon + Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-coral group-hover:bg-coral group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="mono-label text-xs text-white/30 font-medium">
                      {numLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-sans font-bold text-lg text-snow mb-3 group-hover:text-coral transition-colors min-h-[3.5rem] flex items-center">
                    {srv.title}
                  </h3>

                  {/* Accessible non-technical description */}
                  <p className="text-xs text-snow/70 leading-relaxed font-normal mb-6 flex-1">
                    {srv.description}
                  </p>

                  {/* Expandable Technical Detail Panel */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
                      {/* What's included */}
                      <div className="text-xs text-snow/90 leading-relaxed bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                        <strong className="text-coral block mono-label text-[10px] uppercase tracking-wider mb-1">
                          Inclus dans la prestation :
                        </strong>
                        <p>{srv.included}</p>
                      </div>

                      {/* Tech Stack Pills */}
                      <div>
                        <span className="mono-label text-[10px] uppercase text-white/50 block mb-2">
                          Technologies :
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {srv.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="mono-label text-[9px] bg-white/[0.06] border border-white/10 text-coral-soft px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Concrete Proof / Case Study */}
                      <div className="p-3 rounded-2xl bg-coral/10 border border-coral/20 text-xs text-coral-soft">
                        <p className="leading-relaxed">
                          <strong className="text-white block font-semibold mb-0.5">Preuve terrain :</strong>
                          {srv.proof}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive Toggle Button */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => toggleService(srv.id)}
                    className="inline-flex items-center gap-1.5 text-xs mono-label uppercase tracking-wider font-semibold text-coral hover:text-white transition-colors cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Réduire' : 'Détails'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                  <span className="mono-label text-[10px] text-white/30">{numLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
