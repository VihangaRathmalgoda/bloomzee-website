/**
 * Type definitions for all website content.
 * Every section of the site is rendered from an object that matches `SiteData`.
 */

/** Names of icons available to services / about pillars (see src/components/ui/Icon.tsx). */
export type IconName =
  | 'crown'
  | 'flower'
  | 'sparkles'
  | 'lamp'
  | 'gem'
  | 'heart'
  | 'palette'
  | 'truck'
  | 'hammer'
  | 'shieldCheck'
  | 'clock'
  | 'star'
  | 'tent'
  | 'armchair'
  | 'camera'
  | 'calendar'
  | 'handshake'
  | 'leaf';

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface SiteInfo {
  name: string;
  /** Short name / monogram shown in compact spaces (e.g. "PS"). */
  shortName: string;
  tagline: string;
  description: string;
  /** Optional full logo image (shown large in the footer). When empty, a typographic logo is rendered from `name`. */
  logo?: string;
  /** Optional compact logo mark / monogram (shown next to the name in the navbar). */
  logoMark?: string;
  favicon: string;
  /** Public URL of the site, used for SEO / Open Graph. */
  url: string;
  /** Image used when the site is shared on social media. */
  ogImage: string;
  /** Language / locale used for SEO. */
  locale: string;
  phone: string;
  /** WhatsApp number in international format without "+" or spaces, e.g. 94771234567 */
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  /** Optional Google Maps embed URL for the contact section. */
  googleMapsEmbedUrl?: string;
  social: SocialLinks;
}

export interface NavItem {
  label: string;
  /** Section anchor such as "#poruwas" */
  href: string;
}

export interface HeroData {
  eyebrow: string;
  title: string;
  /** Part of the title rendered in an accent (italic gold) style. */
  titleAccent?: string;
  subtitle: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryCta: string;
  secondaryCta: string;
  /** Small keywords shown along the bottom of the hero. */
  highlights: string[];
}

export interface Poruwa {
  id: number | string;
  name: string;
  shortDescription: string;
  description: string;
  /** First image is the cover image. */
  images: string[];
  /**
   * Optional transparent-background image (PNG/WebP) shown floating in the 3D carousel.
   * When omitted, the carousel shows the first image in a framed card.
   */
  cutout?: string;
  /** Optional - leave undefined to show "Price on request". */
  price?: string;
  featured?: boolean;
  availability?: string;
  tags?: string[];
  features?: string[];
}

export interface CategoryItem {
  id: number | string;
  name: string;
  shortDescription: string;
  description?: string;
  /** First image is the cover image. */
  images: string[];
  /** Set true (together with `cutout`) to also show this item in the 3D carousel. */
  featured?: boolean;
  /** Transparent-background image (PNG/WebP) used in the 3D carousel. */
  cutout?: string;
  /** Short labels shown with the item in the carousel, e.g. ["Backdrop"]. */
  tags?: string[];
  price?: string;
  availability?: string;
  features?: string[];
}

export interface Category {
  /** Used for filtering, e.g. "floral" */
  id: string;
  /** Full name, e.g. "Floral Decorations" */
  name: string;
  /** Short label used in the filter bar, e.g. "Floral" */
  filterLabel: string;
  description: string;
  items: CategoryItem[];
}

export interface Service {
  title: string;
  description: string;
  icon: IconName;
  image: string;
}

export interface GalleryImage {
  image: string;
  title: string;
  category: string;
  /** Aspect ratio of the image (width / height). Prevents layout shift in the masonry grid. */
  aspectRatio?: number;
}

export interface AboutPillar {
  icon: IconName;
  title: string;
  description: string;
}

export interface AboutData {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  images: string[];
  pillars: AboutPillar[];
}

export interface WorkingHours {
  days: string;
  hours: string;
}

export interface ContactData {
  eyebrow: string;
  title: string;
  description: string;
  workingHours: WorkingHours[];
}

export interface FinalCtaData {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
}

export interface SectionCopy {
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro?: string;
}

export interface FooterData {
  description: string;
  /** Use {year} and {name} as placeholders. */
  copyright: string;
  note?: string;
}

/** Message templates for WhatsApp links. Use {product} and {name} as placeholders. */
export interface WhatsAppMessages {
  general: string;
  poruwa: string;
  item: string;
  journey: string;
}

/** Labels for buttons & small interface text. */
export interface UiLabels {
  viewDetails: string;
  viewAllPoruwas: string;
  showFewerPoruwas: string;
  inquireWhatsApp: string;
  priceOnRequest: string;
  whatsappUs: string;
  callNow: string;
  getDirections: string;
  chatWithUs: string;
  allFilter: string;
  poruwaFilter: string;
  features: string;
  availability: string;
  price: string;
  scroll: string;
  workingHours: string;
  followUs: string;
  navigation: string;
  contact: string;
  phoneLabel: string;
  whatsappLabel: string;
  emailLabel: string;
  addressLabel: string;
}

export interface SiteData {
  site: SiteInfo;
  navigation: NavItem[];
  hero: HeroData;
  sections: {
    poruwas: SectionCopy;
    collections: SectionCopy;
    services: SectionCopy;
    gallery: SectionCopy;
  };
  poruwas: Poruwa[];
  categories: Category[];
  services: Service[];
  gallery: GalleryImage[];
  about: AboutData;
  finalCta: FinalCtaData;
  contact: ContactData;
  footer: FooterData;
  whatsappMessages: WhatsAppMessages;
  ui: UiLabels;
}
