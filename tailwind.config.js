/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        doof: {
          darkest: '#070c10',
          dark: '#0d171e',
          bg: '#111e27',
          panel: '#172733',
          card: '#1d3140',
          border: '#2a455a',
          hover: '#243a4c',
          purple: {
            DEFAULT: '#8b2fc9',
            light: '#a855f7',
            dark: '#581c87',
            glow: '#c084fc',
          },
          green: {
            DEFAULT: '#10b981',
            acid: '#22c55e',
            neon: '#00ff88',
            glow: '#4ade80',
          },
          red: {
            DEFAULT: '#ef4444',
            dark: '#b91c1c',
            glow: '#f87171',
          },
          yellow: {
            DEFAULT: '#f59e0b',
            bright: '#fbbf24',
            hazard: '#d97706',
          },
          cyan: {
            DEFAULT: '#06b6d4',
            bright: '#22d3ee',
          },
          perry: {
            teal: '#0284c7',
            orange: '#ea580c',
            fedora: '#78350f',
          }
        }
      },
      fontFamily: {
        comic: ['"Bangers"', '"Bungee"', 'cursive', 'sans-serif'],
        tech: ['"Chakra Petch"', '"Rajdhani"', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hazard-pattern': 'repeating-linear-gradient(45deg, #eab308, #eab308 12px, #18181b 12px, #18181b 24px)',
        'hazard-red': 'repeating-linear-gradient(45deg, #dc2626, #dc2626 12px, #18181b 12px, #18181b 24px)',
        'blueprint-grid': 'linear-gradient(to right, rgba(6, 182, 212, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.08) 1px, transparent 1px)',
        'lab-mesh': 'radial-gradient(circle at 50% 0%, rgba(139, 47, 201, 0.15), transparent 70%), radial-gradient(circle at 100% 100%, rgba(0, 255, 136, 0.08), transparent 50%)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px) rotate(-1deg)' },
          '40%, 80%': { transform: 'translateX(4px) rotate(1deg)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(0, 255, 136, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
