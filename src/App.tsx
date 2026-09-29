import { MotionConfig } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { SiteData } from './types/site';
import { SiteDataProvider } from './context/SiteDataContext';
import { IntroDelayContext } from './context/IntroContext';
import { IntroLoader, INTRO_REVEAL_DELAY, shouldPlayIntro } from './components/IntroLoader';
import { initSmoothScroll } from './lib/smoothScroll';
import { Home } from './pages/Home';

/** Keeps document metadata in sync with the loaded site data (useful once data comes from an API). */
function useDocumentMeta(data: SiteData) {
  useEffect(() => {
    document.title = `${data.site.name} — ${data.site.tagline}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.site.description);
  }, [data]);
}

export default function App({ data }: { data: SiteData }) {
  useDocumentMeta(data);
  const [playIntro] = useState(shouldPlayIntro);

  useEffect(() => initSmoothScroll(), []);

  return (
    <SiteDataProvider data={data}>
      <MotionConfig reducedMotion="user">
        <IntroDelayContext.Provider value={playIntro ? INTRO_REVEAL_DELAY : 0}>
          {playIntro && <IntroLoader />}
          <Home />
        </IntroDelayContext.Provider>
        <div aria-hidden="true" className="grain" />
      </MotionConfig>
    </SiteDataProvider>
  );
}
