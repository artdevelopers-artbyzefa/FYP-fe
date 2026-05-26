/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        poppins: ['Poppins', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: '#1e3a8a',
        secondary: '#2563eb',
        lightbg: '#eff6ff',
        navy: {
          DEFAULT: '#1e3a8a', 
          dark: '#172554',
        },
        blue: {
          bright: '#2563eb', 
          soft: '#eff6ff',   
        },
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        pending: '#b45309'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.6' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        pulseDot: 'pulseDot 1.5s infinite',
        bounceSlow: 'bounceSlow 3s infinite',
      }
    }
  },
  plugins: [],
}
