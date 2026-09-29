import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import type { CategoryItem, Poruwa } from '../types/site';
import { useSiteData } from '../context/SiteDataContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Dialog } from './ui/Dialog';
import { SmartImage } from './ui/SmartImage';
import { ButtonLink } from './ui/Button';
import { WhatsAppIcon } from './ui/BrandIcons';
import { luxeEase } from './ui/Reveal';
import { LotusDivider } from './ui/LotusDivider';

export type ProductSelection =
  | { kind: 'poruwa'; item: Poruwa; categoryName?: string }
  | { kind: 'item'; item: CategoryItem; categoryName?: string };

interface ProductModalProps {
  selection: ProductSelection | null;
  onClose: () => void;
}

export function ProductModal({ selection, onClose }: ProductModalProps) {
  const { ui } = useSiteData();
  const buildWhatsApp = useWhatsApp();
  const [imageIndex, setImageIndex] = useState(0);

  // Remember the last selection so the exit animation still has content.
  const [shown, setShown] = useState(selection);
  useEffect(() => {
    if (selection) {
      setShown(selection);
      setImageIndex(0);
    }
  }, [selection]);

  const item = shown?.item;
  const tags = shown?.kind === 'poruwa' ? shown.item.tags : undefined;
  const description = item?.description || item?.shortDescription;

  return (
    <Dialog
      open={!!selection}
      onClose={onClose}
      label={item?.name ?? ''}
      className="h-full w-full max-w-6xl overflow-y-auto bg-ink-800 sm:h-auto sm:max-h-[92vh] sm:rounded-[1.5rem] sm:border sm:border-ivory/10"
    >
      {item && (
        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          {/* Images */}
          <div className="relative bg-ink-900 p-3 sm:p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] sm:aspect-square lg:aspect-[1/1.05]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={item.images[imageIndex]}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: luxeEase }}
                >
                  <SmartImage src={item.images[imageIndex]} alt={`${item.name} — image ${imageIndex + 1}`} priority />
                </motion.div>
              </AnimatePresence>
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[0.7rem] border border-gold-light/20" />
            </div>

            {item.images.length > 1 && (
              <div className="mt-3 flex gap-3" role="group" aria-label="Images">
                {item.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === imageIndex ? 'true' : undefined}
                    className={`relative aspect-square w-16 overflow-hidden rounded-lg transition duration-500 ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:w-20 ${
                      i === imageIndex ? 'opacity-100 ring-1 ring-gold' : 'opacity-50 hover:opacity-90'
                    }`}
                  >
                    <SmartImage src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col px-6 pb-10 pt-8 sm:px-10 sm:pt-12 lg:pb-12">
            <p className="text-[0.66rem] font-semibold uppercase tracking-luxe text-gold">
              {shown?.kind === 'poruwa' ? ui.poruwaFilter : shown?.categoryName}
              {tags?.length ? <span className="text-stone"> · {tags.join(' · ')}</span> : null}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-light leading-[1.05] text-ivory sm:text-5xl">{item.name}</h2>
            <LotusDivider size="sm" align="left" className="my-7" />
            {description && <p className="text-[0.95rem] leading-relaxed text-stone-light">{description}</p>}

            {!!item.features?.length && (
              <div className="mt-8">
                <h3 className="text-[0.66rem] font-semibold uppercase tracking-luxe text-ivory/70">{ui.features}</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-ivory/85">
                      <Check size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="mt-8 grid gap-5 border-t border-ivory/10 pt-7 sm:grid-cols-2">
              <div>
                <dt className="text-[0.66rem] font-semibold uppercase tracking-luxe text-ivory/60">{ui.price}</dt>
                <dd className="mt-2 font-serif text-2xl text-ivory">{item.price ?? ui.priceOnRequest}</dd>
              </div>
              {item.availability && (
                <div>
                  <dt className="text-[0.66rem] font-semibold uppercase tracking-luxe text-ivory/60">{ui.availability}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ivory/85">{item.availability}</dd>
                </div>
              )}
            </dl>

            <div className="mt-10 lg:mt-auto lg:pt-10">
              <ButtonLink
                data-autofocus
                href={buildWhatsApp(shown?.kind === 'poruwa' ? 'poruwa' : 'item', item.name)}
                icon={<WhatsAppIcon size={18} className="relative" />}
                className="w-full sm:w-auto"
              >
                {ui.inquireWhatsApp}
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
