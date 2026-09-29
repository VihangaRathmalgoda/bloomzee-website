import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import type { GalleryImage } from '../types/site';
import { wrapIndex } from '../lib/links';
import { Dialog } from './ui/Dialog';
import { luxeEase } from './ui/Reveal';

interface LightboxProps {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

export function Lightbox({ images, index, onClose, onChange }: LightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const [direction, setDirection] = useState(1);
  const [lastIndex, setLastIndex] = useState(index ?? 0);

  useEffect(() => {
    if (index !== null) setLastIndex(index);
    setZoomed(false);
  }, [index]);

  const current = images[lastIndex];

  const go = (delta: number) => {
    if (index === null) return;
    setDirection(delta);
    onChange(wrapIndex(index + delta, images.length));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(1);
    else if (event.key === 'ArrowLeft') go(-1);
    else if (event.key === '+' || event.key === '=') setZoomed(true);
    else if (event.key === '-') setZoomed(false);
  };

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (zoomed) return;
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const control =
    'grid h-12 w-12 place-items-center rounded-full border border-ivory/20 bg-ink/50 text-ivory backdrop-blur transition duration-500 ease-luxe hover:border-gold hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold';

  return (
    <Dialog
      open={index !== null}
      onClose={onClose}
      label={current?.title ?? 'Gallery'}
      onKeyDown={onKeyDown}
      className="flex h-full w-full flex-col"
    >
      {current && (
        <>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-4 pt-20 sm:px-20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={lastIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.7, ease: luxeEase }}
                className="flex h-full w-full items-center justify-center"
              >
                <motion.img
                  src={current.image}
                  alt={current.title}
                  draggable={false}
                  drag={zoomed ? true : 'x'}
                  dragConstraints={zoomed ? { left: -300, right: 300, top: -300, bottom: 300 } : { left: 0, right: 0 }}
                  dragElastic={zoomed ? 0.2 : 0.5}
                  onDragEnd={onDragEnd}
                  onDoubleClick={() => setZoomed((z) => !z)}
                  animate={{ scale: zoomed ? 2 : 1, ...(zoomed ? {} : { x: 0, y: 0 }) }}
                  transition={{ duration: 0.6, ease: luxeEase }}
                  className={`max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl ${
                    zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                  }`}
                  style={{ touchAction: 'none' }}
                />
              </motion.div>
            </AnimatePresence>

            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${control} absolute left-3 top-1/2 hidden -translate-y-1/2 sm:grid lg:left-8`}>
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${control} absolute right-3 top-1/2 hidden -translate-y-1/2 sm:grid lg:right-8`}>
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 pb-6 sm:px-10 sm:pb-8">
            <div className="min-w-0">
              <p className="text-[0.62rem] font-semibold uppercase tracking-luxe text-gold">{current.category}</p>
              <p className="mt-1 truncate font-serif text-xl text-ivory sm:text-2xl">{current.title}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="mr-2 font-serif text-sm italic text-ivory/60" aria-live="polite">
                {lastIndex + 1} / {images.length}
              </span>
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${control} sm:hidden`}>
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${control} sm:hidden`}>
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
                aria-pressed={zoomed}
                className={control}
              >
                {zoomed ? <ZoomOut size={18} strokeWidth={1.5} /> : <ZoomIn size={18} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
