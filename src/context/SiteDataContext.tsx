import { createContext, useContext, type ReactNode } from 'react';
import type { SiteData } from '../types/site';

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({ data, children }: { data: SiteData; children: ReactNode }) {
  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteData {
  const data = useContext(SiteDataContext);
  if (!data) throw new Error('useSiteData must be used inside <SiteDataProvider>');
  return data;
}
