import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { mailUrl, telUrl } from '../lib/links';
import { ButtonLink } from './ui/Button';
import { SocialLinksList, WhatsAppIcon } from './ui/BrandIcons';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';

export function Contact() {
  const { contact, site, ui } = useSiteData();
  const buildWhatsApp = useWhatsApp();

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-ink-800 py-24 text-ivory sm:py-32 lg:py-40">
      <div className="mx-auto max-w-site px-5 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <SectionHeading
              id="contact-title"
              number="06"
              eyebrow={contact.eyebrow}
              title={contact.title}
              subtitle={contact.description}
              align="left"
            />
            <Reveal delay={0.2} className="mt-11 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={buildWhatsApp()} icon={<WhatsAppIcon size={16} className="relative" />}>
                {ui.whatsappUs}
              </ButtonLink>
              <ButtonLink href={telUrl(site.phone)} variant="outline" icon={<Phone size={15} strokeWidth={1.5} className="relative" />}>
                {ui.callNow}
              </ButtonLink>
              <ButtonLink href={site.googleMapsUrl} variant="outline" icon={<Navigation size={15} strokeWidth={1.5} className="relative" />}>
                {ui.getDirections}
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <dl className="divide-y divide-ivory/10 border-y border-ivory/10">
              <ContactRow icon={<Phone size={18} strokeWidth={1.25} />} label={ui.phoneLabel}>
                <a href={telUrl(site.phone)} className="hover:text-gold-light">{site.phone}</a>
              </ContactRow>
              <ContactRow icon={<WhatsAppIcon size={18} />} label={ui.whatsappLabel}>
                <a href={buildWhatsApp()} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">
                  +{site.whatsapp}
                </a>
              </ContactRow>
              <ContactRow icon={<Mail size={18} strokeWidth={1.25} />} label={ui.emailLabel}>
                <a href={mailUrl(site.email)} className="break-all hover:text-gold-light">{site.email}</a>
              </ContactRow>
              <ContactRow icon={<MapPin size={18} strokeWidth={1.25} />} label={ui.addressLabel}>
                <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-light">
                  {site.address}
                </a>
              </ContactRow>
              {contact.workingHours.length > 0 && (
                <ContactRow icon={<Clock size={18} strokeWidth={1.25} />} label={ui.workingHours}>
                  <ul className="space-y-1">
                    {contact.workingHours.map((wh) => (
                      <li key={wh.days} className="flex flex-wrap justify-between gap-x-6">
                        <span>{wh.days}</span>
                        <span className="text-stone-light">{wh.hours}</span>
                      </li>
                    ))}
                  </ul>
                </ContactRow>
              )}
            </dl>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[0.64rem] font-semibold uppercase tracking-luxe text-ivory/50">{ui.followUs}</p>
              <SocialLinksList social={site.social} />
            </div>
          </Reveal>
        </div>

        {site.googleMapsEmbedUrl && (
          <Reveal className="mt-20 overflow-hidden rounded-[1.25rem] border border-ivory/10">
            <iframe
              src={site.googleMapsEmbedUrl}
              title={`${site.name} location`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full grayscale-[0.6] invert-[0.9] hue-rotate-180 sm:h-96"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-5 py-6">
      <span className="mt-0.5 text-gold" aria-hidden="true">{icon}</span>
      <div className="min-w-0 flex-1">
        <dt className="text-[0.62rem] font-semibold uppercase tracking-luxe text-ivory/50">{label}</dt>
        <dd className="mt-2 font-serif text-xl leading-snug text-ivory transition-colors [font-variant-numeric:lining-nums]">{children}</dd>
      </div>
    </div>
  );
}
