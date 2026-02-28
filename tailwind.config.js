/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.1)',
        'glass-dark': 'rgba(0, 0, 0, 0.4)',
        border: 'rgba(255, 255, 255, 0.2)',
        'border-dark': 'rgba(255, 255, 255, 0.1)'
      }
    },
  },
  plugins: [],
}
