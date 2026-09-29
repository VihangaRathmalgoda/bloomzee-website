import Lenis from 'lenis';

/**
 * Site-wide inertial ("buttery") scrolling.
 * A single instance is shared so modals / menus can pause it via stop()/start().
 * Scrollable panels (modals) opt out with the `data-lenis-prevent` attribute.
 */
let lenis: Lenis | null = null;

export function initSmoothScroll(): () => void {
  if (lenis) return () => undefined;
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    // Handle in-page links like "#poruwas", leaving room for the fixed navbar.
    anchors: { offset: -72 },
    autoRaf: true,
  });
  // Native CSS smooth scrolling would fight with Lenis.
  document.documentElement.style.scrollBehavior = 'auto';

  return () => {
    lenis?.destroy();
    lenis = null;
    document.documentElement.style.scrollBehavior = '';
  };
}

export function stopSmoothScroll() {
  lenis?.stop();
}

export function startSmoothScroll() {
  lenis?.start();
}
