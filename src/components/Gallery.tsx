import { useState } from 'react';
import { Expand } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { SectionHeading } from './ui/SectionHeading';
import { SmartImage } from './ui/SmartImage';
import { CurtainReveal } from './ui/CurtainReveal';
import { Lightbox } from './Lightbox';

export function Gallery() {
  const { gallery, sections } = useSiteData();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const copy = sections.gallery;
  if (!gallery.length) return null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-ivory py-24 text-ink sm:py-32 lg:py-40">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading id="gallery-title" number="04" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} tone="light" />

        {/* Masonry via CSS columns — aspect ratios from siteData prevent layout shift */}
        <ul className="mt-16 columns-1 gap-5 sm:mt-20 sm:columns-2 lg:columns-3 lg:gap-6">
          {gallery.map((item, i) => (
            <li key={`${item.image}-${i}`} className="mb-5 break-inside-avoid lg:mb-6">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`Open image: ${item.title}`}
                  className="group relative block w-full overflow-hidden rounded-[1rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ivory"
                  style={{ aspectRatio: item.aspectRatio ?? 4 / 5 }}
                >
                  <CurtainReveal tone="ivory" delay={(i % 3) * 0.12} className="absolute inset-0">
                    <SmartImage src={item.image} alt={item.title} className="transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.05]" />
                  </CurtainReveal>
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between gap-4 p-5 text-left text-ivory opacity-0 transition duration-700 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span>
                      <span className="block text-[0.6rem] font-semibold uppercase tracking-luxe text-gold-light">{item.category}</span>
                      <span className="mt-1 block font-serif text-xl">{item.title}</span>
                    </span>
                    <Expand size={18} strokeWidth={1.25} aria-hidden="true" />
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox images={gallery} index={openIndex} onClose={() => setOpenIndex(null)} onChange={setOpenIndex} />
    </section>
  );
}
