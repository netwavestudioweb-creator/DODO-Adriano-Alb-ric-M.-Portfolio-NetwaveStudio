import React, { useState } from 'react';
import processData from '../data/process.json';
import { Compass, Cpu, Code2, Rocket, Network, ShieldCheck, Activity, Radio, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

const trackIcons = {
  web_ia: [Compass, Cpu, Code2, Rocket],
  telecom: [Activity, Radio, Network, ShieldCheck],
};

export default function Process({ track }) {
  const defaultTrack = track === 'network' ? 'telecom' : 'web_ia';
  const [activeTrack, setActiveTrack] = useState(defaultTrack);
  const effectiveTrack = track ? defaultTrack : activeTrack;
  const currentData = processData[effectiveTrack];
  const icons = trackIcons[effectiveTrack];

  return (
    <section id="process" className="py-24 md:py-32 bg-snow relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header (Horizontal layout) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Méthodologie de Travail
            </div>
            <h2 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl text-ink tracking-tight">
              Processus en 4 Étapes<span className="text-coral">.</span>
            </h2>
          </div>
          <p className="text-graphite-muted max-w-md text-sm md:text-base font-normal leading-relaxed">
            {track === 'dev'
              ? "Une approche méthodique et itérative pour concevoir, développer et déployer des applications web et solutions IA performantes."
              : track === 'network'
              ? "Une approche méthodique et rigoureuse pour auditer, concevoir, déployer et sécuriser vos infrastructures réseaux."
              : "Une approche méthodique adaptée aux spécificités du logiciel et de l'infrastructure physique."}
          </p>
        </div>

        {/* Interactive Segmented Switch (Uniquement affiché si aucun track spécifique n'est actif) */}
        {!track && (
          <div className="flex justify-center mb-12">
            <div className="relative inline-flex p-1.5 bg-snow-2 border border-ink/10 rounded-full shadow-inner max-w-md w-full">
              <button
                onClick={() => setActiveTrack('web_ia')}
                className={`relative z-10 flex-1 py-3 px-6 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTrack === 'web_ia'
                    ? 'bg-coral text-white shadow-coral-glow'
                    : 'text-graphite hover:text-ink'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Piste Web & IA</span>
              </button>

              <button
                onClick={() => setActiveTrack('telecom')}
                className={`relative z-10 flex-1 py-3 px-6 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTrack === 'telecom'
                    ? 'bg-coral text-white shadow-coral-glow'
                    : 'text-graphite hover:text-ink'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>Réseaux & Télécoms</span>
              </button>
            </div>
          </div>
        )}

        {/* Track Subtitle Info Bar */}
        <div className="text-center max-w-xl mx-auto mb-10 text-xs sm:text-sm mono-label text-graphite-muted bg-white/70 border border-ink/5 py-2.5 px-6 rounded-full shadow-sm">
          <span>{currentData.subtitle}</span>
        </div>

        {/* 4 Steps Animated Grid */}
        <div
          key={effectiveTrack}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative animate-fadeIn"
        >
          {currentData.steps.map((item, idx) => {
            const Icon = icons[idx] || Compass;
            return (
              <div
                key={item.step || idx}
                className="card-premium relative bg-white border border-ink/10 rounded-[2.5rem] p-7 md:p-8 flex flex-col justify-between shadow-card hover:border-coral/40 transition-all"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="mono-label text-3xl font-extrabold text-coral/80">
                      {item.step}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-snow-2 border border-ink/5 flex items-center justify-center text-ink shadow-sm">
                      <Icon className="w-5 h-5 text-coral" />
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="inline-block mono-label text-[10px] uppercase tracking-wider text-coral font-medium bg-coral-soft/40 px-2.5 py-0.5 rounded-full mb-3">
                    {item.badge}
                  </span>

                  <h3 className="font-sans font-bold text-lg text-ink mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-graphite leading-relaxed font-normal">
                    {item.summary}
                  </p>
                </div>

                {/* Bottom line marker */}
                <div className="mt-8 pt-4 border-t border-ink/5 flex items-center justify-between">
                  <span className="mono-label text-[11px] uppercase tracking-wider text-graphite-muted flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block" />
                    Étape {idx + 1}/4
                  </span>
                  <span className="mono-label text-[10px] text-graphite-muted opacity-60">
                    {effectiveTrack === 'web_ia' ? 'Code & IA' : 'Infra & Télécoms'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
