/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cartoon: {
          bg: '#F0F7FF',
          card: '#FFFFFF',
          sky: '#0284C7',
          skyLight: '#38BDF8',
          skySoft: '#E0F2FE',
          yellow: '#F59E0B',
          yellowLight: '#FBBF24',
          yellowSoft: '#FEF3C7',
          emerald: '#10B981',
          emeraldLight: '#34D399',
          emeraldSoft: '#D1FAE5',
          coral: '#FF5252',
          coralLight: '#FF7675',
          coralSoft: '#FFDAD6',
          navy: '#0F172A',
          slate: '#1E293B',
          border: '#0F172A'
        }
      },
      boxShadow: {
        'cartoon': '0 8px 0 #0F172A, 0 10px 20px rgba(15, 23, 42, 0.1)',
        'cartoon-lg': '0 12px 0 #0F172A, 0 15px 30px rgba(15, 23, 42, 0.15)',
        'cartoon-sm': '0 4px 0 #0F172A',
        'cartoon-btn': '0 5px 0 #0F172A',
        'cartoon-yellow': '0 6px 0 #D97706',
        'cartoon-sky': '0 6px 0 #0369A1',
        'cartoon-green': '0 6px 0 #047857',
        'cartoon-red': '0 6px 0 #DC2626'
      },
      animation: {
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 1.8s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}


