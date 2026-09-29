import { createContext, useContext } from 'react';

/**
 * Seconds to wait before playing entrance animations (hero, navbar…),
 * so they start as the opening intro lifts away. 0 when no intro plays.
 */
export const IntroDelayContext = createContext(0);

export function useIntroDelay() {
  return useContext(IntroDelayContext);
}
