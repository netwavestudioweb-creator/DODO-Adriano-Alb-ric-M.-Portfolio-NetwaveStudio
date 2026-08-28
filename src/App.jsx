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
    element: <TrackLayout track="network" title="DODI | Réseaux & Télécoms" description="Expertise en infrastructures d'entreprise, téléphonie VoIP et réseaux." />,
    children: [
      {
        index: true,
        element: <TrackPage />
      }
    ]
  },
  {
    path: '/dev-ia',
    element: <TrackLayout track="dev" title="DODI | Développement Web & IA" description="Création d'applications web modernes et d'agents vocaux IA." />,
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
