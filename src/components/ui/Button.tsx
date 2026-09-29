import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'gold' | 'outline' | 'ghost' | 'dark';

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-ink hover:bg-gold-light border border-gold hover:border-gold-light',
  outline: 'border border-ivory/35 text-ivory hover:border-gold hover:text-gold-light bg-ivory/[0.03] backdrop-blur-sm',
  ghost: 'text-ivory hover:text-gold-light border border-transparent',
  dark: 'bg-ink text-ivory border border-ink hover:bg-ink-600',
};

const baseClass =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-all duration-500 ease-luxe focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50';

interface CommonProps {
  variant?: Variant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Soft sheen that sweeps across the button on hover. */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 ease-luxe group-hover:left-[120%] group-hover:opacity-100"
    />
  );
}

export function ButtonLink({ variant = 'gold', icon, children, className = '', ...rest }: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = rest.href?.startsWith('http');
  return (
    <a
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      <Sheen />
      {icon}
      <span className="relative">{children}</span>
    </a>
  );
}

export function Button({ variant = 'gold', icon, children, className = '', type = 'button', ...rest }: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={`${baseClass} ${variants[variant]} ${className}`} {...rest}>
      <Sheen />
      {icon}
      <span className="relative">{children}</span>
    </button>
  );
}
