import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Hub from './pages/Hub';
import TrackLayout from './layouts/TrackLayout';
import TrackPage from './pages/TrackPage';
import Loader from './components/Loader';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Hub />
  },
  {
    path: '/reseaux-telecoms',
    element: <TrackLayout track="network" title="DODI | Technicien Réseaux, Télécoms & Infrastructure" description="Portfolio de DODO Albéric Mantey Adriano (DODI) — Technicien Réseaux & Télécoms (Infrastructures LAN/WAN, Téléphonie VoIP Asterisk, Tunnels WireGuard, Linux, Sécurité)." />,
    children: [
      {
        index: true,
        element: <TrackPage />
      }
    ]
  },
  {
    path: '/dev-ia',
    element: <TrackLayout track="dev" title="DODI | Développeur Full-Stack Web & IA" description="Portfolio de DODO Albéric Mantey Adriano (DODI) — Développeur Full-Stack Web & Architecte de solutions IA (React, Python, n8n, Groq Whisper, LLaMA, Asterisk ARI)." />,
    children: [
      {
        index: true,
        element: <TrackPage />
      }
    ]
  }
]);

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <HelmetProvider>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      <div className={loading ? 'pointer-events-none' : ''}>
        <RouterProvider router={router} />
      </div>
    </HelmetProvider>
  );
}
