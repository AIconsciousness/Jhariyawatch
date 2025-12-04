/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
      }
    },
  },
  plugins: [],
}
