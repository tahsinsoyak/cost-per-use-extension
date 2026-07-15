import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./options.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        elevated: 'var(--color-elevated)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        sans: ['Manrope Variable', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono Variable', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'premium': '0 12px 35px -24px rgba(19, 34, 53, 0.45), 0 2px 8px rgba(19, 34, 53, 0.05)',
        'premium-hover': '0 18px 42px -24px rgba(19, 34, 53, 0.58), 0 5px 14px rgba(19, 34, 53, 0.07)',
        'premium-dark': '0 16px 40px -24px rgba(0, 0, 0, 0.7), 0 3px 12px rgba(0, 0, 0, 0.28)',
        'premium-dark-hover': '0 22px 48px -22px rgba(0, 0, 0, 0.82), 0 6px 16px rgba(0, 0, 0, 0.32)',
      }
    },
  },
  plugins: [],
} satisfies Config;
