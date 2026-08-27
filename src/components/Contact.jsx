import React, { useState } from 'react';
import { Mail, MessageCircle, Send, ArrowUpRight, CheckCircle2, Shield, Building2, User } from 'lucide-react';

const LinkedInIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const socialLinks = [
    {
      name: 'Email Personnel (DODI)',
      value: 'adrrianododo@gmail.com',
      href: 'mailto:adrrianododo@gmail.com',
      icon: User,
      desc: 'Contact direct pour opportunités & recrutement',
      isPrimary: true,
    },
    {
      name: 'WhatsApp Direct',
      value: '+229 01 50 88 46 70',
      href: 'https://wa.me/2290150884670',
      icon: MessageCircle,
      desc: 'Échanges rapides & messagerie direct',
      isPrimary: true,
    },
    {
      name: 'LinkedIn',
      value: 'Dodo Albéric Mantey Adriano',
      href: 'https://linkedin.com',
      icon: LinkedInIcon,
      desc: 'Profil professionnel & réseau',
      isPrimary: true,
    },
    {
      name: 'Pour un projet d\'agence via NetWave Studio →',
      value: 'netwave.studio.web@gmail.com',
      href: 'mailto:netwave.studio.web@gmail.com',
      icon: Building2,
      desc: 'Projets d\'entreprise & devis agence',
      isSecondary: true,
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-ink text-snow relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-coral/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Main Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-coral inline-block" />
            Contact & Opportunités
          </div>
          <h2 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-snow leading-[0.95] mb-6">
            Échangeons ensemble<span className="text-coral">.</span>
          </h2>
          <p className="text-snow/70 text-base md:text-lg font-normal leading-relaxed">
            Vous recherchez un Technicien Réseaux & Télécoms, un Développeur Web ou un Architecte IA pour un poste, une mission freelance ou un projet ? N'hésitez pas à me contacter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Links Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="mono-label text-xs uppercase tracking-widest text-snow/60 mb-6">
              Canaux de communication personnels
            </h3>

            {socialLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card-premium group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                    item.isSecondary
                      ? 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/20 mt-4'
                      : 'bg-white/[0.05] hover:bg-white/[0.09] border-white/10 hover:border-coral/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors ${
                      item.isSecondary
                        ? 'bg-white/[0.04] text-snow/60 group-hover:bg-white/10 group-hover:text-snow'
                        : 'bg-white/[0.06] text-coral group-hover:bg-coral group-hover:text-white'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans font-bold text-xs sm:text-sm text-snow group-hover:text-coral transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="mono-label text-[11px] sm:text-xs text-coral-soft/90 font-medium truncate">
                        {item.value}
                      </p>
                      <p className="text-[10px] text-snow/40 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-snow/40 group-hover:text-coral flex-shrink-0 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-2" />
                </a>
              );
            })}

            {/* Note on confidentiality */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-snow/50 leading-relaxed flex items-start gap-2.5 mt-6">
              <Shield className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
              <p>
                <strong className="text-snow/80">Réactivité & Confidentialité :</strong> Réponses sous 24h ouvrées. Vos projets et échanges restent strictement confidentiels.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-bold text-2xl text-snow">
                  Message envoyé avec succès !
                </h3>
                <p className="text-sm text-snow/70 max-w-sm mx-auto">
                  Merci ! DODI prendra connaissance de votre message et vous recontactera sous 24h.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-magnetic mt-4 px-6 py-2.5 rounded-full bg-white/10 text-xs font-semibold text-snow hover:bg-white/20"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block mono-label text-xs uppercase tracking-wider text-snow/70 mb-2">
                      Votre Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/15 focus:border-coral rounded-xl px-4 py-3.5 text-sm text-snow placeholder-white/20 transition-colors focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mono-label text-xs uppercase tracking-wider text-snow/70 mb-2">
                      Votre Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jean@entreprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/[0.05] border border-white/15 focus:border-coral rounded-xl px-4 py-3.5 text-sm text-snow placeholder-white/20 transition-colors focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mono-label text-xs uppercase tracking-wider text-snow/70 mb-2">
                    Objet de votre message
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Opportunité de poste / Mission freelance / Devis"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-coral rounded-xl px-4 py-3.5 text-sm text-snow placeholder-white/20 transition-colors focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mono-label text-xs uppercase tracking-wider text-snow/70 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows="5"
                    required
                    placeholder="Présentez votre projet, les compétences recherchées ou vos objectifs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-coral rounded-xl px-4 py-3.5 text-sm text-snow placeholder-white/20 transition-colors focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-magnetic w-full py-4 px-8 rounded-full bg-coral hover:bg-coral-hover text-snow font-bold text-sm md:text-base shadow-coral-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Envoyer votre message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
