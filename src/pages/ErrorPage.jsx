import React from 'react';
import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-ink text-snow flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-coral/10 border border-coral/20 text-coral flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="mono-label text-xs uppercase tracking-widest text-coral font-medium mb-3">
          Erreur d'exécution
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Oups ! Une anomalie est survenue
        </h1>

        <p className="text-sm text-snow/70 leading-relaxed mb-6">
          Une erreur inattendue s'est produite lors du chargement de cette page. Vous pouvez recharger la page ou revenir à l'accueil.
        </p>

        {error && (
          <div className="mb-6 p-3.5 bg-black/40 border border-white/5 rounded-xl text-left font-mono text-xs text-snow/60 overflow-x-auto max-h-32">
            {error.statusText || error.message || String(error)}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-snow text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Recharger la page
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-coral hover:bg-coral/90 text-white text-xs font-semibold shadow-lg shadow-coral/20 transition-colors"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
