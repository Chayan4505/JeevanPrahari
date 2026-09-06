/** @type {import('tailwindcss').Config} */
export default {
  // Light mode is now the default (no dark mode class toggling needed by default)
  // Optionally add dark mode support if needed in future
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // GIGW Compliant Government Colors
        'gov-navy': {
          50: '#f0f4f9',
          100: '#e1e9f3',
          200: '#c3d2e7',
          300: '#a5bce1',
          400: '#5b8ad4',
          500: '#1e3a8a', // Primary government navy
          600: '#1e40af',
          700: '#1e3a8a', // Deep navy (#1E3A8A)
          800: '#1e3a8a',
          900: '#0f172a', // Darkest navy (#0F172A)
        },
        'gov-saffron': {
          50: '#fef3e2',
          100: '#fce7c6',
          200: '#f9cf8d',
          300: '#f6b754',
          400: '#f3a03a',
          500: '#d97706', // Deep saffron
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        'alert-critical': {
          bg: '#fef2f2',    // bg-red-50
          border: '#dc2626', // border-red-600
          text: '#7f1d1d',   // text-red-900
          tag: '#dc2626',    // bg-red-600
        },
        'alert-high': {
          bg: '#fff7ed',     // bg-orange-50
          border: '#d97706', // border-orange-600
          text: '#7c2d12',   // text-orange-900
          tag: '#d97706',    // bg-orange-600
        },
        'alert-moderate': {
          bg: '#fefce8',     // bg-yellow-50
          border: '#ca8a04', // border-yellow-600
          text: '#713f12',   // text-yellow-900
          tag: '#ca8a04',    // bg-yellow-600
        },
        'alert-low': {
          bg: '#f0fdf4',     // bg-green-50
          border: '#15803d', // border-green-700
          text: '#15803d',   // text-green-900
          tag: '#15803d',    // bg-green-700
        },
        // Standard semantic colors for status
        'status-safe': '#059669',     // Emerald-600
        'status-warning': '#d97706',  // Amber-600
        'status-critical': '#dc2626', // Red-600
        'status-info': '#0284c7',     // Sky-600
      },
      backgroundColor: {
        'app-bg': '#f8fafc',      // Slate-50 (light background)
        'card-bg': '#ffffff',     // White card background
        'header-bg': '#0f172a',   // Deep navy header
        'nav-bg': '#1e3a8a',      // Navy navigation
      },
      textColor: {
        'app-text': '#1e293b',    // Dark slate for body text
        'header-text': '#ffffff', // White text on dark headers
      },
      borderColor: {
        'app-border': '#cbd5e1',  // Slate-300 for light borders
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      },
      fontFamily: {
        'sans': ['Inter', 'Noto Sans', 'Arial', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'heading': ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'none': 'none',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, fill, stroke',
      },
    },
  },
  plugins: [],
}

