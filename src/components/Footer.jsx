import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink text-snow/70 border-t border-white/10 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-sans font-extrabold text-2xl text-snow tracking-tight">
            DODI<span className="text-coral">.</span>
          </span>
          <span className="hidden sm:inline-block text-white/20">|</span>
          <p className="text-xs text-snow/70">
            Technicien Réseaux & Télécoms · Développeur Web & Architecte IA
          </p>
          <span className="hidden md:inline-block text-white/20">|</span>
          <a
            href="mailto:netwave.studio.web@gmail.com"
            className="mono-label text-xs text-snow/40 hover:text-coral transition-colors"
          >
            Fondateur de NetWave Studio →
          </a>
        </div>

        {/* Right: Copyright & Back to top button */}
        <div className="flex items-center gap-6">
          <p className="text-xs mono-label text-snow/40 text-center md:text-right">
            © {new Date().getFullYear()} DODO Albéric Mantey Adriano. Tous droits réservés.
          </p>

          <button
            onClick={scrollToTop}
            className="btn-magnetic flex-shrink-0 flex items-center gap-1.5 text-xs mono-label uppercase text-snow/60 hover:text-coral transition-colors p-2 rounded-full hover:bg-white/5"
            aria-label="Retour en haut"
          >
            <span>Haut</span>
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}
