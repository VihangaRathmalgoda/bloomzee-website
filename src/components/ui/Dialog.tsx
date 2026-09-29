import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';
import { luxeEase } from './Reveal';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Accessible label for the dialog. */
  label: string;
  children: ReactNode;
  /** Classes for the panel element. */
  className?: string;
  /** Extra keyboard handling (e.g. arrow keys for a lightbox). */
  onKeyDown?: (event: KeyboardEvent) => void;
  closeLabel?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal base: portal, backdrop, focus trap, Escape to close,
 * scroll lock and focus restoration.
 */
export function Dialog({ open, onClose, label, children, className = '', onKeyDown, closeLabel = 'Close' }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const handlersRef = useRef({ onClose, onKeyDown });
  handlersRef.current = { onClose, onKeyDown };

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current;
      // preventScroll keeps long modals (e.g. on mobile) opening at the top.
      target?.focus({ preventScroll: true });
    }, 60);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handlersRef.current.onClose();
        return;
      }
      if (event.key === 'Tab' && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null,
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      handlersRef.current.onKeyDown?.(event);
    };

    document.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: luxeEase }}
        >
          <div className="absolute inset-0 bg-ink/85 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            data-lenis-prevent
            className={`relative outline-none ${className}`}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.7, ease: luxeEase }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-ivory/20 bg-ink/60 text-ivory backdrop-blur transition duration-500 ease-luxe hover:rotate-90 hover:border-gold hover:text-gold-light sm:right-5 sm:top-5"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
