import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pp-primary': '#2D3250',
        'pp-secondary': '#7077A1',
        'pp-accent': '#F6B17A',
        'pp-bg-light': '#F7F8FB',
        'pp-bg-dark': '#111218',
        'pp-card': '#1C1F2E',
        'pp-card-hover': '#222640',
        'pp-border': '#2D3250',
        'pp-text-muted': '#7077A1',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.38s ease-out forwards',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #111218 0%, #1C1F2E 50%, #2D3250 100%)',
        'gradient-card': 'linear-gradient(135deg, #1C1F2E 0%, #222640 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F6B17A 0%, #e89060 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(246,177,122,0.12) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-accent': '0 0 24px rgba(246, 177, 122, 0.2)',
        'glow-primary': '0 0 32px rgba(45, 50, 80, 0.5)',
        'card': '0 2px 20px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
