import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function RevealSentence({ children }) {
  return (
    <p className="workout-hero__statement" data-word-reveal>
      {String(children).split(' ').map((word, index) => (
        <span key={`${word}-${index}`}>{word}&nbsp;</span>
      ))}
    </p>
  );
}

export default function WorkoutMotion({ scrollContainer, children }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const scroller = scrollContainer?.current || window;
    const words = gsap.utils.toArray('[data-word-reveal] > span');
    const artwork = rootRef.current?.querySelector('[data-workout-artwork]');
    const trigger = rootRef.current?.querySelector('.workout-hero');

    if (words.length && trigger) {
      gsap.fromTo(words, { opacity: 0.18 }, {
        opacity: 1,
        stagger: 0.06,
        ease: 'none',
        scrollTrigger: {
          trigger,
          scroller,
          start: 'top 82%',
          end: 'bottom 42%',
          scrub: 0.45,
        },
      });
    }

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
