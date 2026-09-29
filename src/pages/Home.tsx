import { useCallback, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { PoruwaSection } from '../components/PoruwaSection';
import { CategorySection } from '../components/CategorySection';
import { Services } from '../components/Services';
import { Gallery } from '../components/Gallery';
import { About } from '../components/About';
import { FinalCta } from '../components/FinalCta';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ProductModal, type ProductSelection } from '../components/ProductModal';
import type { Category, CategoryItem, Poruwa } from '../types/site';

export function Home() {
  const [selection, setSelection] = useState<ProductSelection | null>(null);
  const openPoruwa = useCallback((item: Poruwa) => setSelection({ kind: 'poruwa', item }), []);
  const openItem = useCallback(
    (item: CategoryItem, category: Category) => setSelection({ kind: 'item', item, categoryName: category.name }),
    [],
  );

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <PoruwaSection onOpen={openPoruwa} onOpenItem={openItem} modalOpen={!!selection} />
        <CategorySection
          onOpenPoruwa={openPoruwa}
          onOpenItem={openItem}
        />
        <Services />
        <Gallery />
        <About />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <ProductModal selection={selection} onClose={() => setSelection(null)} />
    </>
  );
}
