/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B5CAB',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#1E73BE',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#0EA5E9',
          foreground: '#ffffff',
        },
        teal: '#14b8a6',
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};
