import { motion } from 'framer-motion';
import { luxeEase } from './Reveal';
import { LotusDivider } from './LotusDivider';

interface SectionHeadingProps {
  /** Editorial section number, e.g. "01" */
  number?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  id?: string;
}

export function SectionHeading({ number, eyebrow, title, subtitle, align = 'center', tone = 'dark', id }: SectionHeadingProps) {
  const centered = align === 'center';
  const titleColor = tone === 'dark' ? 'text-ivory' : 'text-ink';
  const subColor = tone === 'dark' ? 'text-stone-light' : 'text-ink-500';
  const accentColor = tone === 'dark' ? 'text-gold' : 'text-gold-dark';
  const numberColor = tone === 'dark' ? 'text-gold-light' : 'text-gold-dark';

  return (
    <header className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: luxeEase }}
        className={`flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-luxe ${accentColor}`}
      >
        {number && <span className={`font-serif text-base italic tracking-normal ${numberColor}`}>{number}</span>}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: luxeEase }}
          className="h-px w-10 origin-left bg-gold/60"
          aria-hidden="true"
        />
        <span>{eyebrow}</span>
      </motion.div>

      <motion.h2
        id={id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.1, delay: 0.1, ease: luxeEase }}
        className={`mt-6 max-w-4xl text-balance font-serif text-[2.1rem] font-light leading-[1.08] sm:text-5xl lg:text-6xl ${titleColor}`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.1, delay: 0.2, ease: luxeEase }}
          className={`mt-6 max-w-2xl text-pretty text-[0.95rem] leading-relaxed sm:text-base ${subColor}`}
        >
          {subtitle}
        </motion.p>
      )}

      {centered && <LotusDivider className={`mt-9 ${tone === 'light' ? '!text-gold-dark' : ''}`} />}
    </header>
  );
}
