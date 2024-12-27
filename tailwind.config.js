/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      details: {
        'no-marker': {
          '::-webkit-details-marker': {
            display: 'none',
          },
        },
      },
      boxShadow: {
        'custom': '5px 5px 10px rgba(0, 0, 0, 0.2)',
        'custom-btn-off': '2px 2px 2px #f9f9f9, -2px -2px 2px rgb(103, 103, 109)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-from-bottom': 'fadeInFromBottom 1s ease-in-out',
        'slide-in-from-right': 'slideInFromRight 1s ease-in-out',
        'slide-in-from-left': 'slideInFromLeft 1s ease-in-out',
        'pulse': 'pulse 1s',
      },
      keyframes: {
        fadeIn: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeInFromBottom: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        pulse: {
          '0%': { transform: 'scale(0.5)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },

      },
    },
  },
  plugins: [],
}