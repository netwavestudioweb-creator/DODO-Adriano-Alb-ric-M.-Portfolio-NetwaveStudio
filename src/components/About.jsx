import React from 'react';
import { Network, Bot, Globe, Shield, Award, BookOpen, Languages, Sparkles } from 'lucide-react';

export default function About() {
  const experiences = [
    {
      role: 'Fondateur & Lead Tech',
      company: 'NetWave Studio',
      period: '2023 – Présent',
      location: 'Freelance (Fiverr, Upwork & Direct)',
      description:
        "Conception de sites web, d'applications sur-mesure et de solutions réseaux pour PME locales et internationales. Architectures d'automatisation et outils numériques adaptés aux besoins de chaque client.",
      stack: ['Lovable', 'React/TS', 'n8n', 'Asterisk ARI', 'PostgreSQL', 'Docker', 'Redis'],
    },
    {
      role: 'Assistant Chef de Projet Réseaux',
      company: 'SOBAPS — Ministère de la Santé du Bénin',
      period: '2023',
      location: 'Cotonou, Bénin',
      description:
        'Maintenance préventive et curative des réseaux de surveillance, diagnostic et résolution d’incidents critiques, amélioration de la disponibilité des équipements et application des procédures de sécurité réseau.',
      stack: ['Supervision LAN/WAN', 'Sécurité Réseau', 'Maintenance Systèmes', 'Reporting'],
    },
    {
      role: 'Stagiaire Réseaux Télécoms / Fibre Optique',
      company: 'Premium Company Bénin',
      period: '2022 – 2023',
      location: 'Cotonou, Bénin',
      description:
        'Raccordement d’abonnés en fibre optique, installation et configuration d’équipements d’accès réseau, tests de réflectométrie et validation de la conformité aux normes de qualité.',
      stack: ['Fibre Optique', 'Soudure Optique', 'Configuration Routeurs', 'Normes Télécoms'],
    },
  ];

  const education = [
    {
      degree: 'Licence Pro Réseaux Informatiques & Télécoms',
      school: 'UATM GASA Formation, Cotonou',
      year: 'Diplômé — UATM GASA',
      badge: 'Diplômé',
    },
    {
      degree: 'Certification Cisco Networking',
      school: 'Cisco Networking Academy',
      year: 'Certifié',
      badge: 'Cisco',
    },
  ];

  const languages = [
    { name: 'Français', level: 'Courant / Professionnel', pct: '100%' },
    { name: 'Fon', level: 'Langue maternelle', pct: '100%' },
    { name: 'Mina', level: 'Courant', pct: '100%' },
    { name: 'Anglais', level: 'Technique & Basique', pct: '60%' },
  ];

  return (
    <section id="about" className="py-24 md:py-32 bg-snow relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-coral inline-block" />
            Profil & Trajectoire
          </div>
          <h2 className="font-sans font-extrabold text-4xl md:text-5xl lg:text-6xl text-ink tracking-tight">
            Deux mondes<span className="text-coral">,</span> une même rigueur<span className="text-coral">.</span>
          </h2>
        </div>

        {/* Two Columns Grid with Vertical Accent Line */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Core Narrative with Accent Border */}
          <div className="lg:col-span-5 relative lg:pr-8">
            <div className="hidden lg:block absolute top-2 right-0 bottom-2 w-0.5 bg-gradient-to-b from-coral via-coral/40 to-transparent" />
            
            <h3 className="serif-italic text-3xl md:text-4xl text-ink font-normal leading-snug mb-6">
              "L'infrastructure solide est le socle invisible de toute innovation."
            </h3>

            <div className="space-y-4 text-graphite text-base md:text-lg leading-relaxed font-normal">
              <p>
                Diplômé d'une Licence Professionnelle Réseaux Informatiques et Télécommunications (<strong className="text-ink font-semibold">UATM GASA Formation</strong>) et certifié <strong className="text-ink font-semibold">Cisco Networking</strong>, je navigue entre deux mondes : l'infrastructure réseau et télécoms d'un côté, le développement et l'intelligence artificielle appliquée de l'autre.
              </p>
              <p>
                À travers <strong className="text-coral font-semibold">NetWave Studio</strong>, mon studio freelance, je conçois des sites web, des applications, des solutions réseaux et des outils d'automatisation pour des PME et institutions ouest-africaines.
              </p>
            </div>

            {/* Language Badges */}
            <div className="mt-8 pt-6 border-t border-ink/10">
              <p className="mono-label text-xs uppercase tracking-wider text-graphite-muted mb-3 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-coral" />
                Langues maîtrisées
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-snow-2 border border-ink/10 rounded-full px-3 py-1 text-xs mono-label text-ink"
                  >
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-graphite-muted text-[10px]">({lang.level})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Experience Timeline & Education */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Experience Cards */}
            <div>
              <h4 className="mono-label text-xs uppercase tracking-widest text-graphite-muted mb-6 flex items-center gap-2">
                <Network className="w-4 h-4 text-coral" />
                Parcours Professionnel
              </h4>

              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="card-premium bg-snow-2/70 hover:bg-snow-2 border border-ink/10 rounded-[2rem] p-6 md:p-8 shadow-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h5 className="font-sans font-bold text-lg md:text-xl text-ink">
                          {exp.role}
                        </h5>
                        <p className="text-coral font-medium text-sm">
                          {exp.company}
                        </p>
                      </div>
                      <span className="mono-label text-xs px-3 py-1 rounded-full bg-white border border-ink/10 text-graphite font-medium">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm text-graphite leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-ink/5">
                      {exp.stack.map((tech, i) => (
                        <span
                          key={i}
                          className="mono-label text-[11px] bg-white/80 border border-ink/5 px-2.5 py-0.5 rounded-full text-graphite-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div>
              <h4 className="mono-label text-xs uppercase tracking-widest text-graphite-muted mb-6 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-coral" />
                Formation & Diplômes
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm hover:border-coral/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="mono-label text-[11px] text-coral font-medium">
                          {edu.year}
                        </span>
                        <span className="mono-label text-[10px] uppercase tracking-wider bg-coral-soft/50 text-ink px-2 py-0.5 rounded-full">
                          {edu.badge}
                        </span>
                      </div>
                      <h6 className="font-sans font-bold text-sm text-ink leading-snug mb-1">
                        {edu.degree}
                      </h6>
                    </div>
                    <p className="text-xs text-graphite-muted mt-2">
                      {edu.school}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
