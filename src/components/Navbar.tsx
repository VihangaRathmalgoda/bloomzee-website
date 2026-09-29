import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useIntroDelay } from '../context/IntroContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { useScrollLock } from '../hooks/useScrollLock';
import { Logo } from './Logo';
import { ButtonLink } from './ui/Button';
import { SocialLinksList, WhatsAppIcon } from './ui/BrandIcons';
import { luxeEase } from './ui/Reveal';

export function Navbar() {
  const { navigation, site, ui } = useSiteData();
  const buildWhatsApp = useWhatsApp();
  const introDelay = useIntroDelay();
  // The intro delay applies only to the first entrance, not when re-showing on scroll-up.
  const [entered, setEntered] = useState(false);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(navigation[0]?.href ?? '');

  useScrollLock(open);

  // Glass background after leaving the top; hide on fast scroll down, reveal on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > previous + 4 && !open);
    if (y < previous - 2) setHidden(false);
  });

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [navigation]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const glass = scrolled || open;

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: luxeEase, delay: entered ? 0 : introDelay }}
        onAnimationComplete={() => setEntered(true)}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`transition-all duration-700 ease-luxe ${
            glass ? 'border-b border-ivory/[0.07] bg-ink/70 py-3 backdrop-blur-xl' : 'border-b border-transparent bg-transparent py-5 sm:py-7'
          }`}
        >
          <nav aria-label="Main" className="mx-auto flex max-w-site items-center justify-between gap-6 px-5 sm:px-8">
            <a
              href={navigation[0]?.href ?? '#'}
              className="relative z-[60] text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`${site.name} — home`}
              onClick={() => setOpen(false)}
            >
              <Logo />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navigation.map((item) => {
                const active = activeHref === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={active ? 'location' : undefined}
                      className={`group relative px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold ${
                        active ? 'text-gold-light' : 'text-ivory/75 hover:text-ivory'
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ease-luxe ${
                          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <ButtonLink
                href={buildWhatsApp()}
                variant="outline"
                className="hidden !px-5 !py-2.5 sm:inline-flex"
                icon={<WhatsAppIcon size={15} className="relative" />}
              >
                {ui.whatsappUs}
              </ButtonLink>

              {/* Hamburger */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-ivory/20 text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
              >
                <span className="relative block h-3 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 h-px w-5 bg-current transition-all duration-500 ease-luxe ${
                      open ? 'top-1.5 rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 h-px bg-current transition-all duration-500 ease-luxe ${
                      open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3'
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 44px)' }}
            transition={{ duration: 0.8, ease: luxeEase }}
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28 text-ivory lg:hidden"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,149,96,0.18),transparent_60%)]" />
            <ul className="relative flex flex-1 flex-col justify-center gap-2">
              {navigation.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: luxeEase }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-serif text-[2.4rem] font-light leading-tight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
                  >
                    <span className="font-sans text-[0.62rem] font-semibold tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: luxeEase }}
              className="relative flex flex-col gap-6 border-t border-ivory/10 pt-8"
            >
              <ButtonLink href={buildWhatsApp()} icon={<WhatsAppIcon size={16} className="relative" />}>
                {ui.whatsappUs}
              </ButtonLink>
              <SocialLinksList social={site.social} className="justify-center" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
