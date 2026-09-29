import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { SmartImage } from './ui/SmartImage';
import { CurtainReveal } from './ui/CurtainReveal';
import { Icon } from './ui/Icon';

export function About() {
  const { about, site } = useSiteData();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const secondaryY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const [primary, secondary] = about.images;

  return (
    <section id="about" ref={ref} aria-labelledby="about-title" className="relative overflow-hidden bg-ink py-24 text-ivory sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-site items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-24">
        {/* Images */}
        {primary && (
          <div className="relative order-2 pb-16 pr-10 sm:pr-20 lg:order-1 lg:pb-24">
            <CurtainReveal tone="ink" className="relative aspect-[4/5] rounded-[1.25rem]">
              <SmartImage src={primary} alt={`${site.name} — craftsmanship`} />
              <span aria-hidden="true" className="absolute inset-4 rounded-[0.8rem] border border-gold-light/25" />
            </CurtainReveal>
            {secondary && (
              <motion.div
                style={{ y: secondaryY }}
                className="absolute bottom-0 right-0 w-[48%] overflow-hidden rounded-[1rem] border-[6px] border-ink shadow-2xl"
              >
                <CurtainReveal tone="ink" delay={0.35} className="relative aspect-square">
                  <SmartImage src={secondary} alt={`${site.name} — detail`} />
                </CurtainReveal>
              </motion.div>
            )}
          </div>
        )}

        {/* Text */}
        <div className="order-1 lg:order-2">
          <SectionHeading id="about-title" number="05" eyebrow={about.eyebrow} title={about.title} align="left" />
          <div className="mt-8 space-y-5">
            {about.paragraphs.map((paragraph, i) => (
              <Reveal key={i} delay={0.1 + i * 0.1}>
                <p className="text-[0.97rem] leading-[1.85] text-stone-light">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-8 border-t border-ivory/10 pt-10 sm:grid-cols-2">
            {about.pillars.map((pillar, i) => (
              <li key={pillar.title}>
                <Reveal delay={i * 0.08} className="flex gap-4">
                  <Icon name={pillar.icon} size={22} strokeWidth={1.25} className="mt-1 shrink-0 text-gold" />
                  <div>
                    <h3 className="font-serif text-xl">{pillar.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-light">{pillar.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
