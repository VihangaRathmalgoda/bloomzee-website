import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { siteData } from './src/data/siteData';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Injects SEO metadata from siteData.ts into index.html so crawlers see it without running JS. */
function seoFromSiteData(): Plugin {
  const { site, hero } = siteData;
  const absolute = (path: string) => (path.startsWith('http') ? path : `${site.url.replace(/\/$/, '')}${path}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: site.name,
    description: site.description,
    url: site.url,
    image: absolute(site.ogImage),
    telephone: site.phone,
    email: site.email,
    address: site.address,
    sameAs: Object.values(site.social).filter(Boolean),
  };
  const values: Record<string, string> = {
    SEO_TITLE: escapeHtml(`${site.name} — ${site.tagline}`),
    SEO_NAME: escapeHtml(site.name),
    SEO_DESCRIPTION: escapeHtml(site.description),
    SEO_URL: escapeHtml(site.url),
    SEO_FAVICON: escapeHtml(site.favicon),
    SEO_FAVICON_TYPE: site.favicon.endsWith('.svg')
      ? 'image/svg+xml'
      : site.favicon.endsWith('.ico')
        ? 'image/x-icon'
        : `image/${site.favicon.split('.').pop()}`,
    SEO_OG_IMAGE: escapeHtml(absolute(site.ogImage)),
    SEO_LOCALE: escapeHtml(site.locale),
    SEO_HERO_IMAGE: escapeHtml(hero.image),
    SEO_JSONLD: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
  };

  return {
    name: 'seo-from-site-data',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(/%(SEO_[A-Z_]+)%/g, (match, key: string) => values[key] ?? match),
    },
  };
}

export default defineConfig({
  plugins: [react(), seoFromSiteData()],
  server: {
    // /sample holds original source images only; watching it can crash on Windows
    // while a large file is still being written (EBUSY).
    watch: { ignored: ['**/sample/**'] },
  },
});
