import { useSiteData } from '../context/SiteDataContext';

interface LogoProps {
  /** 'compact' = mark + name (navbar); 'full' = the full logo image (footer). */
  variant?: 'compact' | 'full';
  className?: string;
}

/** Logo from siteData, falling back to a typographic mark when no images are set. */
export function Logo({ variant = 'compact', className = '' }: LogoProps) {
  const { site } = useSiteData();

  if (variant === 'full' && site.logo) {
    return <img src={site.logo} alt={site.name} loading="lazy" decoding="async" className={`h-auto w-44 sm:w-52 ${className}`} />;
  }

  // Compact with no mark but a full logo: show the logo itself, sized for a navbar.
  if (!site.logoMark && site.logo) {
    return <img src={site.logo} alt={site.name} className={`h-12 w-auto ${className}`} />;
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      {site.logoMark ? (
        <img src={site.logoMark} alt="" aria-hidden="true" className="h-11 w-auto" />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/60 font-serif text-[0.95rem] italic text-gold-light"
        >
          {site.shortName}
        </span>
      )}
      <span className="text-foil font-serif text-[1.4rem] font-normal leading-none tracking-wide">{site.name}</span>
    </span>
  );
}
