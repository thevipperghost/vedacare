/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#7C3AED', dark: '#6D28D9', light: '#EDE9FE', ring: 'rgba(124,58,237,0.3)' },
        saffron: { DEFAULT: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
        ivory: '#FAF9FF',
        pearl: '#F5F3FF',
        ink: '#1E1B4B',
        muted: '#6B7280',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 1px 3px rgba(124,58,237,0.04), 0 6px 24px rgba(124,58,237,0.06)',
        pop: '0 8px 32px rgba(124,58,237,0.12)',
      },
    },
  },
  plugins: [],
};
