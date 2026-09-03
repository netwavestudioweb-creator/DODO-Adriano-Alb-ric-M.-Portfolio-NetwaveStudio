import React, { useState, lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Hub from './pages/Hub';
import Loader from './components/Loader';

const TrackLayout = lazy(() => import('./layouts/TrackLayout'));
const TrackPage = lazy(() => import('./pages/TrackPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Hub />
  },
  {
    path: '/reseaux-telecoms',
    element: (
      <Suspense fallback={null}>
        <TrackLayout track="network" title="DODI | Technicien Réseaux, Télécoms & Infrastructure" description="Portfolio de DODO Albéric Mantey Adriano (DODI) — Technicien Réseaux & Télécoms (Infrastructures LAN/WAN, Téléphonie VoIP Asterisk, Tunnels WireGuard, Linux, Sécurité)." />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <TrackPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/dev-ia',
    element: (
      <Suspense fallback={null}>
        <TrackLayout track="dev" title="DODI | Développeur Full-Stack Web & IA" description="Portfolio de DODO Albéric Mantey Adriano (DODI) — Développeur Full-Stack Web & Architecte de solutions IA (React, Python, n8n, Groq Whisper, LLaMA, Asterisk ARI)." />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <TrackPage />
          </Suspense>
        )
      }
    ]
  }
]);

export default function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('portfolio_intro_seen');
    }
    return true;
  });

  return (
    <HelmetProvider>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div className={loading ? 'pointer-events-none' : ''}>
        <RouterProvider router={router} />
      </div>
    </HelmetProvider>
  );
}
