import React, { Suspense, lazy } from 'react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SmoothScroll from './components/SmoothScroll';
import Loader from './components/Loader';
import Reveal from './components/Reveal';

// Lazy loaded components (below the fold)
const TrustBanner = lazy(() => import('./components/TrustBanner'));
const About = lazy(() => import('./components/About'));
const Services = lazy(() => import('./components/Services'));
const Process = lazy(() => import('./components/Process'));
const Projects = lazy(() => import('./components/Projects'));
const Skills = lazy(() => import('./components/Skills'));
const TestimonialsFAQ = lazy(() => import('./components/TestimonialsFAQ'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  return (
    <SmoothScroll>
      <Loader />
      <div className="min-h-screen bg-snow text-graphite flex flex-col font-sans selection:bg-coral selection:text-white">
        {/* 1. Floating Pill Navbar */}
        <Navbar />

        {/* 2. Full-Screen Hero */}
        <main className="flex-grow">
          <Hero />

          <Suspense fallback={null}>
            {/* 3. Trust & Institutional Banner */}
            <Reveal><TrustBanner /></Reveal>

            {/* 4. About & Narrative Profile */}
            <Reveal><About /></Reveal>

            {/* 5. Services & Solutions */}
            <Reveal><Services /></Reveal>

            {/* 6. Technical Process */}
            <Reveal><Process /></Reveal>

            {/* 7. Selected Projects */}
            <Reveal><Projects /></Reveal>

            {/* 8. Mastery Grid */}
            <Reveal><Skills /></Reveal>

            {/* 9. Testimonials & FAQ Accordion */}
            <Reveal><TestimonialsFAQ /></Reveal>

            {/* 10. Contact CTA & Direct Channels */}
            <Reveal><Contact /></Reveal>
          </Suspense>
        </main>

        {/* 11. Footer */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </SmoothScroll>
  );
}
