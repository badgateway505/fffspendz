/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0f172a',
          700: '#1e293b',
          500: '#475569',
          200: '#e2e8f0',
        },
        coral: '#ff6f61',
        mint: '#50e3c2',
        sunshine: '#ffd166',
      },
      fontFamily: {
        display: ['"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
