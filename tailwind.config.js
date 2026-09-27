/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#00d2ff',
          purple: '#9b51e0',
          pink: '#ff2a85',
          gradientStart: '#00d2ff',
          gradientMid: '#9b51e0',
          gradientEnd: '#ff2a85',
        },
        sidekick: {
          bg: '#f8fafc',
          panel: 'rgba(255, 255, 255, 0.94)',
          card: '#ffffff',
          cardHover: '#fbfcfd',
          cardSubtle: '#f1f5f9',
          border: 'rgba(226, 232, 240, 0.9)',
          borderHover: 'rgba(155, 81, 224, 0.35)',
          textPrimary: '#0f172a',
          textSecondary: '#475569',
          textMuted: '#94a3b8',
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #00d2ff 0%, #9b51e0 50%, #ff2a85 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(0, 210, 255, 0.12) 0%, rgba(155, 81, 224, 0.12) 50%, rgba(255, 42, 133, 0.12) 100%)',
        'brand-gradient-hover': 'linear-gradient(135deg, #00c0eb 0%, #8942cc 50%, #e62274 100%)',
        'card-glow': 'radial-gradient(ellipse at top left, rgba(155, 81, 224, 0.08), transparent 70%)',
      },
      boxShadow: {
        'sidekick-light': '0 25px 60px -15px rgba(15, 23, 42, 0.18), 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'pill-light': '0 12px 30px -4px rgba(15, 23, 42, 0.14), 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        'card-light': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(155, 81, 224, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'brand-glow': '0 0 20px -3px rgba(155, 81, 224, 0.35)',
        'cyan-glow': '0 0 20px -3px rgba(0, 210, 255, 0.4)',
        'pink-glow': '0 0 20px -3px rgba(255, 42, 133, 0.4)',
        'drawer-light': '-15px 0 35px -5px rgba(15, 23, 42, 0.12), -4px 0 10px -2px rgba(15, 23, 42, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(0.97) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.98)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slide-left 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
