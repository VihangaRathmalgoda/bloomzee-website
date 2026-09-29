import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
  type PanInfo,
} from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import type { Poruwa } from '../types/site';
import { wrapIndex } from '../lib/links';
import { useSiteData } from '../context/SiteDataContext';
import { SmartImage } from './ui/SmartImage';
import { PetalField, StageSpotlight } from './StageAtmosphere';
import { luxeEase } from './ui/Reveal';

/* -------------------------------------------------------------------------- */
/*  Geometry — how cards are laid out along the elliptical path                */
/* -------------------------------------------------------------------------- */

interface Geometry {
  mode: 'mobile' | 'tablet' | 'desktop';
  cardW: number;
  cardH: number;
  /** Horizontal radius of the ellipse. */
  radiusX: number;
  /** Vertical radius — how far the sides of the arc drop. */
  radiusY: number;
  /** How far (px) cards recede into the scene at the side of the ring. */
  depth: number;
  /** Angle (deg) between neighbouring cards on the ellipse. */
  stepDeg: number;
  /** Share of the ring angle a card turns to face the centre (cylinder effect). */
  turn: number;
  /** Share of the arc's tangent a card tilts to follow the curve. */
  tilt: number;
  perspective: number;
  /** Stops of |offset| used for interpolating depth-based styles. */
  stops: number[];
  scale: number[];
  opacity: number[];
  brightness: number[];
  blur: number[];
}

const CARD_RATIO = 1.25; // 4:5 portrait cards

/*
 * Exactly three Poruwas are visible at a time: the focused one in the centre
 * and one on each side. Cards fade out before |offset| reaches 1.6, so the
 * next Poruwa only appears as it glides in from the back of the ring.
 */
function getGeometry(width: number): Geometry {
  if (width < 640) {
    const cardW = Math.min(width * 0.74, 340);
    return {
      mode: 'mobile',
      cardW,
      cardH: cardW * CARD_RATIO,
      radiusX: cardW * 1.3,
      radiusY: cardW * 0.7,
      depth: cardW * 0.9,
      stepDeg: 34,
      turn: 0.8,
      tilt: 0.35,
      perspective: 900,
      stops: [0, 1, 1.6],
      scale: [1, 0.64, 0.5],
      opacity: [1, 0.6, 0],
      brightness: [1, 0.5, 0.4],
      blur: [0, 0, 0],
    };
  }
  if (width < 1024) {
    const cardW = Math.min(width * 0.46, 400);
    return {
      mode: 'tablet',
      cardW,
      cardH: cardW * CARD_RATIO,
      radiusX: cardW * 1.5,
      radiusY: cardW * 0.85,
      depth: cardW * 1.0,
      stepDeg: 30,
      turn: 0.85,
      tilt: 0.35,
      perspective: 1100,
      stops: [0, 1, 1.6],
      scale: [1, 0.62, 0.5],
      opacity: [1, 0.7, 0],
      brightness: [1, 0.52, 0.4],
      blur: [0, 0.8, 2],
    };
  }
  const cardW = Math.max(360, Math.min(width * 0.3, 500));
  return {
    mode: 'desktop',
    cardW,
    cardH: cardW * CARD_RATIO,
    radiusX: cardW * 1.55,
    radiusY: cardW * 0.9,
    depth: cardW * 1.05,
    stepDeg: 30,
    turn: 0.85,
    tilt: 0.35,
    perspective: 1400,
    stops: [0, 1, 1.6],
    scale: [1, 0.62, 0.5],
    opacity: [1, 0.72, 0],
    brightness: [1, 0.52, 0.4],
    blur: [0, 1, 2],
  };
}

/** Piecewise-linear interpolation, clamped at both ends. */
function interp(value: number, stops: number[], values: number[]): number {
  if (value <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (value <= stops[i]) {
      const t = (value - stops[i - 1]) / (stops[i] - stops[i - 1]);
      return values[i - 1] + (values[i] - values[i - 1]) * t;
    }
  }
  return values[values.length - 1];
}

/** Signed distance of a slot from the centre, wrapped around the ring. */
function ringOffset(slot: number, position: number, count: number): number {
  const raw = wrapIndex(slot - position, count);
  return raw > count / 2 ? raw - count : raw;
}

const DEG = Math.PI / 180;

