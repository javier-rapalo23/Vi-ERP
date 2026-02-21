/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vixo Green - Full Scale
        vixo: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E', // Primary
          600: '#16A34A', // Dark
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
          DEFAULT: '#22C55E',
        },
        // Accent Colors
        'vixo-amber': {
          light: '#FCD34D',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        'vixo-blue': {
          light: '#60A5FA',
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
        },
        'vixo-purple': {
          light: '#C084FC',
          DEFAULT: '#A855F7',
          dark: '#9333EA',
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'vixo-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'vixo-pulse': 'vixo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'vixo': '0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06)',
        'vixo-lg': '0 10px 15px -3px rgba(34, 197, 94, 0.2), 0 4px 6px -2px rgba(34, 197, 94, 0.1)',
        'vixo-xl': '0 20px 25px -5px rgba(34, 197, 94, 0.2), 0 10px 10px -5px rgba(34, 197, 94, 0.1)',
      },
    },
  },
  plugins: [],
};
