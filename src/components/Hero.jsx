import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDown, Sparkles, MapPin, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Hero({ track }) {
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
      <div className={`absolute top-1/4 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none ${track === 'dev' ? 'bg-coral/25' : 'bg-coral/15'}`} />
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
          <h1 className="hero-title-main font-sans font-extrabold text-3xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1] mb-4">
            ADRIANO DODO<span className="text-coral">.</span>
            <span className="block text-xl sm:text-2xl md:text-3xl font-medium tracking-normal text-snow/90 mt-2">
              {track === 'network' 
                ? <><span className="text-coral">Technicien Réseaux & Télécoms</span> | Infrastructure & VoIP</>
                : <><span className="text-coral">Développeur Full-Stack IA</span> | Architecte Logiciel & Automatisation<span className="inline-block w-[0.4em] h-[1em] ml-1.5 bg-coral animate-pulse align-text-bottom"></span></>
              }
            </span>
          </h1>

          {/* Dramatic Serif Accent - Tagline */}
          <p className="hero-serif serif-italic text-xl sm:text-2xl md:text-3xl text-coral-soft/90 max-w-xl font-normal leading-tight mb-4">
            {track === 'network'
              ? "Je conçois des infrastructures réseaux solides, sécurisées et des systèmes de téléphonie haute disponibilité."
              : "Je conçois des applications web réactives, des architectures logicielles scalables et des agents conversationnels intelligents."
            }
          </p>

          {/* Subtitle / Identity */}
          <p className="hero-title-main text-sm sm:text-base text-snow/70 max-w-xl mb-8 font-normal leading-relaxed">
            {track === 'network' ? (
              <>
                <strong className="text-snow font-semibold">DODO Albéric Mantey Adriano</strong> — je conçois des architectures solides et des infrastructures haute performance, du terrain jusqu'au cloud.
              </>
            ) : (
              <>
                <strong className="text-snow font-semibold">DODO Albéric Mantey Adriano</strong> — Développeur Full-Stack & Concepteur de solutions IA. Je bâtis des applications web modernes, des pipelines de données et des automatisations intelligentes orientées résultats.
              </>
            )}
          </p>

          {/* Monospace Stats Strip */}
          <div className="hero-stats flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 mono-label text-xs sm:text-sm text-snow/75 mb-10 pb-6 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-coral" />
              <span>Depuis 2022 · 3+ ans</span>
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
            {/* Primary Action */}
            <a
              href="#contact"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-snow font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                track === 'network'
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                  : 'bg-coral hover:bg-coral-hover shadow-coral/20'
              }`}
            >
              Démarrer un projet
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Secondary Action (GitHub for Dev & Network) */}
            <a
              href="https://github.com/dodi-ad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-snow font-bold text-sm tracking-wide bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              {track === 'network' ? 'Profil GitHub' : 'Voir mon code'}
            </a>
          </div>

          {/* ATS Stack Banner (Terminal Style) */}
          <div className="mt-12 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="inline-block bg-[#0f1115]/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur-xl shadow-2xl hover:border-coral/30 transition-colors">
              {/* Terminal Header */}
              <div className="bg-white/5 border-b border-white/5 px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="mx-auto mono-label text-[9px] text-snow/40 uppercase tracking-widest pl-2">
                  {track === 'network' ? 'network.infra.json' : 'stack.config.json'}
                </span>
              </div>
              {/* Terminal Body */}
              <div className="p-4 sm:p-5 flex flex-wrap gap-2 max-w-lg">
                {(track === 'network'
                  ? ['Cisco (VLANs / OSPF)', 'Asterisk (PJSIP / ARI)', 'WireGuard / VPN', 'pfSense / iptables', 'Linux Debian', 'Zabbix / Grafana', 'Proxmox', 'Wireshark', 'Docker', 'Bash Scripting']
                  : ['React', 'TypeScript', 'Node.js', 'Python', 'n8n', 'LLMs / RAG', 'ASR / TTS', 'PostgreSQL', 'Docker', 'REST API']
                ).map((tech) => (
                  <span key={tech} className="px-2.5 py-1 bg-coral/10 border border-coral/20 rounded text-[11px] font-mono text-coral-soft">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
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
                  {track === 'network' ? 'Réseaux · Télécoms · Sécurité · VoIP' : 'React · Web · Python · IA Vocale'}
                </p>
                <p className="font-sans font-bold text-base text-snow">
                  DODO Albéric Mantey Adriano
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
