import { useCallback } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import { fillTemplate, whatsappUrl } from '../lib/links';
import type { WhatsAppMessages } from '../types/site';

/** Returns a function that builds a WhatsApp link from a message template in siteData. */
export function useWhatsApp() {
  const { site, whatsappMessages } = useSiteData();
  return useCallback(
    (kind: keyof WhatsAppMessages = 'general', product = '') =>
      whatsappUrl(site.whatsapp, fillTemplate(whatsappMessages[kind], { name: site.name, product })),
    [site.whatsapp, site.name, whatsappMessages],
  );
}
