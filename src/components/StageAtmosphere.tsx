import type { CSSProperties } from 'react';

interface StageProps {
  /** Width of the centre card (px). */
  cardW: number;
  /** Height of the centre card (px). */
  cardH: number;
}

/**
 * A soft beam of warm light falling from above onto the centre Poruwa.
 * Rendered behind the carousel cards.
 */
export function StageSpotlight({ cardW, cardH }: StageProps) {
  return (
    <div
      aria-hidden="true"
      // Fade the beam in from above so it has no hard top edge.
      className="pointer-events-none absolute left-1/2 -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]"
      style={{ width: cardW * 1.9, height: cardH * 1.3, top: -cardH * 0.12 }}
    >
      {/* The cone of light */}
      <div className="h-full w-full animate-spot-breathe bg-[linear-gradient(to_bottom,rgba(255,236,196,0.24),rgba(255,230,180,0.08)_55%,transparent_92%)] blur-[14px] [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
    </div>
  );
}

/** Deterministic petal layout (no randomness between renders). */
const PETALS = [
  { x: 0.08, size: 12, dur: 13, delay: 0, blur: 0, front: false },
  { x: 0.22, size: 9, dur: 11, delay: -4, blur: 0, front: true },
  { x: 0.36, size: 14, dur: 15, delay: -9, blur: 1.2, front: true },
  { x: 0.5, size: 8, dur: 12, delay: -2, blur: 0, front: false },
  { x: 0.63, size: 11, dur: 14, delay: -7, blur: 0, front: true },
  { x: 0.77, size: 13, dur: 12.5, delay: -11, blur: 1.5, front: true },
  { x: 0.9, size: 9, dur: 10.5, delay: -5, blur: 0, front: false },
  { x: 0.3, size: 10, dur: 16, delay: -13, blur: 0.6, front: false },
  { x: 0.7, size: 8, dur: 13.5, delay: -1, blur: 0, front: true },
  { x: 0.45, size: 12, dur: 14.5, delay: -8, blur: 2, front: true },
];

function Petal({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 12 16" aria-hidden="true">
      <defs>
        <linearGradient id="petal-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#e9dcc0" />
        </linearGradient>
      </defs>
      <path d="M6 0 C11 4 11 11 6 16 C1 11 1 4 6 0Z" fill="url(#petal-fill)" />
      <path d="M6 2.5 C6.6 7 6.6 10 6 14" stroke="#d8c49a" strokeWidth="0.5" fill="none" opacity="0.7" />
    </svg>
  );
}

/**
 * A handful of jasmine petals drifting down around the centre Poruwa.
 * `layer` splits petals behind / in front of the cards for depth.
 */
export function PetalField({ cardW, cardH, layer, compact = false }: StageProps & { layer: 'back' | 'front'; compact?: boolean }) {
  const petals = PETALS.filter((p, i) => (layer === 'front') === p.front && (!compact || i % 2 === 0));
  const width = cardW * 2.1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_78%,transparent)]"
      style={{ width, height: cardH * 1.15, zIndex: layer === 'front' ? 2000 : 0 }}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block animate-petal-fall"
          style={
            {
              left: `${p.x * 100}%`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              '--fall': `${cardH * 1.15}px`,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              opacity: layer === 'back' ? 0.6 : 0.9,
            } as CSSProperties
          }
        >
          <span className="block animate-petal-sway" style={{ animationDelay: `${p.delay / 3}s` }}>
            <Petal size={p.size} />
          </span>
        </span>
      ))}
    </div>
  );
}
