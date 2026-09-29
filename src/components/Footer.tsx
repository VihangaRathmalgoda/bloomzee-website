import { useSiteData } from '../context/SiteDataContext';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { fillTemplate, mailUrl, telUrl } from '../lib/links';
import { Logo } from './Logo';
import { SocialLinksList } from './ui/BrandIcons';
import { LotusDivider } from './ui/LotusDivider';

export function Footer() {
  const { site, navigation, footer, ui } = useSiteData();
  const buildWhatsApp = useWhatsApp();
  const copyright = fillTemplate(footer.copyright, { year: String(new Date().getFullYear()), name: site.name });

  const heading = 'text-[0.62rem] font-semibold uppercase tracking-luxe text-gold';
  const link = 'text-sm text-ivory/70 transition-colors hover:text-gold-light';

  return (
    <footer className="relative bg-ink text-ivory">
      <LotusDivider size="lg" className="mx-auto max-w-site -translate-y-1/2" />
      <div className="mx-auto grid max-w-site gap-14 px-5 py-20 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="full" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone-light">{footer.description}</p>
          <SocialLinksList social={site.social} className="mt-8" />
        </div>

        <nav aria-label="Footer">
          <h2 className={heading}>{ui.navigation}</h2>
          <ul className="mt-6 space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={link}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={heading}>{ui.contact}</h2>
          <address className="mt-6 space-y-3 not-italic">
            <p><a href={telUrl(site.phone)} className={link}>{site.phone}</a></p>
            <p><a href={buildWhatsApp()} target="_blank" rel="noopener noreferrer" className={link}>{ui.whatsappLabel} · +{site.whatsapp}</a></p>
            <p><a href={mailUrl(site.email)} className={`${link} break-all`}>{site.email}</a></p>
            <p><a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={link}>{site.address}</a></p>
          </address>
        </div>
      </div>

      <div className="border-t border-ivory/[0.07]">
        <div className="mx-auto flex max-w-site flex-col gap-2 px-5 py-7 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>{copyright}</p>
          <p className="font-serif text-sm italic text-ivory/40">{footer.note ?? site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
