/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1e40af',
        'brand-blue-dark': '#1e3a8a',
        'brand-blue-light': '#3b82f6',
        'brand-red': '#dc2626',
        'brand-red-dark': '#b91c1c',
      },
      borderRadius: {
        site: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
