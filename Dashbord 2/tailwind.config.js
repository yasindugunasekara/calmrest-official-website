/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fbf7ee',
          100: '#f5ebcf',
          200: '#ebd49f',
          300: '#deba6a',
          400: '#d09a3f',
          500: '#cca353',
          600: '#a77c38',
          700: '#855c2c',
          800: '#684726',
          900: '#553a21',
          DEFAULT: '#cca353',
        },
        'luxury-blue': {
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
          950: '#070b13',
        }
      }
    },
  },
  plugins: [],
};
