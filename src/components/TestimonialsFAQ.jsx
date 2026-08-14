import React, { useState } from 'react';
import faqData from '../data/faq.json';
import { ChevronDown, MessageSquareQuote, HelpCircle, Sparkles, Clock } from 'lucide-react';

export default function TestimonialsFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-snow relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Elegant Empty Testimonials State */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 mono-label text-xs uppercase tracking-widest text-coral font-medium">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Retours d'Expérience
            </div>
            
            <h2 className="font-sans font-extrabold text-3xl md:text-4xl text-ink tracking-tight">
              Témoignages Clients<span className="text-coral">.</span>
            </h2>

            <p className="text-graphite-muted text-sm leading-relaxed">
              La satisfaction des clients repose sur la stabilité des infrastructures livrées et la transparence technique.
            </p>

            {/* Elegant Empty State Card */}
            <div className="bg-white border border-ink/10 rounded-[2.5rem] p-8 text-center shadow-card relative overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-coral-soft/50 text-coral flex items-center justify-center mx-auto mb-4">
                <MessageSquareQuote className="w-7 h-7" />
              </div>

              <h3 className="font-sans font-bold text-lg text-ink mb-2">
                Les témoignages arrivent bientôt
              </h3>

              <p className="text-xs text-graphite-muted leading-relaxed max-w-xs mx-auto mb-6">
                Plusieurs études de cas et retours clients (Alkareem, CHUC, NetWave Studio) sont actuellement en cours de formalisation pour publication.
              </p>

              <div className="inline-flex items-center gap-2 mono-label text-[11px] text-coral bg-coral/5 border border-coral/20 px-3.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>Mise à jour Q3 2026</span>
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
                        <p>{item.answer}</p>
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
