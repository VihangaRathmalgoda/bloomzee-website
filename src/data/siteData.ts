import type { SiteData } from '../types/site';

/**
 * ============================================================================
 *  SITE DATA — the ONE file that controls all website content.
 * ============================================================================
 *
 *  • Edit text, contact details, products, services and images here.
 *  • No React component needs to change when you update this file.
 *  • Images live in /public/images/... and are referenced as "/images/...".
 *
 *  ⚠️ PLACEHOLDERS: Anything marked "TODO" is placeholder content. Replace it
 *  with your real business details before publishing. Any remaining .svg
 *  images (a few décor items) are illustrated placeholders — drop real photos
 *  into /public/images/ and update the paths below.
 *
 *  Adding a new Poruwa is as simple as adding one more object to `poruwas`.
 * ============================================================================
 */
export const siteData: SiteData = {
  site: {
    name: 'BloomZee',
    shortName: 'BZ', // text monogram, used only when no logoMark image is set
    tagline: 'Elegant Poruwa & Wedding Decorations',
    description:
      'Handcrafted traditional Poruwas and refined wedding décor for Sri Lankan celebrations — designed, delivered and styled with care for your most meaningful moment.',
    // Images must live in /public — e.g. /public/images/logo.webp is referenced as '/images/logo.webp'.
    logo: '/images/logo.webp', // full logo, shown in the footer (leave empty for a text logo)
    logoMark: '/images/logo-mark.webp', // BZ monogram, shown next to the name in the navbar
    favicon: '/favicon.png',
    url: 'https://www.example.com', // TODO: your website address
    ogImage: '/images/og-image.jpg', // 1200×630 image used when the site is shared
    locale: 'en_LK',
    phone: '+94 77 000 0000', // TODO
    whatsapp: '94770000000', // TODO: international format, digits only
    email: 'hello@example.com', // TODO
    address: 'Colombo, Sri Lanka', // TODO: full address
    googleMapsUrl: 'https://maps.google.com/?q=Colombo,Sri+Lanka', // TODO
    googleMapsEmbedUrl: '', // optional: paste a Google Maps "Embed a map" src URL
    social: {
      facebook: 'https://facebook.com/', // TODO
      instagram: 'https://instagram.com/', // TODO
      tiktok: 'https://tiktok.com/', // TODO
    },
  },

  navigation: [
    { label: 'Home', href: '#home' },
    { label: 'Poruwas', href: '#poruwas' },
    { label: 'Decorations', href: '#collections' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Crafting Beautiful Beginnings',
    title: 'Luxury Poruwa',
    titleAccent: '& Wedding Decorations',
    subtitle: 'Traditional Sri Lankan elegance, thoughtfully styled',
    description:
      'Signature Poruwas and bespoke wedding décor, crafted with reverence for tradition and a modern eye for detail — so the moment you step onto the Poruwa feels timeless.',
    image: '/images/hero-poruwa.webp',
    imageAlt: 'A round Poruwa canopy draped in cascading strands of jasmine garlands, with paddy sheaves in white urns',
    primaryCta: 'Explore Our Poruwas',
    secondaryCta: 'WhatsApp Us',
    highlights: ['Poruwa', 'Wedding', 'Floral', 'Decoration'],
  },

  sections: {
    poruwas: {
      eyebrow: 'Our Signature Poruwas',
      title: 'Designed to make your most beautiful moment unforgettable.',
      intro:
        'Each Poruwa is prepared by hand — carved details, fresh florals and soft drapery composed to honour the Poruwa ceremony and frame the two of you beautifully.',
    },
    collections: {
      eyebrow: 'The Collection',
      title: 'Décor for every part of your day',
      subtitle:
        'From entrance to reception, every piece is chosen to complement your Poruwa and create one harmonious setting.',
    },
    services: {
      eyebrow: 'Services',
      title: 'Considered from setup to the final farewell',
      subtitle: 'We plan, deliver, style and dismantle — so your family can simply be present.',
    },
    gallery: {
      eyebrow: 'Gallery',
      title: 'Moments we have had the honour to style',
      subtitle: 'A glimpse of Poruwas and décor from recent celebrations.',
    },
  },

  /**
   * PORUWAS — the main product.
   * To add one, copy an object below, give it a new id, and set its images.
   * cutout (optional) is a transparent-background PNG/WebP shown floating in the carousel.
   * `price` is optional; leave it out to show "Price on request".
   */
  poruwas: [
    {
      id: 1,
      name: 'Jasmine Cascade Poruwa',
      shortDescription: 'A round canopy draped in hundreds of cascading jasmine garlands.',
      description:
        'A breathtaking circular Poruwa where strand after strand of jasmine garlands cascades from the canopy to the floor, forming soft floral columns around a round white platform finished with a golden lotus motif. White urns with golden paddy sheaves complete a setting that feels both traditional and serene.',
      images: [
        '/images/poruwa/jasmine-cascade.webp',
        '/images/poruwa/jasmine-cascade-detail.webp',
        '/images/poruwa/jasmine-cascade-base.webp',
      ],
      cutout: '/images/poruwa/jasmine-cascade-cutout.webp', // transparent image for the 3D carousel
      featured: true,
      availability: 'Available for booking — enquire for your date',
      tags: ['Floral', 'Traditional'],
      features: ['Cascading jasmine garland canopy', 'Round platform with golden lotus motif', 'Paddy sheaves in white urns', 'Setup & dismantling included'],
    },
    {
      id: 2,
      name: 'Ivory Drape Poruwa',
      shortDescription: 'Layered ivory swags, calla lilies and a traditional brass lamp.',
      description:
        'Graceful and serene. Generous ivory drapery is swept and layered into a sculpted canopy above a tiered round platform, ringed with calla lilies in glass vases and soft white blooms. A traditional brass lamp and betel leaves bring the customs of the Poruwa ceremony into the heart of the design.',
      images: [
        '/images/poruwa/ivory-drape.webp',
        '/images/poruwa/ivory-drape-detail.webp',
        '/images/poruwa/ivory-drape-base.webp',
      ],
      cutout: '/images/poruwa/ivory-drape-cutout.webp', // transparent image for the 3D carousel
      featured: true,
      availability: 'Available for booking — enquire for your date',
      tags: ['Elegant', 'Traditional'],
      features: ['Sculpted ivory swag canopy', 'Tiered round platform', 'Calla lilies & white florals', 'Brass lamp & betel leaf styling'],
    },
    {
      id: 3,
      name: 'Grand Pavilion Poruwa',
      shortDescription: 'Pearl-beaded swags, tasselled drapes and classic columns.',
      description:
        'A grand, timeless pavilion. Sheer ivory drapery with pearl-beaded swags and embroidered panels is gathered with tasselled tie-backs, framed by classical columns and set on a softly draped, stepped stage with a flowing aisle runner — made for elegant ballroom ceremonies.',
      images: [
        '/images/poruwa/grand-pavilion.webp',
        '/images/poruwa/grand-pavilion-detail.webp',
        '/images/poruwa/grand-pavilion-base.webp',
      ],
      cutout: '/images/poruwa/grand-pavilion-cutout.webp', // transparent image for the 3D carousel
      featured: true,
      availability: 'Available for booking — enquire for your date',
      tags: ['Grand', 'Classic'],
      features: ['Pearl-beaded swag canopy', 'Tasselled tie-back drapes', 'Classical columns', 'Draped stepped stage & aisle runner'],
    },
  ],

  /**
   * OTHER CATEGORIES — add, remove or rename freely.
   * Each category automatically gets a filter button and its own row.
   */
  categories: [
    {
      id: 'floral',
      name: 'Floral Decorations',
      filterLabel: 'Floral',
      description: 'Fresh and preserved floral arrangements composed to match your Poruwa and colour palette.',
      items: [
        {
          id: 'floral-1',
          name: 'Ivory & Green Floral Arrangements',
          shortDescription: 'Tall, lush arrangements to frame the stage and Poruwa.',
          description:
            'Generous arrangements of white roses, hydrangeas and delicate blooms with soft greenery, designed to frame the stage, aisle or Poruwa.',
          images: ['/images/decorations/floral-arrangement.webp'],
        },
        {
          id: 'floral-2',
          name: 'Blush Table Centrepieces',
          shortDescription: 'Low, lush centrepieces for guest tables.',
          description: 'Low centrepieces in blush and cream, kept at conversation height so guests can connect.',
          images: ['/images/decorations/floral-02.svg'],
        },
      ],
    },
    {
      id: 'entrance',
      name: 'Entrance Decorations',
      filterLabel: 'Entrance',
      description: 'A graceful first impression — arches, walkways and welcome styling.',
      items: [
        {
          id: 'entrance-1',
          name: 'Floral Aisle & Stage',
          shortDescription: 'A flower-lined aisle leading to a draped stage.',
          description:
            'A complete ceremony approach: an ivory aisle runner lined with white florals and golden lanterns, leading up stepped platforms to sweeping curved drapery.',
          images: ['/images/decorations/floral-aisle.webp', '/images/decorations/lantern-aisle.webp'],
        },
      ],
    },
    {
      id: 'backdrops',
      name: 'Backdrops',
      filterLabel: 'Backdrops',
      description: 'Layered backdrops for the Poruwa, head table and photographs.',
      items: [
        {
          id: 'backdrop-1',
          name: 'Sage Arch Backdrop',
          shortDescription: 'Glowing arch panel, sage drapery and ivory florals.',
          description:
            'A softly lit arch panel with flowing sage-green drapery, a pleated sage column and lush ivory rose arrangements, finished with gold floral stands and candles — perfect behind the Poruwa, head table or for photographs.',
          images: ['/images/decorations/sage-arch-backdrop-card.webp', '/images/decorations/sage-arch-backdrop.webp'],
          featured: true, // also shown in the 3D carousel
          cutout: '/images/decorations/sage-arch-backdrop-cutout.webp',
          tags: ['Backdrop', 'Floral'],
        },
        {
          id: 'backdrop-2',
          name: 'Heritage Panel Backdrop',
          shortDescription: 'Carved-style panels with warm gold detail.',
          description: 'Panels inspired by traditional carvings, finished in warm gold for a heritage feel.',
          images: ['/images/decorations/backdrop-02.svg'],
        },
      ],
    },
    {
      id: 'lighting',
      name: 'Lighting',
      filterLabel: 'Lighting',
      description: 'Warm, flattering light — fairy lights, candles and statement fixtures.',
      items: [
        {
          id: 'lighting-1',
          name: 'Fairy Light Canopy',
          shortDescription: 'A ceiling of warm fairy lights.',
          description: 'Warm-white fairy light canopies that create a soft, starry glow over dance floors and dinners.',
          images: ['/images/decorations/lighting-01.svg'],
        },
        {
          id: 'lighting-2',
          name: 'Candle & Lantern Set',
          shortDescription: 'Lanterns and candles for aisles and tables.',
          description: 'Golden lanterns with pillar candles for aisles, stairs and guest tables.',
          images: ['/images/decorations/lantern-aisle.webp'],
        },
      ],
    },
    {
      id: 'traditional',
      name: 'Traditional Items',
      filterLabel: 'Traditional',
      description: 'Ceremonial pieces that honour Sri Lankan wedding customs.',
      items: [
        {
          id: 'traditional-1',
          name: 'Brass Oil Lamp (Pol Thel Pahana)',
          shortDescription: 'Traditional brass lamp for the lighting ceremony.',
          description: 'A polished traditional brass oil lamp for the auspicious lamp-lighting ceremony.',
          images: ['/images/decorations/traditional-01.svg'],
        },
      ],
    },
    {
      id: 'rentals',
      name: 'Tables & Chairs',
      filterLabel: 'Rentals',
      description: 'Furniture and linens to complete your setting.',
      items: [
        {
          id: 'rentals-1',
          name: 'Sage Sweetheart Table',
          shortDescription: 'A table for two beneath sage arches, florals and glowing globes.',
          description:
            'An intimate sweetheart table for the couple: crossback chairs and a white-draped round table with a sage runner and cascading greenery, framed by double sage arches, ivory rose and hydrangea arrangements, glowing globe lights and golden lanterns.',
          images: ['/images/decorations/sweetheart-table-card.webp', '/images/decorations/sweetheart-table.webp'],
          featured: true, // also shown in the 3D carousel
          cutout: '/images/decorations/sweetheart-table-cutout.webp',
          tags: ['Table Setting', 'Floral'],
        },
      ],
    },
  ],

  services: [
    {
      title: 'Poruwa Rental',
      description: 'Choose from our signature Poruwas, delivered, assembled and styled at your venue.',
      icon: 'crown',
      image: '/images/poruwa/jasmine-cascade.webp',
    },
    {
      title: 'Wedding Decoration',
      description: 'Cohesive décor for ceremony and reception, designed around your theme.',
      icon: 'sparkles',
      image: '/images/decorations/floral-aisle.webp',
    },
    {
      title: 'Floral Decoration',
      description: 'Fresh floral design for the Poruwa, tables, aisles and entrances.',
      icon: 'flower',
      image: '/images/decorations/floral-arrangement.webp',
    },
    {
      title: 'Backdrop Setup',
      description: 'Layered backdrops for the Poruwa, head table and photo moments.',
      icon: 'palette',
      image: '/images/decorations/sage-arch-backdrop-card.webp',
    },
    {
      title: 'Lighting',
      description: 'Warm ambient lighting that flatters the setting and your photographs.',
      icon: 'lamp',
      image: '/images/decorations/lantern-aisle.webp',
    },
    {
      title: 'Event Setup',
      description: 'On-time delivery, careful installation and dismantling by our own team.',
      icon: 'truck',
      image: '/images/poruwa/ivory-drape.webp',
    },
  ],

  gallery: [
    { image: '/images/poruwa/jasmine-cascade.webp', title: 'Jasmine Cascade Poruwa', category: 'Poruwa', aspectRatio: 4 / 5 },
    { image: '/images/decorations/floral-aisle.webp', title: 'Floral aisle & draped stage', category: 'Decoration', aspectRatio: 1357 / 1000 },
    { image: '/images/poruwa/ivory-drape-detail.webp', title: 'Ivory swag canopy', category: 'Poruwa', aspectRatio: 4 / 5 },
    { image: '/images/poruwa/grand-pavilion.webp', title: 'Grand Pavilion Poruwa', category: 'Poruwa', aspectRatio: 4 / 5 },
    { image: '/images/decorations/lantern-aisle.webp', title: 'Lantern-lit floral aisle', category: 'Lighting', aspectRatio: 4 / 5 },
    { image: '/images/poruwa/jasmine-cascade-base.webp', title: 'Jasmine garlands & paddy sheaves', category: 'Details', aspectRatio: 4 / 5 },
    { image: '/images/poruwa/ivory-drape-base.webp', title: 'Brass lamp & calla lilies', category: 'Traditional', aspectRatio: 4 / 5 },
    { image: '/images/poruwa/grand-pavilion-detail.webp', title: 'Pearl-beaded swags', category: 'Details', aspectRatio: 4 / 5 },
    { image: '/images/decorations/floral-arrangement.webp', title: 'Ivory & green florals', category: 'Floral', aspectRatio: 4 / 5 },
    { image: '/images/decorations/sage-arch-backdrop.webp', title: 'Sage arch backdrop', category: 'Backdrop', aspectRatio: 2 / 3 },
    { image: '/images/decorations/sweetheart-table.webp', title: 'Sage sweetheart table', category: 'Table Setting', aspectRatio: 1455 / 1256 },
  ],

  about: {
    eyebrow: 'Our Story',
    title: 'Rooted in tradition, crafted for today',
    paragraphs: [
      'The Poruwa ceremony is one of the most meaningful moments of a Sri Lankan wedding. We believe the setting should honour that meaning — with craftsmanship, quiet elegance and attention to every detail.',
      'Our Poruwas and décor are prepared by hand, maintained with care and styled by a small, dedicated team. We work closely with each family to understand their traditions, venue and vision, then bring it together calmly and reliably on the day.',
    ],
    images: ['/images/about-poruwa.webp', '/images/about-detail.webp'],
    pillars: [
      { icon: 'hammer', title: 'Craftsmanship', description: 'Handcrafted pieces finished and maintained with care.' },
      { icon: 'leaf', title: 'Tradition', description: 'Designs that respect Sri Lankan wedding customs.' },
      { icon: 'gem', title: 'Elegant Design', description: 'Refined styling with a modern, understated eye.' },
      { icon: 'shieldCheck', title: 'Reliable Setup', description: 'Punctual delivery, installation and dismantling.' },
    ],
  },

  finalCta: {
    eyebrow: 'Begin Here',
    title: 'Your Moment Deserves Something Extraordinary.',
    description: 'Tell us your date and venue — we will help you choose the Poruwa and décor that feel right for your day.',
    image: '/images/final-cta-poruwa.webp',
    buttonLabel: 'Start Your Wedding Journey',
  },

  contact: {
    eyebrow: 'Contact',
    title: "Let's Create Your Dream Wedding",
    description:
      'Share your date, venue and ideas. We will reply with Poruwa options, décor suggestions and availability.',
    workingHours: [
      { days: 'Monday – Saturday', hours: '9.00 AM – 7.00 PM' }, // TODO
      { days: 'Sunday', hours: 'By appointment' }, // TODO
    ],
  },

  footer: {
    description: 'Traditional Poruwas and refined wedding décor, handcrafted for Sri Lankan celebrations.',
    copyright: '© {year} {name}. All Rights Reserved.',
  },

  whatsappMessages: {
    general: "Hello {name}! I'd like to know more about your Poruwa and wedding decoration services.",
    poruwa: "Hello {name}! I'm interested in the {product}. Could you share availability and details?",
    item: "Hello {name}! I'm interested in your {product}. Could you share more details?",
    journey: "Hello {name}! We're planning our wedding and would love your help with the Poruwa and décor.",
  },

  ui: {
    viewDetails: 'View Details',
    viewAllPoruwas: 'View All Poruwas',
    showFewerPoruwas: 'Show Fewer',
    inquireWhatsApp: 'Inquire on WhatsApp',
    priceOnRequest: 'Price on request',
    whatsappUs: 'WhatsApp Us',
    callNow: 'Call Now',
    getDirections: 'Get Directions',
    chatWithUs: 'Chat with us',
    allFilter: 'All',
    poruwaFilter: 'Poruwas',
    features: 'Features',
    availability: 'Availability',
    price: 'Price',
    scroll: 'Scroll',
    workingHours: 'Working Hours',
    followUs: 'Follow Us',
    navigation: 'Navigation',
    contact: 'Contact',
    phoneLabel: 'Phone',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    addressLabel: 'Address',
  },
};
