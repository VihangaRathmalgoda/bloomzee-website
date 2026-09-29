import { useEffect } from 'react';
import { startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll';

let lockCount = 0;

/** Locks body scrolling while `locked` is true. Supports nested locks. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (lockCount === 1) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbar}px`;
      stopSmoothScroll();
    }
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        startSmoothScroll();
      }
    };
  }, [locked]);
}
