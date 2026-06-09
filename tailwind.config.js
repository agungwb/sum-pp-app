/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Men-scan folder src yang asli dari luar
  ],
  theme: {
    extend: {
      colors: {
        fundex: {
          dark: '#0b132a',
          teal: '#0d9488',
          gold: '#d97706',
        },
      },
    },
  },
  plugins: [],
}