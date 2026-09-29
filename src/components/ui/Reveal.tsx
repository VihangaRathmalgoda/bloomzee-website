import { motion, type HTMLMotionProps } from 'framer-motion';

export const luxeEase = [0.22, 1, 0.36, 1] as const;

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
  y?: number;
}

/** Fades & lifts its children into view once when scrolled into the viewport. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: luxeEase }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
