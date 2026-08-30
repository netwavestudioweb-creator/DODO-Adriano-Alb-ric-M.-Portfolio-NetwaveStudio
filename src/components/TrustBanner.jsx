import React from 'react';
import { ShieldCheck, Building2, Landmark, Hospital, Cpu } from 'lucide-react';

export default function TrustBanner({ track }) {
  const allProjects = [
    { name: 'Alkareem Parfumerie', icon: Cpu, desc: 'Client E-Commerce' },
    { name: 'CHUC', icon: Hospital, desc: 'Hôpital Universitaire' },
    { name: 'Ministère de la Santé du Bénin', icon: Landmark, desc: 'Supervision Réseau' },
    { name: 'SOBAPS Bénin', icon: ShieldCheck, desc: 'Infrastructures & Sécurité' },
    { name: 'PH GROUP', icon: Building2, desc: 'Partenaire Corporate' },
  ];

  const projects = track === 'dev'
    ? [
        { name: 'Alkareem Parfumerie', icon: Cpu, desc: 'Client E-Commerce' },
        { name: 'CHUC', icon: Hospital, desc: 'Hôpital Universitaire' },
        { name: 'PH GROUP', icon: Building2, desc: 'Partenaire Corporate' },
      ]
    : track === 'network'
    ? [
        { name: 'CHUC', icon: Hospital, desc: 'Hôpital Universitaire' },
        { name: 'Ministère de la Santé du Bénin', icon: Landmark, desc: 'Supervision Réseau' },
        { name: 'SOBAPS Bénin', icon: ShieldCheck, desc: 'Infrastructures & Sécurité' },
        { name: 'PH GROUP', icon: Building2, desc: 'Partenaire Corporate' },
      ]
    : allProjects;

  return (
    <div className="bg-snow-2 border-y border-ink/5 py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="mono-label text-xs uppercase tracking-widest text-graphite-muted flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-coral inline-block" />
          Projets & Organisations de Confiance
        </p>
        <span className="mono-label text-xs text-graphite-muted">
          Cotonou, Bénin & International
        </span>
      </div>

      {/* Single Row: Left to Right Marquee */}
      <div className="relative w-full overflow-hidden mask-edge-fade">
        <div className="animate-marquee-right flex items-center gap-4 md:gap-6 py-2">
          {[...projects, ...projects, ...projects, ...projects, ...projects].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-3 bg-white border border-ink/10 px-6 py-3 rounded-full shadow-sm hover:border-coral/40 transition-all flex-shrink-0 cursor-default"
              >
                <Icon className="w-4 h-4 text-coral" />
                <span className="font-sans font-bold text-sm text-ink tracking-tight">
                  {item.name}
                </span>
                <span className="text-[11px] mono-label text-graphite-muted border-l border-ink/10 pl-2.5">
                  {item.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
