import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useIntroDelay } from '../context/IntroContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { ButtonLink } from './ui/Button';
import { WhatsAppIcon } from './ui/BrandIcons';
import { luxeEase } from './ui/Reveal';

/** A few slow-drifting specks of gold light — kept deliberately sparse. */
const PARTICLES = [
  { left: '12%', top: '28%', size: 3, delay: 0, duration: 11 },
  { left: '24%', top: '68%', size: 2, delay: 2, duration: 13 },
  { left: '71%', top: '22%', size: 2, delay: 1, duration: 12 },
  { left: '84%', top: '58%', size: 3, delay: 3, duration: 14 },
  { left: '56%', top: '78%', size: 2, delay: 4, duration: 10 },
  { left: '40%', top: '16%', size: 2, delay: 5, duration: 15 },
];

export function Hero() {
  const { hero, navigation, ui } = useSiteData();
  // Start entrance animations as the opening intro lifts away (slight overlap feels seamless).
  const introDelay = useIntroDelay();
  const d = introDelay > 0 ? introDelay - 0.35 : 0;
  const buildWhatsApp = useWhatsApp();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // Gentle parallax: the image drifts slower than the page, text lifts and fades.
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '22%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, reduceMotion ? 1.08 : 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const poruwaHref = navigation.find((n) => n.href === '#poruwas')?.href ?? '#poruwas';
  const words = hero.title.split(' ');

  return (
    <section
      id="home"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink text-ivory"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <motion.img
          src={hero.image}
          alt={hero.imageAlt}
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          decoding="async"
          className="h-full w-full object-cover object-[65%_center]"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, delay: d * 0.6, ease: luxeEase }}
        />
      </motion.div>

      {/* Cinematic overlays: gradient, vignette */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-ink/10" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30" />
      <div aria-hidden="true" className="vignette absolute inset-0" />

      {/* Floating light */}
      {!reduceMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold-light shadow-[0_0_12px_2px_rgba(214,188,142,0.6)]"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -40, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-site px-5 pb-28 pt-40 sm:px-8 sm:pb-32 lg:pb-40"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: d + 0.4, ease: luxeEase }}
          className="flex items-center gap-4 text-[0.66rem] font-semibold uppercase tracking-luxe text-gold-light sm:text-[0.7rem]"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: d + 0.6, ease: luxeEase }}
            className="h-px w-10 origin-left bg-gold"
            aria-hidden="true"
          />
          {hero.eyebrow}
        </motion.p>

        <h1 id="hero-title" className="mt-7 max-w-5xl font-serif font-light leading-[0.98] text-ivory">
          <span className="block text-[3.2rem] sm:text-7xl lg:text-8xl xl:text-[7.5rem]">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.3, delay: d + 0.55 + i * 0.12, ease: luxeEase }}
                >
                  {word}
                  {i < words.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </span>
          {hero.titleAccent && (
            <span className="block overflow-hidden pb-2">
              <motion.span
                className="text-foil block pr-2 text-[2.1rem] italic sm:text-5xl lg:text-6xl xl:text-7xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.3, delay: d + 0.55 + words.length * 0.12, ease: luxeEase }}
              >
                {hero.titleAccent}
              </motion.span>
            </span>
          )}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: d + 1.2, ease: luxeEase }}
          className="mt-8 max-w-xl"
        >
          <p className="font-serif text-xl italic text-champagne sm:text-2xl">{hero.subtitle}</p>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ivory/70">{hero.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: d + 1.4, ease: luxeEase }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <ButtonLink href={poruwaHref}>{hero.primaryCta}</ButtonLink>
          <ButtonLink href={buildWhatsApp()} variant="outline" icon={<WhatsAppIcon size={16} className="relative" />}>
            {hero.secondaryCta}
          </ButtonLink>
        </motion.div>
      </motion.div>

      {/* Bottom rail: keywords + scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: d + 1.8 }}
        className="absolute inset-x-0 bottom-0 hidden sm:block"
      >
        {/* Right padding keeps the scroll cue clear of the floating WhatsApp button */}
        <div className="mx-auto flex max-w-site items-center justify-between gap-6 border-t border-ivory/10 py-5 pl-8 pr-28">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.6rem] font-semibold uppercase tracking-luxe text-ivory/55 sm:text-[0.64rem]">
            {hero.highlights.map((h, i) => (
              <li key={h} className="flex items-center gap-5">
                {i > 0 && <span className="h-1 w-1 rotate-45 bg-gold/70" aria-hidden="true" />}
                {h}
              </li>
            ))}
          </ul>
          <a
            href={poruwaHref}
            className="hidden items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-luxe text-ivory/55 transition-colors hover:text-gold-light sm:flex"
          >
            <span className="relative h-10 w-px overflow-hidden bg-ivory/15" aria-hidden="true">
              <span className="absolute inset-0 animate-scroll-line bg-gold" />
            </span>
            {ui.scroll}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
