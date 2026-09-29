import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Category, CategoryItem, Poruwa } from '../types/site';
import { useSiteData } from '../context/SiteDataContext';
import { PoruwaCarousel } from './PoruwaCarousel';
import { ProductCard } from './ProductCard';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal, luxeEase } from './ui/Reveal';
import { Button } from './ui/Button';

interface PoruwaSectionProps {
  onOpen: (poruwa: Poruwa) => void;
  onOpenItem: (item: CategoryItem, category: Category) => void;
  modalOpen: boolean;
}

export function PoruwaSection({ onOpen, onOpenItem, modalOpen }: PoruwaSectionProps) {
  const { poruwas, categories, sections, ui } = useSiteData();
  const [showAll, setShowAll] = useState(false);

  // The carousel shows the featured Poruwas, followed by any décor item marked
  // `featured` that has a transparent `cutout` image. Each remembers how to open
  // its own detail window (Poruwa vs. décor item).
  const { carouselItems, openers } = useMemo(() => {
    const featured = poruwas.filter((p) => p.featured !== false);
    const items: Poruwa[] = [...(featured.length ? featured : poruwas)];
    const map = new Map<Poruwa, () => void>(items.map((p) => [p, () => onOpen(p)]));
    for (const category of categories) {
      for (const item of category.items) {
        if (!item.featured || !item.cutout) continue;
        const asCarouselItem: Poruwa = {
          id: `${category.id}:${item.id}`,
          name: item.name,
          shortDescription: item.shortDescription,
          description: item.description ?? item.shortDescription,
          images: item.images,
          cutout: item.cutout,
          tags: item.tags ?? [category.filterLabel],
        };
        items.push(asCarouselItem);
        map.set(asCarouselItem, () => onOpenItem(item, category));
      }
    }
    return { carouselItems: items, openers: map };
  }, [poruwas, categories, onOpen, onOpenItem]);

  const openFromCarousel = (item: Poruwa) => openers.get(item)?.();
  const copy = sections.poruwas;

  if (!poruwas.length) return null;

  return (
    <section id="poruwas" aria-labelledby="poruwas-title" className="relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-40">
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] h-[46rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(184,149,96,0.14),transparent_62%)]"
      />

      <div className="relative mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading id="poruwas-title" number="01" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.intro} />
      </div>

      <Reveal className="relative mt-14 sm:mt-20" y={40}>
        <PoruwaCarousel poruwas={carouselItems} onOpen={openFromCarousel} paused={modalOpen} />
      </Reveal>

      <div className="relative mx-auto mt-14 flex max-w-site flex-col items-center px-5 sm:px-8">
        <Button
          variant="outline"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          aria-controls="all-poruwas"
          icon={
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={`relative transition-transform duration-500 ease-luxe ${showAll ? 'rotate-180' : ''}`}
            />
          }
        >
          {showAll ? ui.showFewerPoruwas : ui.viewAllPoruwas}
        </Button>

        <AnimatePresence initial={false}>
          {showAll && (
            <motion.div
              id="all-poruwas"
              key="all"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.9, ease: luxeEase }}
              className="w-full overflow-hidden"
            >
              <div className="grid gap-x-6 gap-y-12 pt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
                {poruwas.map((p) => (
                  <ProductCard
                    key={p.id}
                    tone="dark"
                    name={p.name}
                    shortDescription={p.shortDescription}
                    image={p.images[0]}
                    price={p.price}
                    onClick={() => onOpen(p)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
