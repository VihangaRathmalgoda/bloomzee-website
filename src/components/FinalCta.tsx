import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { ButtonLink } from './ui/Button';
import { WhatsAppIcon } from './ui/BrandIcons';
import { Reveal } from './ui/Reveal';

export function FinalCta() {
  const { finalCta } = useSiteData();
  const buildWhatsApp = useWhatsApp();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  return (
    <section ref={ref} aria-labelledby="final-cta-title" className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink text-ivory">
      <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y }}>
        <img src={finalCta.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-ink/65" />
      <div aria-hidden="true" className="vignette absolute inset-0" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-28 text-center sm:px-8">
        <Reveal>
          <p className="flex items-center justify-center gap-4 text-[0.66rem] font-semibold uppercase tracking-luxe text-gold-light">
            <span className="h-px w-10 bg-gold/70" aria-hidden="true" />
            {finalCta.eyebrow}
            <span className="h-px w-10 bg-gold/70" aria-hidden="true" />
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 id="final-cta-title" className="mt-8 text-balance font-serif text-[2.6rem] font-light leading-[1.02] sm:text-6xl lg:text-7xl">
            {finalCta.title}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-[0.97rem] leading-relaxed text-ivory/75">{finalCta.description}</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-11">
          <ButtonLink href={buildWhatsApp('journey')} icon={<WhatsAppIcon size={17} className="relative" />}>
            {finalCta.buttonLabel}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
