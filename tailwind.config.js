/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0d0c0b',
          900: '#0d0c0b',
          800: '#141211',
          700: '#1c1a18',
          600: '#26231f',
          500: '#3a352f',
        },
        ivory: {
          DEFAULT: '#f6f1e8',
          50: '#fbf8f3',
          100: '#f6f1e8',
          200: '#ece4d6',
        },
        champagne: '#e6d7bd',
        beige: '#cfc0a6',
        gold: {
          DEFAULT: '#b89560',
          light: '#d6bc8e',
          dark: '#8c6f43',
        },
        stone: {
          DEFAULT: '#8a8279',
          light: '#b3aba0',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.32em',
      },
      maxWidth: {
        site: '88rem',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        // Gentle idle "levitation" for the carousel Poruwas
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3%)' },
        },
        'float-shadow': {
          '0%, 100%': { transform: 'scaleX(1)', opacity: '0.75' },
          '50%': { transform: 'scaleX(0.82)', opacity: '0.45' },
        },
        'float-reflect': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8%)' },
        },
        // Jasmine petals drifting down around the centre Poruwa (distance set via --fall)
        'petal-fall': {
          '0%': { transform: 'translate3d(0, -24px, 0)', opacity: '0' },
          '12%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translate3d(0, var(--fall, 520px), 0)', opacity: '0' },
        },
        'petal-sway': {
          '0%': { transform: 'translateX(-16px) rotate(-30deg)' },
          '100%': { transform: 'translateX(16px) rotate(40deg)' },
        },
        // Soft breathing of the stage spotlight
        'spot-breathe': {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        'soft-pulse': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        'scroll-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        float: 'float 6.5s ease-in-out infinite',
        'float-shadow': 'float-shadow 6.5s ease-in-out infinite',
        'float-reflect': 'float-reflect 6.5s ease-in-out infinite',
        'petal-fall': 'petal-fall 12s linear infinite',
        'petal-sway': 'petal-sway 3.2s ease-in-out infinite alternate',
        'spot-breathe': 'spot-breathe 7s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'scroll-line': 'scroll-line 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
    },
  },
  plugins: [],
};
