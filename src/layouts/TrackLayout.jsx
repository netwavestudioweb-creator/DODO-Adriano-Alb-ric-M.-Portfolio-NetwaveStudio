import React, { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import SmoothScroll from '../components/SmoothScroll';

// Lazy load footer to optimize initial render
const Footer = lazy(() => import('../components/Footer'));

export default function TrackLayout({ track, title, description }) {
  const themeClass = track === 'network' ? 'theme-network' : '';

  return (
    <SmoothScroll>
      <Loader />
      {/* 
        The themeClass applies the CSS variables for --color-accent 
        which will change the color of all accent elements (text-coral, bg-coral, etc. which are now mapped to --color-accent)
      */}
      <div className={`min-h-screen bg-snow text-graphite flex flex-col font-sans ${themeClass}`}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
        </Helmet>

        <Navbar track={track} />

        <main className="flex-grow">
          <Suspense fallback={null}>
            <Outlet context={{ track }} />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </SmoothScroll>
  );
}
