/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        'teal-primary': '#006D5B',
        'teal-dark': '#004F42',
        'teal-light': '#E8F5F2',
        'lavender': '#E0E7FF',
        'bg-soft': '#F8FAFC',
        'bg-white': '#FFFFFF',
        'text-dark': '#1E293B',
        'text-muted': '#64748B',
        'border-light': '#E2E8F0',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
=======
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
>>>>>>> origin/school-details
      },
    },
  },
  plugins: [],
}