import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // The Cognitive Canvas - Light & Dark Mode Palette
        // Using CSS variables for theme switching
        surface: 'var(--surface)',
        'surface-container': 'var(--surface-container)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-bright': 'var(--surface-bright)',
        'surface-dim': 'var(--surface-dim)',
        'surface-variant': 'var(--surface-variant)',
        
        // Primary - The Intelligence Color
        primary: 'var(--primary)',
        'primary-fixed': 'var(--primary-fixed)',
        'primary-container': 'var(--primary-container)',
        'on-primary': 'var(--on-primary)',
        'on-primary-container': 'var(--on-primary-container)',
        
        // Secondary
        secondary: 'var(--secondary)',
        'secondary-fixed': 'var(--secondary-fixed)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary': 'var(--on-secondary)',
        'on-secondary-container': 'var(--on-secondary-container)',
        
        // Tertiary - AI Insights
        tertiary: 'var(--tertiary)',
        'tertiary-fixed': 'var(--tertiary-fixed)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-tertiary': 'var(--on-tertiary)',
        'on-tertiary-container': 'var(--on-tertiary-container)',
        
        // Text Colors
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'on-surface-dim': 'var(--on-surface-dim)',
        
        // Outline
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        
        // Semantic Colors
        error: 'var(--error)',
        'error-container': 'var(--error-container)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        'warning-container': 'var(--warning-container)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '0em', fontWeight: '600' }],
        'headline-lg': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '600' }],
        'headline-md': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '600' }],
        'headline-sm': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '600' }],
        'title-lg': ['1.375rem', { lineHeight: '1.4', letterSpacing: '0em', fontWeight: '600' }],
        'title-md': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'label-md': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.03em', fontWeight: '500' }],
        'label-sm': ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      borderRadius: {
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        // Light mode ambient shadow (subtle, natural light)
        'ambient': '0 4px 24px -1px rgba(25, 28, 30, 0.04)',
        'ambient-lg': '0 8px 40px -2px rgba(25, 28, 30, 0.06)',
        // Dark mode will be overridden by CSS
      },
    },
  },
  plugins: [],
};

export default config;
