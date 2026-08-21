/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          darkest: '#07080a',
          bg: '#0b0d12',
          surface: '#11141c',
          card: '#161b26',
          panel: '#1e2433',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.05)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          emerald: {
            DEFAULT: '#10b981',
            light: '#34d399',
            glow: '#059669',
            subtle: 'rgba(16, 185, 129, 0.12)',
            border: 'rgba(16, 185, 129, 0.35)',
          },
          sage: {
            DEFAULT: '#84cc16',
            light: '#a3e635',
            subtle: 'rgba(132, 204, 22, 0.12)',
          },
          gold: {
            DEFAULT: '#d97706',
            light: '#f59e0b',
            subtle: 'rgba(245, 158, 11, 0.12)',
          },
          rose: {
            DEFAULT: '#e11d48',
            light: '#f43f5e',
            subtle: 'rgba(244, 63, 94, 0.12)',
          },
          stone: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        },
        doof: {
          // Compatibility aliases
          darkest: '#07080a',
          dark: '#0b0d12',
          bg: '#0b0d12',
          panel: '#11141c',
          card: '#161b26',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1e2433',
          purple: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
            glow: '#6ee7b7',
          },
          green: {
            DEFAULT: '#10b981',
            acid: '#34d399',
            neon: '#10b981',
            glow: '#6ee7b7',
          },
          red: {
            DEFAULT: '#f43f5e',
            dark: '#be123c',
            glow: '#fda4af',
          },
          yellow: {
            DEFAULT: '#f59e0b',
            bright: '#fbbf24',
            hazard: '#d97706',
          },
          cyan: {
            DEFAULT: '#06b6d4',
            bright: '#22d3ee',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        tech: ['"Plus Jakarta Sans"', 'sans-serif'],
        comic: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'zen-mesh': 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.08), transparent 60%), radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.04), transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'emerald-gradient': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      boxShadow: {
        'zen-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.3)',
        'zen-md': '0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
        'zen-lg': '0 16px 40px -8px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
        'zen-glow': '0 0 30px -5px rgba(16, 185, 129, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 4s ease-in-out infinite alternate',
      },
      keyframes: {
        breathe: {
          '0%': { opacity: '0.4', transform: 'scale(0.98)' },
          '100%': { opacity: '0.8', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
