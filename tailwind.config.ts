import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2564CF',
          600: '#215ABB',
          700: '#1B4C9E',
        },
        'todo-blue': '#2564CF',
        'todo-hover': '#215ABB',
        'todo-gray': '#F5F5F5',
        'todo-border': '#E5E5E5',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Open Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
