import { motion } from 'framer-motion';
import { luxeEase } from './Reveal';

interface LotusDividerProps {
  className?: string;
  /** Length of each side line. */
  size?: 'sm' | 'md' | 'lg';
  align?: 'center' | 'left';
}

const lineWidths = { sm: 'w-10', md: 'w-16 sm:w-24', lg: 'w-24 sm:w-40' };

/** Small lotus, echoing the motif in the BloomZee logo. */
export function LotusMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" fill="none" aria-hidden="true" className={className}>
      <path d="M20 3c3.2 4.6 3.2 10.4 0 16-3.2-5.6-3.2-11.4 0-16Z" stroke="currentColor" strokeWidth="1" />
      <path d="M20 19c-5.2-1.6-9.4-5.6-11.6-11.6 5.4.6 9.6 4.8 11.6 11.6Z" stroke="currentColor" strokeWidth="1" />
      <path d="M20 19c5.2-1.6 9.4-5.6 11.6-11.6-5.4.6-9.6 4.8-11.6 11.6Z" stroke="currentColor" strokeWidth="1" />
      <path d="M20 19c-5.6.9-11.2.4-16.4-2.4M20 19c5.6.9 11.2.4 16.4-2.4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <circle cx="20" cy="21.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * Ornamental divider: two hairlines drawing outward from a small lotus.
 */
export function LotusDivider({ className = '', size = 'md', align = 'center' }: LotusDividerProps) {
  const line = `h-px ${lineWidths[size]}`;
  return (
    <motion.div
      aria-hidden="true"
      className={`flex items-center gap-3 text-gold ${align === 'center' ? 'justify-center' : 'justify-start'} ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '-8%' }}
    >
      {align === 'center' && (
        <motion.span
          className={`${line} origin-right bg-gradient-to-l from-gold/70 to-transparent`}
          variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1.3, delay: 0.25, ease: luxeEase } } }}
        />
      )}
      <motion.span
        variants={{ hidden: { opacity: 0, y: 6 }, shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease: luxeEase } } }}
      >
        <LotusMark className="h-5 w-8" />
      </motion.span>
      <motion.span
        className={`${line} origin-left bg-gradient-to-r from-gold/70 to-transparent`}
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 1.3, delay: 0.25, ease: luxeEase } } }}
      />
    </motion.div>
  );
}
