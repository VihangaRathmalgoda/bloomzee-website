import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { SmartImage } from './ui/SmartImage';
import { CurtainReveal } from './ui/CurtainReveal';
import { luxeEase } from './ui/Reveal';

interface ProductCardProps {
  name: string;
  shortDescription: string;
  image: string;
  price?: string;
  label?: string;
  onClick: () => void;
  className?: string;
  /** 'light' for ivory sections, 'dark' for dark sections. */
  tone?: 'light' | 'dark';
}

export function ProductCard({ name, shortDescription, image, price, label, onClick, className = '', tone = 'light' }: ProductCardProps) {
  const { ui } = useSiteData();
  const dark = tone === 'dark';
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12, transition: { duration: 0.3 } }}
      transition={{ duration: 0.8, ease: luxeEase }}
      className={`group ${className}`}
    >
      <button
        type="button"
        onClick={onClick}
        className={`block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 ${dark ? 'focus-visible:ring-offset-ink' : 'focus-visible:ring-offset-ivory'}`}
        aria-label={`${name} — ${ui.viewDetails}`}
      >
        <CurtainReveal tone={dark ? 'ink' : 'ivory'} className="relative aspect-[4/5] rounded-[1rem]">
          <SmartImage
            src={image}
            alt={name}
            className="transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
          {label && (
            <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ink backdrop-blur">
              {label}
            </span>
          )}
          <span
            aria-hidden="true"
            className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-ivory text-ink opacity-0 transition duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ArrowUpRight size={18} strokeWidth={1.5} />
          </span>
        </CurtainReveal>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h4 className={`font-serif text-2xl leading-tight ${dark ? 'text-ivory' : 'text-ink'}`}>{name}</h4>
            <p className={`mt-1.5 text-sm leading-relaxed ${dark ? 'text-stone-light' : 'text-ink-500/80'}`}>{shortDescription}</p>
          </div>
          {price && <p className="shrink-0 pt-1 font-serif text-lg text-gold-dark">{price}</p>}
        </div>
        <span className={`mt-4 inline-flex items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.25em] ${dark ? 'text-gold-light' : 'text-gold-dark'}`}>
          <span className="h-px w-6 bg-gold-dark/60 transition-all duration-500 ease-luxe group-hover:w-10" aria-hidden="true" />
          {ui.viewDetails}
        </span>
      </button>
    </motion.article>
  );
}
