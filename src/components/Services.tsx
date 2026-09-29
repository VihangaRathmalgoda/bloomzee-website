import { useSiteData } from '../context/SiteDataContext';
import { Icon } from './ui/Icon';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { SmartImage } from './ui/SmartImage';

export function Services() {
  const { services, sections } = useSiteData();
  const copy = sections.services;
  if (!services.length) return null;

  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-ink-800 py-24 text-ivory sm:py-32 lg:py-40">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <SectionHeading id="services-title" number="03" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] border border-ivory/[0.08] bg-ivory/[0.08] sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.title} className="bg-ink-800">
              <Reveal delay={(i % 3) * 0.1} className="group relative h-full overflow-hidden">
                {/* Image reveals softly on hover */}
                <div aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-luxe group-hover:opacity-100">
                  <SmartImage src={service.image} alt="" className="scale-105 transition-transform duration-[2s] ease-luxe group-hover:scale-100" />
                  <span className="absolute inset-0 bg-ink/80" />
                </div>
                <div className="relative flex h-full min-h-[18rem] flex-col p-8 sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/40 text-gold-light transition-colors duration-700 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      <Icon name={service.icon} size={22} strokeWidth={1.25} />
                    </span>
                    <span className="font-serif text-lg italic text-ivory/30">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-auto pt-12 font-serif text-[1.9rem] font-light leading-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-light">{service.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
