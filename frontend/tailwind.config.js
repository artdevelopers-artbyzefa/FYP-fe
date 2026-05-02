/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0d1b4b',
        blue: '#1e3fa8',
        'blue-bright': '#2251f3',
      },
    },
  },
  plugins: [],
}