/**
 * Computes every visual property of a card from its (fractional) offset.
 * Cards sit on a tilted cylinder: they swing out along an ellipse (x/y),
 * recede into the scene (z), turn to face the centre (rotateY) and tilt to
 * follow the curve of the arc (rotateZ).
 */
function placeOnEllipse(offset: number, g: Geometry) {
  const a = Math.abs(offset);
  // Clamp the angle so cards far back on the ring don't swing past the sides.
  const theta = Math.max(-80 * DEG, Math.min(80 * DEG, offset * g.stepDeg * DEG));
  const tangent = Math.atan2(g.radiusY * Math.sin(theta), g.radiusX * Math.cos(theta)) / DEG;
  return {
    x: g.radiusX * Math.sin(theta),
    y: g.radiusY * (1 - Math.cos(theta)),
    z: -g.depth * (1 - Math.cos(theta)),
    scale: interp(a, g.stops, g.scale),
    opacity: interp(a, g.stops, g.opacity),
    rotateY: -(theta / DEG) * g.turn,
    rotateZ: tangent * g.tilt,
    brightness: interp(a, g.stops, g.brightness),
    blur: interp(a, g.stops, g.blur),
    zIndex: Math.round(1000 - a * 100),
    glow: Math.max(0, 1 - a * 1.6),
    /** Darken the edge turned away from the viewer. */
    shadeLeft: offset < 0 ? Math.min(0.6, a * 0.38) : 0,
    shadeRight: offset > 0 ? Math.min(0.6, a * 0.38) : 0,
  };
}

/* -------------------------------------------------------------------------- */
/*  A single card travelling along the path                                    */
/* -------------------------------------------------------------------------- */

interface SlotProps {
  slot: number;
  slotCount: number;
  poruwa: Poruwa;
  position: MotionValue<number>;
  geometry: MotionValue<Geometry>;
  geo: Geometry;
  isActive: boolean;
  onSelect: (slot: number) => void;
  hint: string;
  /** Fade cards out beyond this offset (used with few items so duplicates never show). */
  fadeFrom?: number;
}

