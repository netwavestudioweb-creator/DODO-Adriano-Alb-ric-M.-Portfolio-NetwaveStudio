import React from 'react';
import skillsData from '../data/skills.json';
import { Network, Code2, Bot, Server, CheckCircle2, Layers } from 'lucide-react';

const categoryIcons = [Network, Code2, Bot, Server];

export default function Skills({ track }) {
  const { mastery, categories } = skillsData;

  const filteredMastery = track ? mastery.filter(m => m.track.includes(track)) : mastery;
  const filteredCategories = track ? categories.filter(c => c.track.includes(track)) : categories;

  // SVG Circular progress constants
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <section id="skills" className="py-16 md:py-24 lg:py-28 bg-ink text-snow relative overflow-hidden">
      {/* Ambient background glow & Neural Grid for Dev */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
      {track === 'dev' && (
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        
        {/* Section Header (Horizontal layout: Title left, Subtitle right on same line) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-2.5">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Piliers de Compétences
            </div>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-snow tracking-tight whitespace-nowrap">
              Grille de Maîtrise<span className="text-coral">.</span>
            </h2>
          </div>
          <p className="text-snow/70 max-w-md text-xs sm:text-sm md:text-base font-normal leading-relaxed">
            {track === 'dev'
              ? "Une expertise pointue en développement web moderne, architecture logicielle et intégration d'intelligence artificielle."
              : track === 'network'
              ? "Une expertise complète en infrastructures réseaux, téléphonie VoIP, routage et sécurité des systèmes."
              : "Des compétences avancées alliant développement web moderne, intelligence artificielle et infrastructures fiables."}
          </p>
        </div>

        {/* 1. Mastery Cards (4 Cards Aligned Horizontally on desktop, 2x2 on mobile/tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 md:mb-16">
          {filteredMastery.map((item, idx) => {
            const strokeDashoffset = circumference - (item.percentage / 100) * circumference;

            return (
              <div
                key={idx}
                className="card-premium bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-6 text-center flex flex-col items-center justify-between backdrop-blur-md hover:border-coral/50 shadow-card h-full"
              >
                {/* Top tag */}
                <span className="mono-label text-[10px] uppercase tracking-wider text-coral bg-coral/10 px-3 py-0.5 rounded-full mb-3">
                  {item.tag}
                </span>

                {/* Animated SVG Ring */}
                <div className="relative w-24 h-24 my-2 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
                    {/* Background Track */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="text-white/10"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Active Progress Ring */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="text-coral transition-all duration-1000 ease-out"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>

                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="mono-label font-extrabold text-xl text-snow">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Name & Summary */}
                <div className="flex-1 flex flex-col justify-between mt-2">
                  <h3 className="font-sans font-bold text-base text-snow mb-1.5 min-h-[2.5rem] flex items-center justify-center">
                    {item.name}
                  </h3>
                  <p className="text-xs text-snow/70 leading-relaxed font-normal">
                    {item.summary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Detailed Categories (4 Columns on Same Line) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          {filteredCategories.map((cat, idx) => {
            const Icon = categoryIcons[idx] || Layers;
            return (
              <div
                key={idx}
                className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.05] hover:border-coral/30 transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center gap-2.5 border-b border-white/10 pb-3 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-white/[0.06] flex items-center justify-center text-coral shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="font-sans font-bold text-xs sm:text-sm text-snow line-clamp-1">
                      {cat.title}
                    </h4>
                  </div>

                  <ul className="space-y-2.5">
                    {cat.skills.map((skill, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-snow/80 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-coral flex-shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

          {/* Seniority Markers (Dev Only) */}
          {track === 'dev' && (
            <div className="mt-12 bg-coral/5 border border-coral/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-coral/10 flex items-center justify-center text-coral shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-lg text-snow mb-2">
                  Pratiques d'Ingénierie & Qualité
                </h4>
                <p className="text-sm text-snow/70 leading-relaxed font-normal mb-4">
                  L'excellence technique ne se limite pas au code qui fonctionne, mais au code qui dure, qui se déploie sereinement et qui évolue.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {['Intégration & Déploiement Continus (CI/CD)', 'GitFlow & Versioning', 'Tests Automatisés', 'Revue de Code rigoureuse'].map((practice, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono text-snow/80">
                      <CheckCircle2 className="w-3 h-3 text-coral" />
                      {practice}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

      </div>
    </section>
  );
}
