/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a2e',
          dark: '#16213e',
          light: '#0f3460'
        },
        risk: {
          critical: '#dc2626',
          high: '#ea580c',
          moderate: '#ca8a04',
          low: '#65a30d',
          stable: '#16a34a',
          uplifting: '#2563eb'
        }
      },
      fontFamily: {
        hindi: ['Noto Sans Devanagari', 'sans-serif']
      },
      animation: {
        'subtle-zoom': 'subtleZoom 20s ease-in-out infinite alternate',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'float-slow': 'float 15s ease-in-out infinite',
        'float-slower': 'float 20s ease-in-out infinite reverse'
      },
      keyframes: {
        subtleZoom: {
          '0%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1.15)' }
        },
        gradientShift: {
          '0%, 100%': { opacity: '0.95' },
          '50%': { opacity: '0.85' }
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(240deg)' }
        }
      }
    },
  },
  plugins: [],
}
