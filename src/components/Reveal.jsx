import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Reveal({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    
    // We target the first child, which should be the section or main container
    const target = element.firstElementChild || element;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        target,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, element);

    return () => ctx.revert(); // clean up animations on unmount
  }, []);

  return <div ref={ref} className="reveal-wrapper">{children}</div>;
}
