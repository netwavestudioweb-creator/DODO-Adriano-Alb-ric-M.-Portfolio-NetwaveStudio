import React, { lazy } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import Reveal from '../components/Reveal';

// Lazy loaded components
const TrustBanner = lazy(() => import('../components/TrustBanner'));
const About = lazy(() => import('../components/About'));
const Services = lazy(() => import('../components/Services'));
const Process = lazy(() => import('../components/Process'));
const Projects = lazy(() => import('../components/Projects'));
const Skills = lazy(() => import('../components/Skills'));
const TestimonialsFAQ = lazy(() => import('../components/TestimonialsFAQ'));
const Contact = lazy(() => import('../components/Contact'));

export default function TrackPage() {
  const { track } = useOutletContext();

  return (
    <>
      <Hero track={track} />
      
      <Reveal><TrustBanner track={track} /></Reveal>
      <Reveal><About track={track} /></Reveal>
      <Reveal><Services track={track} /></Reveal>
      {track !== 'dev' && <Reveal><Process track={track} /></Reveal>}
      <Reveal><Projects track={track} /></Reveal>
      {track === 'dev' && <Reveal><Process track={track} /></Reveal>}
      <Reveal><Skills track={track} /></Reveal>
      <Reveal><TestimonialsFAQ track={track} /></Reveal>
      <Reveal><Contact track={track} /></Reveal>
    </>
  );
}
