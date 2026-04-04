import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The Cognitive Canvas - Dark Mode Palette
        surface: '#0c1324', // The Void (Background)
        'surface-container-lowest': '#12182a',
        'surface-container-low': '#151b2d',
        'surface-container': '#191f31',
        'surface-container-high': '#23293c',
        'surface-container-highest': '#2a3145',
        'surface-bright': '#323a52',
        'surface-variant': '#1f2538',
        
        // Primary - The Primary Pulse (Indigo)
        primary: '#c0c1ff',
        'primary-fixed': '#dce1fb',
        'primary-container': '#4b4dd8',
        'on-primary': '#0c1324',
        'on-primary-container': '#ffffff',
        
        // Secondary
        secondary: '#a8b5ff',
        'secondary-container': '#3a3db8',
        'on-secondary': '#0c1324',
        'on-secondary-container': '#ffffff',
        
        // Tertiary - The Warm Accent
        tertiary: '#ffb695',
        'tertiary-fixed': '#ffdbcc',
        'tertiary-container': '#cc7a5c',
        'on-tertiary': '#0c1324',
        'on-tertiary-container': '#ffffff',
        
        // Text Colors
        'on-surface': '#dce1fb',
        'on-surface-variant': '#a8b5ff',
        'on-surface-dim': '#8f9cd9',
        
        // Outline
        outline: '#6b78a8',
        'outline-variant': '#4a5578',
        
        // Semantic Colors
        error: '#ffb4ab',
        'error-container': '#93000a',
        success: '#80de98',
        warning: '#ffcc80',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '0em' }],
        'headline-lg': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0em' }],
        'headline-md': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'headline-sm': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0em' }],
        'body-md': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'label-lg': ['0.875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'label-md': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.03em' }],
        'label-sm': ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      backdropBlur: {
        'glass': '12px',
      },
      boxShadow: {
        'ambient': '0 4px 24px -1px rgba(192, 193, 255, 0.04)',
        'ambient-lg': '0 8px 40px -2px rgba(192, 193, 255, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
