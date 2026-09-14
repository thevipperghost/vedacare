/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#6366F1', dark: '#4F46E5', light: '#EEF2FF', ring: 'rgba(99,102,241,0.3)' },
        accent: { DEFAULT: '#F59E0B', light: '#FEF3C7', dark: '#D97706' },
        success: { DEFAULT: '#10B981', light: '#D1FAE5' },
        danger: { DEFAULT: '#EF4444', light: '#FEE2E2' },
        ivory: '#F8FAFC',
        pearl: '#F1F5F9',
        ink: '#0F172A',
        muted: '#64748B',
      },
      fontFamily: { sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'Fira Code', 'monospace'] },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)',
        'gradient-warm': 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
        'gradient-cool': 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
        'gradient-rose': 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)',
        'gradient-emerald': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-surface': 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(99,102,241,0.06)',
        pop: '0 8px 40px rgba(99,102,241,0.12)',
        glow: '0 0 20px rgba(99,102,241,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
