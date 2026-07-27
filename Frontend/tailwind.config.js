/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
}