/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },
      colors: {
        gold: {
          50: '#FDFBF3',
          100: '#FBF6E3',
          200: '#F6EABF',
          300: '#F1DD9B',
          400: '#ECD077',
          500: '#DAA520', // Main gold color
          600: '#C69320',
          700: '#A67B1B',
          800: '#866317',
          900: '#654B12',
        },
      },
    },
  },
  plugins: [],
}
