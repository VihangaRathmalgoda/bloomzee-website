# Poruwa & Wedding Decoration Website

React + Vite + TypeScript + Tailwind CSS + Framer Motion.

## Run

```bash
npm install
npm run dev        # development server
npm run build      # type-check + production build (outputs to /dist)
npm run preview    # serve the production build locally
```

## Updating content: one file

**All** text, contact details, products, categories, services, gallery and image paths live in
[`src/data/siteData.ts`](src/data/siteData.ts). No component needs to change.

Entries marked `TODO` are placeholders. Replace them with your real details before publishing.

### Add a Poruwa

Add an object to `poruwas`:

```ts
{
  id: 7,
  name: 'New Poruwa',
  shortDescription: 'One line shown under the carousel.',
  description: 'Full description shown in the detail window.',
  images: ['/images/poruwa/new-poruwa.jpg', '/images/poruwa/new-poruwa-2.jpg'],
  featured: true,           // shown in the curved carousel
  price: 'LKR 00,000',      // optional (omit to show "Price on request")
  availability: '...',      // optional
  tags: ['Traditional'],    // optional
  features: ['...'],        // optional
}
```

### Add a category or item

Add to `categories`. Each category automatically gets a filter button and its own row.

## Images

Put photos in `public/images/` (`poruwa/`, `decorations/`, `gallery/`, `services/`) and reference
them as `/images/...` in `siteData.ts`. The bundled `.svg` files are illustrated placeholders.
Replace them with your own photos and update the paths.

Recommended: Poruwa photos in **4:5 portrait**, around 1200×1500px, as compressed `.jpg` or `.webp`
(ideally under 300 KB each). The hero and final CTA images look best at 1920×1080 or larger.
For gallery images, set `aspectRatio` (width / height) to match each photo.

## Moving to an API later

Components read data through `useSiteData()`. The data is loaded in
[`src/services/siteService.ts`](src/services/siteService.ts) by `getSiteData()`. Change that
function to `fetch('/api/site')` and nothing else needs to change.

## SEO

Title, description, Open Graph tags and LocalBusiness structured data are generated from
`siteData.ts` at build time (see `vite.config.ts`). Set `site.url` and `site.ogImage` (a
1200×630 `.jpg`) before publishing.
