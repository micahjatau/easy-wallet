/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic theme tokens (CSS variable powered)
        background: 'rgb(var(--background) / <alpha-value>)',
        'background-elevated': 'rgb(var(--background-elevated) / <alpha-value>)',
        'background-muted': 'rgb(var(--background-muted) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        'foreground-muted': 'rgb(var(--foreground-muted) / <alpha-value>)',
        'foreground-subtle': 'rgb(var(--foreground-subtle) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-hover': 'rgb(var(--primary-hover) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-background': 'rgb(var(--success-background) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        'error-background': 'rgb(var(--error-background) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        'warning-background': 'rgb(var(--warning-background) / <alpha-value>)',
        'brand-forest': 'rgb(var(--brand-forest) / <alpha-value>)',
        'brand-cream': 'rgb(var(--brand-cream) / <alpha-value>)',

        // Pocket Ledger Design System
        'forest': '#1B4332',
        'cream': '#FDF8F5',
        'sage': '#D8E2DC',
        'charcoal': '#333333',
        'primary-legacy': '#1B4332',
        'background-light': '#FDF8F5',
        'background-dark': '#102215',
        // Legacy colors (keeping for compatibility)
        'ink': '#1f1a14',
        'slate': '#4d4a44',
        'sand': '#f7f1ea',
        'dune': '#e6dccf',
        'pine': '#1B4332',
        'amber': '#f2b866',
        'coral': '#ee8c65',
        'lagoon': '#b7d9d1',
      },
      fontFamily: {
        // Pocket Ledger Design System
        'display': ['Poppins', 'sans-serif'],
        'sans': ['Poppins', 'sans-serif'],
        'serif': ['Poppins', 'sans-serif'],
        // Legacy fonts
        'body': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 40px -30px rgba(27, 67, 50, 0.25)',
        float: '0 14px 40px -20px rgba(27, 67, 50, 0.2)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 600ms ease-out both',
        'float-slow': 'floatSlow 14s ease-in-out infinite',
        shimmer: 'shimmer 6s ease-in-out infinite',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(216, 226, 220, 0.5), transparent 65%)',
      },
    },
  },
  plugins: [],
}
