import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import type { Category, CategoryItem, Poruwa } from '../types/site';
import { useSiteData } from '../context/SiteDataContext';
import { ProductCard } from './ProductCard';
import { SectionHeading } from './ui/SectionHeading';
import { luxeEase } from './ui/Reveal';

const PORUWA_FILTER = '__poruwa';
const ALL_FILTER = '__all';

interface CategorySectionProps {
  onOpenPoruwa: (poruwa: Poruwa) => void;
  onOpenItem: (item: CategoryItem, category: Category) => void;
}

/**
 * "The Collection" — every category from siteData with an animated filter.
 * "All" shows each category as its own horizontally scrolling row;
 * a single filter shows that category as a grid.
 */
export function CategorySection({ onOpenPoruwa, onOpenItem }: CategorySectionProps) {
  const { categories, poruwas, sections, ui } = useSiteData();
  const [filter, setFilter] = useState(ALL_FILTER);

  const visibleCategories = useMemo(() => categories.filter((c) => c.items.length > 0), [categories]);

  const filters = [
    { id: ALL_FILTER, label: ui.allFilter },
    ...(poruwas.length ? [{ id: PORUWA_FILTER, label: ui.poruwaFilter }] : []),
    ...visibleCategories.map((c) => ({ id: c.id, label: c.filterLabel })),
  ];

  const copy = sections.collections;
  if (!visibleCategories.length && !poruwas.length) return null;

  return (
    <section id="collections" aria-labelledby="collections-title" className="relative bg-ivory py-24 text-ink sm:py-32 lg:py-40">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading id="collections-title" number="02" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} tone="light" />

        {/* Filter */}
        <LayoutGroup id="collection-filter">
          <div
            role="tablist"
            aria-label="Filter collection"
            className="no-scrollbar -mx-5 mt-14 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
          >
            {filters.map((f) => {
              const selected = filter === f.id;
              return (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="collection-panel"
                  onClick={() => setFilter(f.id)}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                    selected ? 'text-ivory' : 'text-ink-500 hover:text-ink'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div id="collection-panel" role="tabpanel" className="mt-14 sm:mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: luxeEase }}
            >
              {filter === ALL_FILTER && (
                <div className="space-y-20 sm:space-y-24">
                  {poruwas.length > 0 && (
                    <CategoryRow title={ui.poruwaFilter} description={copy.intro}>
                      {poruwas.map((p) => (
                        <ProductCard
                          key={p.id}
                          name={p.name}
                          shortDescription={p.shortDescription}
                          image={p.images[0]}
                          price={p.price}
                          onClick={() => onOpenPoruwa(p)}
                          className="w-[78vw] shrink-0 snap-start sm:w-[22rem]"
                        />
                      ))}
                    </CategoryRow>
                  )}
                  {visibleCategories.map((category) => (
                    <CategoryRow key={category.id} title={category.name} description={category.description}>
                      {category.items.map((item) => (
                        <ProductCard
                          key={item.id}
                          name={item.name}
                          shortDescription={item.shortDescription}
                          image={item.images[0]}
                          price={item.price}
                          onClick={() => onOpenItem(item, category)}
                          className="w-[78vw] shrink-0 snap-start sm:w-[22rem]"
                        />
                      ))}
                    </CategoryRow>
                  ))}
                </div>
              )}

              {filter === PORUWA_FILTER && (
                <Grid>
                  {poruwas.map((p) => (
                    <ProductCard
                      key={p.id}
                      name={p.name}
                      shortDescription={p.shortDescription}
                      image={p.images[0]}
                      price={p.price}
                      onClick={() => onOpenPoruwa(p)}
                    />
                  ))}
                </Grid>
              )}

              {visibleCategories
                .filter((c) => c.id === filter)
                .map((category) => (
                  <div key={category.id}>
                    <p className="mx-auto mb-12 max-w-xl text-center text-sm leading-relaxed text-ink-500">{category.description}</p>
                    <Grid>
                      {category.items.map((item) => (
                        <ProductCard
                          key={item.id}
                          name={item.name}
                          shortDescription={item.shortDescription}
                          image={item.images[0]}
                          price={item.price}
                          onClick={() => onOpenItem(item, category)}
                        />
                      ))}
                    </Grid>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">{children}</div>;
}

function CategoryRow({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h3 className="font-serif text-3xl font-light sm:text-4xl">{title}</h3>
        {description && <p className="max-w-md text-sm leading-relaxed text-ink-500 sm:text-right">{description}</p>}
      </div>
      <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-5 px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:gap-8">
        {children}
      </div>
    </div>
  );
}
