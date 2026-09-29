import { useState, type ImgHTMLAttributes } from 'react';

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  /** Load eagerly with high priority (hero / above-the-fold images). */
  priority?: boolean;
  /** Extra classes for the wrapping element. */
  wrapperClassName?: string;
}

/**
 * Image with lazy loading, async decoding, a soft fade-in once loaded and a
 * graceful fallback surface if the file is missing. The wrapper fills its
 * parent, so give the parent an aspect ratio to prevent layout shift.
 */
export function SmartImage({ src, alt, priority = false, className = '', wrapperClassName = '', ...rest }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span className={`relative block h-full w-full overflow-hidden bg-ink-700 ${wrapperClassName}`}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // React 18 warns on camelCase fetchPriority; the lowercase attribute passes through untouched.
          {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ease-luxe ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...rest}
        />
      )}
      {failed && (
        <span
          role="img"
          aria-label={alt}
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-600 to-ink-800 text-center font-serif text-lg italic text-gold-light/60"
        >
          {alt}
        </span>
      )}
    </span>
  );
}
