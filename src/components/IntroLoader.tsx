import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useScrollLock } from '../hooks/useScrollLock';
import { luxeEase } from './ui/Reveal';

/** How long the intro holds before lifting away (s). */
const HOLD = 1.9;
/** Duration of the lift-away wipe (s). */
const EXIT = 0.9;
/** Entrance animations elsewhere start this many seconds after load. */
export const INTRO_REVEAL_DELAY = HOLD + 0.15;

const STORAGE_KEY = 'bz-intro-played';

/** The intro plays once per browser session. */
export function shouldPlayIntro(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== '1';
  } catch {
    return true;
  }
}

function markIntroPlayed() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* storage unavailable — the intro will simply play again next time */
  }
}

/**
 * Opening curtain: the gold BZ monogram fades in with a light sweep across it,
 * a hairline draws beneath, then the whole panel lifts away to reveal the hero.
 * Click or press any key to skip.
 */
export function IntroLoader() {
  const { site } = useSiteData();
  const [visible, setVisible] = useState(true);
  useScrollLock(visible);

  useEffect(() => {
    markIntroPlayed();
    const timer = window.setTimeout(() => setVisible(false), HOLD * 1000);
    const skip = () => setVisible(false);
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  const mark = site.logoMark || site.logo;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden="true"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[150] flex cursor-pointer flex-col items-center justify-center bg-ink"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: EXIT, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,149,96,0.16),transparent_60%)]" />

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
            transition={{ duration: 1.1, ease: luxeEase }}
          >
            {mark ? (
              <div className="relative h-28 w-28 sm:h-32 sm:w-32">
                <img src={mark} alt="" className="h-full w-full object-contain" />
                {/* Light sweep, masked to the logo's own shape */}
                <motion.div
                  className="absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,244,214,0.85)_50%,transparent_65%)] bg-[length:250%_100%]"
                  style={{
                    WebkitMaskImage: `url(${mark})`,
                    maskImage: `url(${mark})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                  }}
                  initial={{ backgroundPosition: '120% 0' }}
                  animate={{ backgroundPosition: '-20% 0' }}
                  transition={{ duration: 1.3, delay: 0.5, ease: 'easeInOut' }}
                />
              </div>
            ) : (
              <span className="font-serif text-6xl italic text-gold-light">{site.shortName}</span>
            )}
          </motion.div>

          <motion.span
            className="mt-7 h-px w-40 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease: luxeEase }}
          />
          <motion.p
            className="text-foil mt-5 font-serif text-2xl tracking-[0.35em] sm:text-3xl"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.35em' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, delay: 0.45, ease: luxeEase }}
          >
            {site.name.toUpperCase()}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
