import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { luxeEase } from './Reveal';

interface CurtainRevealProps {
  children: ReactNode;
  /** Colour of the curtain — match the section background. */
  tone?: 'ivory' | 'ink';
  className?: string;
  delay?: number;
}

const curtainEase = [0.76, 0, 0.24, 1] as const;

/**
 * Editorial image reveal: a panel in the section colour lifts away like a
 * curtain while the image settles from a gentle zoom. Plays once, on view.
 */
export function CurtainReveal({ children, tone = 'ivory', className = '', delay = 0 }: CurtainRevealProps) {
  const image: Variants = {
    hidden: { scale: 1.18 },
    shown: { scale: 1, transition: { duration: 1.8, delay, ease: luxeEase } },
  };
  const curtain: Variants = {
    hidden: { scaleY: 1 },
    shown: { scaleY: 0, transition: { duration: 1.15, delay, ease: curtainEase } },
  };

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    >
      <motion.div className="h-full w-full" variants={image}>
        {children}
      </motion.div>
      <motion.div
        aria-hidden="true"
        variants={curtain}
        className={`pointer-events-none absolute inset-0 origin-top ${tone === 'ivory' ? 'bg-ivory' : 'bg-ink'}`}
      >
        {/* Fine gold edge on the rising curtain */}
        <span className="absolute inset-x-0 bottom-0 h-px bg-gold/50" />
      </motion.div>
    </motion.div>
  );
}
