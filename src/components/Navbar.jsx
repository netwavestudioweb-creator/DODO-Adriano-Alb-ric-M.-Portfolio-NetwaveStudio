import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if past top threshold
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Smart scroll direction: hide when scrolling down, show when scrolling up
      if (currentScrollY > 120 && currentScrollY > lastScrollY.current) {
        // Scrolling down
        if (!mobileMenuOpen) {
          setIsVisible(false);
        }
      } else {
        // Scrolling up or at top
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'À propos', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Projets', href: '#projects' },
    { label: 'Processus', href: '#process' },
    { label: 'Compétences', href: '#skills' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0 pointer-events-none'
      } ${
        mobileMenuOpen
          ? 'rounded-[2rem] bg-white border border-ink/15 shadow-2xl p-5 text-ink'
          : isScrolled
          ? 'rounded-full bg-white border border-ink/10 shadow-[0_12px_40px_rgba(0,0,0,0.14)] py-2.5 px-4 md:px-6'
          : 'rounded-full bg-ink/40 backdrop-blur-md border border-white/10 py-3.5 px-5 md:px-7'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        {/* Brand / Monogram */}
        <a
          href="#hero"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 group focus:outline-none"
          aria-label="Retour en haut de page"
        >
          <span
            className={`font-sans font-extrabold tracking-tight text-lg transition-colors ${
              mobileMenuOpen || isScrolled ? 'text-ink' : 'text-snow'
            }`}
          >
            D<span className="text-coral">.</span>A<span className="text-coral">.</span>
          </span>
          <span
            className={`hidden sm:inline-block mono-label text-xs tracking-wider px-2 py-0.5 rounded-full uppercase border transition-colors ${
              mobileMenuOpen || isScrolled
                ? 'border-ink/10 text-graphite-muted bg-snow-2'
                : 'border-white/15 text-snow/70 bg-white/5'
            }`}
          >
            NetWave Studio
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`link-lift transition-colors ${
                isScrolled
                  ? 'text-graphite hover:text-coral font-semibold'
                  : 'text-snow/80 hover:text-snow'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-magnetic inline-flex items-center gap-1.5 bg-coral hover:bg-coral-hover text-white text-xs md:text-sm font-semibold py-2 px-4 md:px-5 rounded-full shadow-coral-glow"
          >
            <span>Me contacter</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full transition-colors flex items-center justify-center ${
              mobileMenuOpen || isScrolled
                ? 'text-ink hover:bg-ink/5'
                : 'text-snow hover:bg-white/10'
            }`}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-coral" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Clean list with high touch area) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-5 pt-4 border-t border-ink/10 flex flex-col gap-1.5 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-3 px-4 rounded-2xl text-sm font-semibold text-graphite hover:text-coral hover:bg-ink/5 transition-all"
            >
              <span>{link.label}</span>
              <ChevronRight className="w-4 h-4 text-graphite-muted opacity-60" />
            </a>
          ))}

          <div className="mt-3 pt-3 border-t border-ink/10 flex items-center justify-between px-2 text-xs mono-label text-graphite-muted">
            <span>NetWave Studio · 2026</span>
            <span className="text-coral">Cotonou, Bénin</span>
          </div>
        </div>
      )}
    </header>
  );
}