function CarouselSlot({ slot, slotCount, poruwa, position, geometry, geo, isActive, onSelect, hint, fadeFrom }: SlotProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(0);
  const shadeLeft = useMotionValue(0);
  const shadeRight = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rotateZ = useMotionValue(0);
  const zIndex = useMotionValue(0);
  const filter = useMotionValue('none');
  const glow = useMotionValue(0);
  const pointerEvents = useMotionValue<'auto' | 'none'>('none');
  const cutout = poruwa.cutout;
  // Stagger the idle float so the Poruwas don't bob in unison.
  const floatDelay = `${-(slot % 5) * 1.3}s`;

  // Subscribe once and derive every style from the shared position — this is
  // what makes cards follow the curve (instead of tweening in straight lines).
  useLayoutEffect(() => {
    const update = () => {
      const g = geometry.get();
      const offset = ringOffset(slot, position.get(), slotCount);
      const p = placeOnEllipse(offset, g);
      if (fadeFrom !== undefined && Math.abs(offset) > fadeFrom) {
        p.opacity *= Math.max(0, 1 - (Math.abs(offset) - fadeFrom) / 0.5);
      }
      x.set(p.x);
      y.set(p.y);
      z.set(p.z);
      shadeLeft.set(p.shadeLeft);
      shadeRight.set(p.shadeRight);
      scale.set(p.scale);
      opacity.set(p.opacity);
      rotateY.set(p.rotateY);
      rotateZ.set(p.rotateZ);
      zIndex.set(p.zIndex);
      glow.set(p.glow);
      filter.set(
        p.blur > 0.05
          ? `brightness(${p.brightness.toFixed(3)}) blur(${p.blur.toFixed(2)}px)`
          : `brightness(${p.brightness.toFixed(3)})`,
      );
      pointerEvents.set(p.opacity > 0.15 ? 'auto' : 'none');
    };
    update();
    const unsubPosition = position.on('change', update);
    const unsubGeometry = geometry.on('change', update);
    return () => {
      unsubPosition();
      unsubGeometry();
    };
  }, [slot, slotCount, fadeFrom, position, geometry, x, y, z, shadeLeft, shadeRight, scale, opacity, rotateY, rotateZ, zIndex, glow, filter, pointerEvents]);

  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{
        width: geo.cardW,
        height: geo.cardH,
        marginLeft: -geo.cardW / 2,
        x,
        y,
        z,
        scale,
        opacity,
        rotateY,
        rotate: rotateZ,
        zIndex,
        pointerEvents,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Luxury glow behind the centre card */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,rgba(214,188,142,0.35),rgba(184,149,96,0.08)_55%,transparent_72%)] blur-2xl"
        style={{ opacity: glow }}
      />
      <motion.button
        type="button"
        onClick={() => onSelect(slot)}
        tabIndex={isActive ? 0 : -1}
        aria-hidden={!isActive || undefined}
        aria-label={isActive ? `${poruwa.name}, ${hint}` : poruwa.name}
        className={
          cutout
            ? 'group relative block h-full w-full rounded-[1.25rem] text-left outline-none focus-visible:ring-1 focus-visible:ring-gold/70 focus-visible:ring-offset-8 focus-visible:ring-offset-ink'
            : 'group relative block h-full w-full overflow-hidden rounded-[1.25rem] bg-ink-700 text-left shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ink'
        }
        style={{ filter }}
      >
        {cutout ? (
          <>
            {/* Contact shadow on the floor — shrinks as the Poruwa floats up */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[10%] -bottom-[3%] h-[8%] animate-float-shadow rounded-[100%] bg-black/80 blur-xl"
              style={{ animationDelay: floatDelay }}
            />
            {/* The Poruwa itself, gently floating */}
            {/* Extra side room lets wide (landscape) cut-outs appear as large as tall ones */}
            <span className="absolute inset-y-0 -inset-x-[16%] block animate-float" style={{ animationDelay: floatDelay }}>
              <img
                src={cutout}
                alt={poruwa.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full select-none object-contain object-bottom drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)] transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.03]"
              />
            </span>
          </>
        ) : (
          <>
        <SmartImage
          src={poruwa.images[0]}
          alt={poruwa.name}
          draggable={false}
          className="select-none transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.04]"
        />
        {/* Cinematic overlay + thin gold frame */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[0.9rem] border border-gold-light/25" />
        {/* 3D shading: the edge turned away from the viewer falls into shadow */}
        <motion.span
          aria-hidden="true"
          style={{ opacity: shadeLeft }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black via-black/40 to-transparent"
        />
        <motion.span
          aria-hidden="true"
          style={{ opacity: shadeRight }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"
        />
        {/* Soft specular sheen across the top */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.07] to-transparent" />
          </>
        )}
        <motion.span
          aria-hidden="true"
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center pb-6"
        >
          <span className="flex items-center gap-2 rounded-full border border-ivory/25 bg-ink/40 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-ivory opacity-0 backdrop-blur-md transition duration-500 ease-luxe group-hover:opacity-100">
            <Plus size={12} strokeWidth={2} /> {hint}
          </span>
        </motion.span>
      </motion.button>

      {/* Mirror reflection on a glossy floor */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-full h-[38%] overflow-hidden rounded-[1.25rem] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.85),rgba(0,0,0,0.25)_40%,transparent_75%)] ${
          cutout ? '-inset-x-[16%] mt-0 opacity-30' : 'inset-x-0 mt-2 opacity-25'
        }`}
      >
        {/* For a floating cut-out the reflection drifts the opposite way */}
        <span className={`absolute inset-0 block ${cutout ? 'animate-float-reflect' : ''}`} style={{ animationDelay: floatDelay }}>
          <img
            src={cutout ?? poruwa.images[0]}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`absolute left-0 top-0 h-[263%] w-full -scale-y-100 ${cutout ? 'object-contain object-bottom' : 'object-cover'}`}
          />
        </span>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Carousel                                                                   */
/* -------------------------------------------------------------------------- */

interface PoruwaCarouselProps {
  poruwas: Poruwa[];
  onOpen: (poruwa: Poruwa) => void;
  /** Pause autoplay (e.g. while a modal is open). */
  paused?: boolean;
}

const MIN_SLOTS = 7;
const DWELL_MS = 3200;

export function PoruwaCarousel({ poruwas, onOpen, paused = false }: PoruwaCarouselProps) {
  const { ui } = useSiteData();
  const count = poruwas.length;

  // Repeat items so the ring always has enough slots for a seamless loop.
  const slotCount = count > 0 ? count * Math.max(1, Math.ceil(MIN_SLOTS / count)) : 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: '-15% 0px -15% 0px' });

  const [geo, setGeo] = useState<Geometry>(() => getGeometry(typeof window === 'undefined' ? 1280 : window.innerWidth));
  const geometry = useMotionValue<Geometry>(geo);
  const position = useMotionValue(0);
  const targetRef = useRef(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const dragStartRef = useRef(0);
  const draggedRef = useRef(false);

  const [activeSlot, setActiveSlot] = useState(0);
  const [moving, setMoving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);

  const activeIndex = count ? activeSlot % count : 0;
  const active = poruwas[activeIndex];

  // Measure the container and recompute geometry on resize.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = getGeometry(entry.contentRect.width);
      geometry.set(next);
      setGeo(next);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [geometry]);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => () => animationRef.current?.stop(), []);

  const settle = useCallback(
    (duration: number, ease: [number, number, number, number]) => {
      animationRef.current?.stop();
      setMoving(true);
      setActiveSlot(wrapIndex(targetRef.current, slotCount));
      animationRef.current = animate(position, targetRef.current, {
        duration,
        ease,
        onComplete: () => setMoving(false),
      });
    },
    [position, slotCount],
  );

  /** Move the ring by `delta` cards (positive = next). */
  const moveBy = useCallback(
    (delta: number) => {
      if (!delta || slotCount < 2) return;
      targetRef.current = Math.round(targetRef.current) + delta;
      // Longer jumps take a little longer, but never feel sluggish.
      const duration = Math.min(1.5 + (Math.abs(delta) - 1) * 0.3, 2.4);
      settle(duration, [0.65, 0.02, 0.2, 1]);
    },
    [settle, slotCount],
  );

  const next = useCallback(() => moveBy(1), [moveBy]);
  const prev = useCallback(() => moveBy(-1), [moveBy]);

  /** Bring a Poruwa (by its index in the data) to the centre via the shortest path. */
  const goToIndex = useCallback(
    (index: number) => {
      const current = Math.round(targetRef.current);
      let best = 0;
      let bestDist = Infinity;
      for (let slot = index; slot < slotCount; slot += count) {
        const d = Math.round(ringOffset(slot, current, slotCount));
        if (Math.abs(d) < Math.abs(bestDist)) {
          bestDist = d;
          best = d;
        }
      }
      moveBy(best);
    },
    [count, moveBy, slotCount],
  );

  // Autoplay: wait at the centre, then move on — one Poruwa at a time.
  // Autoplay runs continuously; it only pauses while the mouse is over the carousel,
  // while a keyboard user is navigating it, when a modal is open or when it's off-screen.
  const autoplay = !paused && !hovered && !focused && !pageHidden && inView && count > 1;
  useEffect(() => {
    if (!autoplay || moving) return;
    const timer = window.setTimeout(next, DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, moving, next, activeSlot]);

  const handleSelect = (slot: number) => {
    if (draggedRef.current) return;
    const offset = Math.round(ringOffset(slot, position.get(), slotCount));
    if (offset === 0) onOpen(poruwas[slot % count]);
    else moveBy(offset);
  };

  /* ---- Drag / swipe: cards follow the finger along the curve ---- */
  const dragUnit = geo.cardW * (geo.mode === 'mobile' ? 0.8 : 0.95);

  const onPanStart = () => {
    animationRef.current?.stop();
    draggedRef.current = true;
    dragStartRef.current = position.get();
    setMoving(true);
  };
  const onPan = (_: PointerEvent, info: PanInfo) => {
    position.set(dragStartRef.current - info.offset.x / dragUnit);
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const projected = position.get() - (info.velocity.x / dragUnit) * 0.18;
    const start = Math.round(dragStartRef.current);
    const target = Math.max(start - 3, Math.min(start + 3, Math.round(projected)));
    targetRef.current = target;
    settle(0.9, [0.22, 1, 0.36, 1]);
    // Let the click that follows a drag be ignored.
    window.setTimeout(() => (draggedRef.current = false), 0);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    }
  };

  const slots = useMemo(() => Array.from({ length: slotCount }, (_, slot) => slot), [slotCount]);
  // Room for the centre card, the drop of the arc and the floor reflection.
  const stageHeight = geo.cardH * 1.22 + geo.radiusY * 0.15;

  if (!count || !active) return null;

  return (
    <div
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      // Only keyboard focus pauses autoplay — a mouse click on the arrows shouldn't stop it.
      onFocus={(e) => setFocused(e.target.matches(':focus-visible'))}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
    >
      <div
        ref={containerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${ui.poruwaFilter} — ${count}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        // `isolate` keeps the cards' and petals' z-indexes inside the carousel (never above modals / navbar).
        className="relative isolate rounded-3xl outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
      >
        {/* Stage lighting: a soft beam onto the centre Poruwa, with petals drifting behind */}
        <StageSpotlight cardW={geo.cardW} cardH={geo.cardH} />
        <PetalField cardW={geo.cardW} cardH={geo.cardH} layer="back" compact={geo.mode === 'mobile'} />
        {/* Soft floor light beneath the centre stage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(214,188,142,0.18),transparent_65%)]"
          style={{ width: geo.cardW * 2.4, height: geo.cardW * 0.5, top: geo.cardH - geo.cardW * 0.12 }}
        />

        <motion.div
          className="relative mx-auto cursor-grab select-none active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
          style={{ height: stageHeight, perspective: geo.perspective, perspectiveOrigin: '50% 35%', touchAction: 'pan-y' }}
          onPanStart={onPanStart}
          onPan={onPan}
          onPanEnd={onPanEnd}
          onPointerDown={() => (draggedRef.current = false)}
        >
          {slots.map((slot) => {
            const poruwa = poruwas[slot % count];
            const isActive = slot === activeSlot;
            return (
              <CarouselSlot
                key={slot}
                slot={slot}
                slotCount={slotCount}
                poruwa={poruwa}
                position={position}
                geometry={geometry}
                geo={geo}
                isActive={isActive}
                onSelect={handleSelect}
                hint={ui.viewDetails}
                fadeFrom={count < 3 ? 1 : undefined}
              />
            );
          })}
        </motion.div>
        {/* Petals drifting in front of the cards, for depth */}
        <PetalField cardW={geo.cardW} cardH={geo.cardH} layer="front" compact={geo.mode === 'mobile'} />
      </div>

      {/* Caption — the name arrives once the Poruwa settles at the centre */}
      <div className="relative mx-auto mt-6 flex min-h-[11.5rem] max-w-2xl flex-col items-center px-4 text-center sm:mt-8 sm:min-h-[10.5rem]">
        <AnimatePresence mode="wait">
          {!moving && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.35 } }}
              transition={{ duration: 0.8, ease: luxeEase }}
              className="flex flex-col items-center"
              aria-live={autoplay ? 'off' : 'polite'}
            >
              <p className="text-[0.66rem] font-semibold uppercase tracking-luxe text-gold">
                <span className="font-serif text-sm italic normal-case tracking-normal text-gold-light">
                  No. {String(activeIndex + 1).padStart(2, '0')}
                </span>
                {active.tags?.length ? <span className="ml-3">{active.tags.join(' · ')}</span> : null}
              </p>
              <h3 className="text-foil mt-3 pb-1 font-serif text-[2rem] font-light leading-tight sm:text-[2.6rem]">{active.name}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-light">{active.shortDescription}</p>
              <button
                type="button"
                onClick={() => onOpen(active)}
                className="group mt-5 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-gold-light transition-colors hover:text-ivory focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                <span className="h-px w-8 bg-gold/60 transition-all duration-500 ease-luxe group-hover:w-12 group-hover:bg-ivory" />
                {ui.viewDetails}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center gap-5 sm:gap-8">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous Poruwa"
          className="grid h-12 w-12 place-items-center rounded-full border border-ivory/20 text-ivory transition duration-500 ease-luxe hover:border-gold hover:bg-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2" role="group" aria-label="Choose a Poruwa">
            {poruwas.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goToIndex(i)}
                aria-label={p.name}
                aria-current={i === activeIndex ? 'true' : undefined}
                className="grid h-6 place-items-center px-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-700 ease-luxe ${
                    i === activeIndex ? 'w-8 bg-gold' : 'w-3 bg-ivory/25 hover:bg-ivory/50'
                  }`}
                />
              </button>
            ))}
          </div>
          {/* Autoplay progress */}
          <div className="h-px w-24 overflow-hidden bg-ivory/10" aria-hidden="true">
            {autoplay && !moving && (
              <motion.div
                key={activeSlot}
                className="h-full origin-left bg-gold/70"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: DWELL_MS / 1000, ease: 'linear' }}
              />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          aria-label="Next Poruwa"
          className="grid h-12 w-12 place-items-center rounded-full border border-ivory/20 text-ivory transition duration-500 ease-luxe hover:border-gold hover:bg-gold hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <ArrowRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
