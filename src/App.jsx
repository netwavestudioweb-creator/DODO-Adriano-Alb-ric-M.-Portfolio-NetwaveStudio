import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBanner from './components/TrustBanner';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Projects from './components/Projects';
import Skills from './components/Skills';
import TestimonialsFAQ from './components/TestimonialsFAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Reveal animations on sections using ScrollTrigger
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0.9, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-snow text-graphite flex flex-col font-sans selection:bg-coral selection:text-white">
      {/* 1. Floating Pill Navbar */}
      <Navbar />

      {/* 2. Full-Screen Hero */}
      <main className="flex-grow">
        <Hero />

        {/* 3. Trust & Institutional Banner */}
        <TrustBanner />

        {/* 4. About & Narrative Profile */}
        <About />

        {/* 5. Services & Solutions */}
        <Services />

        {/* 6. Technical Process */}
        <Process />

        {/* 7. Selected Projects (projects.json) */}
        <Projects />

        {/* 8. Mastery Grid (skills.json) */}
        <Skills />

        {/* 9. Testimonials & FAQ Accordion */}
        <TestimonialsFAQ />

        {/* 10. Contact CTA & Direct Channels */}
        <Contact />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
