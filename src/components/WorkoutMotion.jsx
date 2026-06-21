import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function WorkoutMotion({ scrollContainer, children }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const scroller = scrollContainer?.current || window;
    const artwork = rootRef.current?.querySelector('[data-workout-artwork]');
    const trigger = rootRef.current?.querySelector('.workout-hero');

    if (artwork && trigger) {
      gsap.fromTo(artwork, { scale: 0.8, opacity: 0.42 }, {
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger,
          scroller,
          start: 'top 92%',
          end: 'bottom 35%',
          scrub: 0.55,
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach(instance => {
      if (instance.trigger && rootRef.current?.contains(instance.trigger)) instance.kill();
    });
  }, { scope: rootRef, dependencies: [scrollContainer] });

  return <div ref={rootRef} className="workout-motion-root">{children}</div>;
}
