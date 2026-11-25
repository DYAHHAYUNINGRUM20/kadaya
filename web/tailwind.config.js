/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          200: '#DBEAFE',
          300: '#60A5FA',
          400: '#2563EB',
          500: '#1D4ED8',
          600: '#1E3A8A'
        },
        secondary: {
          100: '#FCE7F3',
          200: '#F472B6',
          300: '#DB2777',
          400: '#BE185D',
          500: '#831843'
        },
        neutral: {
          100: '#F3F4F6',
          200: '#D1D5DB',
          300: '#6B7280',
          400: '#374151',
          500: '#111827'
        },
        pokja: {
          1: '#2563EB',
          2: '#DB2777',
          3: '#0284C7',
          4: '#E11D48'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
