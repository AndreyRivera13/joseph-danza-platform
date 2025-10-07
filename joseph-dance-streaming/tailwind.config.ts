import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f5ff',
          100: '#eee6ff',
          200: '#d6c8ff',
          300: '#b6a0ff',
          400: '#9877ff',
          500: '#7a4dff',
          600: '#642ee6',
          700: '#521fbd',
          800: '#411a93',
          900: '#351775'
        }
      }
    }
  },
  plugins: []
} satisfies Config;