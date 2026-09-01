import React, { useState } from 'react';
import faqData from '../data/faq.json';
import { ChevronDown, MessageSquareQuote, HelpCircle, Sparkles, Clock } from 'lucide-react';

export default function TestimonialsFAQ({ track }) {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getFaqAnswer = (item, idx) => {
    if (idx === 0 && track === 'dev') {
      return "Je suis ouvert aux opportunités en entreprise (CDI / CDD), aux contrats de prestation freelance et aux missions de conseil technique. J'interviens sur site au Bénin/Afrique de l'Ouest et à distance (collaboration orale en français, documentation et échanges écrits en anglais).";
    }
    return item.answer;
  };

  return (
    <section id="faq" className="py-16 md:py-24 lg:py-28 bg-snow relative">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Testimonials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Retours d'Expérience
            </div>
            
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-ink tracking-tight">
              Témoignages Clients<span className="text-coral">.</span>
            </h2>

            <p className="text-graphite-muted text-sm leading-relaxed">
              {track === 'dev'
                ? "La satisfaction de mes clients repose sur la robustesse des applications livrées, la fluidité logicielle et la transparence technique."
                : "La satisfaction des clients repose sur la stabilité des infrastructures livrées et la transparence technique."}
            </p>

            {/* Testimonials Proof Cards */}
            <div className="space-y-4">
              <div className="bg-white border border-ink/10 rounded-[2rem] p-6 md:p-7 shadow-card relative overflow-hidden">
                <MessageSquareQuote className="w-7 h-7 text-coral/40 mb-3" />
                <p className="text-xs md:text-sm text-graphite italic leading-relaxed mb-4">
                  "L'optimisation technique réalisée par DODI a divisé par 4 le temps de chargement de notre e-commerce sur réseau 3G. La navigation est devenue ultra fluide pour nos clients."
                </p>
                <div className="flex items-center justify-between border-t border-ink/5 pt-3">
                  <div>
                    <h4 className="font-sans font-bold text-xs text-ink">Alkareem Parfumerie</h4>
                    <p className="text-[10px] text-graphite-muted">Plateforme E-Commerce (~500 réf.)</p>
                  </div>
                  <span className="mono-label text-[10px] text-coral font-semibold bg-coral-soft/40 px-2.5 py-0.5 rounded-full">
                    TTFB ~1s (-75%)
                  </span>
                </div>
              </div>

              <div className="bg-white border border-ink/10 rounded-[2rem] p-6 md:p-7 shadow-card relative overflow-hidden">
                <MessageSquareQuote className="w-7 h-7 text-coral/40 mb-3" />
                <p className="text-xs md:text-sm text-graphite italic leading-relaxed mb-4">
                  "L'agent vocal Asterisk et le tunnel WireGuard sécurisé déployés assurent un traitement d'incidents médical fiable avec une excellente disponibilité."
                </p>
                <div className="flex items-center justify-between border-t border-ink/5 pt-3">
                  <div>
                    <h4 className="font-sans font-bold text-xs text-ink">Projet Adjoua — CHUC</h4>
                    <p className="text-[10px] text-graphite-muted">
                      {track === 'dev' ? 'Assistant Vocal IA' : 'Infrastructure Télécoms & IA Vocale'}
                    </p>
                  </div>
                  <span className="mono-label text-[10px] text-coral font-semibold bg-coral-soft/40 px-2.5 py-0.5 rounded-full">
                    Disponibilité 99.9%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-coral" />
              Questions Fréquentes
            </div>

            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-ink tracking-tight mb-8">
              Foire Aux Questions<span className="text-coral">.</span>
            </h2>

            <div className="space-y-4">
              {faqData.map((item, idx) => {
                const isOpen = openFaq === idx;
                const answer = getFaqAnswer(item, idx);

                return (
                  <div
                    key={idx}
                    className="bg-white border border-ink/10 rounded-2xl overflow-hidden transition-all shadow-sm hover:border-coral/30"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-sans font-bold text-base md:text-lg text-ink">
                        {item.question}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'bg-coral text-white rotate-180' : 'bg-snow-2 text-ink'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm text-graphite leading-relaxed border-t border-ink/5">
                        <p>{answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
