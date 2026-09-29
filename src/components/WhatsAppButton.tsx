import { motion } from 'framer-motion';
import { useSiteData } from '../context/SiteDataContext';
import { useIntroDelay } from '../context/IntroContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { WhatsAppIcon } from './ui/BrandIcons';
import { luxeEase } from './ui/Reveal';

export function WhatsAppButton() {
  const { ui } = useSiteData();
  const buildWhatsApp = useWhatsApp();
  const introDelay = useIntroDelay();

  return (
    <motion.a
      href={buildWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ui.chatWithUs}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: introDelay + 2.2, ease: luxeEase }}
      className="group fixed bottom-5 right-5 z-40 flex items-center focus-visible:outline-none sm:bottom-8 sm:right-8"
    >
      {/* Tooltip */}
      <span className="pointer-events-none mr-3 hidden translate-x-2 whitespace-nowrap rounded-full border border-ivory/10 bg-ink/85 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-ivory opacity-0 backdrop-blur-md transition duration-500 ease-luxe group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block">
        {ui.chatWithUs}
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-[0_12px_40px_-8px_rgba(184,149,96,0.7)] transition duration-500 ease-luxe group-hover:bg-gold-light group-focus-visible:ring-2 group-focus-visible:ring-ivory group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink">
        <span aria-hidden="true" className="absolute inset-0 animate-soft-pulse rounded-full bg-gold motion-reduce:hidden" />
        <WhatsAppIcon size={24} className="relative" />
      </span>
    </motion.a>
  );
}
