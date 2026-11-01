import { useEffect, useRef } from 'react';

export default function WorkoutMotion({ scrollContainer, active, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const media = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let context;
    let generation = 0;
    const syncMotion = async () => {
      const request = ++generation;
      context?.revert();
      context = undefined;
      if (!media.matches) return;
      // Phones never download or start the scroll-animation engine.
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'), import('gsap/ScrollTrigger'),
      ]);
      if (request !== generation) return;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const artwork = rootRef.current?.querySelector('[data-workout-artwork]');
        const trigger = rootRef.current?.querySelector('.workout-hero');
        if (!artwork || !trigger) return;
        gsap.fromTo(artwork, { scale: 0.8, opacity: 0.42 }, {
          scale: 1, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger, scroller: scrollContainer?.current || window,
            start: 'top 92%', end: 'bottom 35%', scrub: 0.55,
          },
        });
      }, rootRef);
    };
    const update = () => { syncMotion().catch(error => console.warn('Optional motion unavailable:', error)); };
    update();
    media.addEventListener('change', update);
    return () => {
      generation += 1;
      media.removeEventListener('change', update);
      context?.revert();
    };
  }, [active, scrollContainer]);

  return <div ref={rootRef} className="workout-motion-root">{children}</div>;
}
