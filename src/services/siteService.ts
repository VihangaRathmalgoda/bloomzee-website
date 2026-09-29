import type { SiteData } from '../types/site';
import { siteData } from '../data/siteData';

/**
 * Single entry point for loading website content.
 *
 * Today this returns the static content from `src/data/siteData.ts`.
 * To move to a backend / admin panel later, replace the body with e.g.:
 *
 *   const res = await fetch('/api/site');
 *   if (!res.ok) throw new Error('Failed to load site data');
 *   return (await res.json()) as SiteData;
 *
 * No UI component needs to change — they all read data via `useSiteData()`.
 */
export async function getSiteData(): Promise<SiteData> {
  return siteData;
}
