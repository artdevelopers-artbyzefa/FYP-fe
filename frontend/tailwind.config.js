/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original colors from first config
        primary: '#1a2a6c',
        secondary: '#3b5bdb',
        lightbg: '#f0f4fd',

        // Updated CUI Abbottabad shades from second config
        navy: {
          DEFAULT: '#1e3a8a', 
          dark: '#172554',
        },
        blue: {
          bright: '#2563eb', 
          soft: '#eff6ff',   
        },
      },
      // Combined Font Families
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Enhanced border radius for premium UI
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}