/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fcolor: "#3674B5", // Màu chủ đạo
        scolor: "#578FCA", // Màu phụ
        tcolor: "#A1E3F9", // Màu nền khi hover
        focolor: "#f9f9f9", // Màu nền background
        wcolor: "#ffffff",
        ficolor: "#01201B", // Màu đen chủ đạ o
        sicolor: "#C2C2C2", // Màu viền (border)
        gcolor: "#00BCD4", // Màu nhấn
        rcolor: "#FF0105", // Màu đen chủ đạo
        ycolor: "#FFFF00", // Màu nền chính
        darkBackground: "#181818",
        darkSubbackground: "#1e293b",
        darkText: "#e2e8f0",
        darkSubtext: "#94a3b8",
        darkBorder: "#334155",
      },
      details: {
        "no-marker": {
          "::-webkit-details-marker": {
            display: "none",
          },
        },
      },
      boxShadow: {
        custom: "5px 5px 10px rgba(0, 0, 0, 0.2)",
        "custom-btn-off":
          "2px 2px 2px #f9f9f9, -2px -2px 2px rgb(185, 185, 201)",
      },
      animation: {
        firework: "firework 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-in-out",
        "fade-in-from-bottom": "fadeInFromBottom 1s ease-in-out",
        "slide-in-from-right": "slideInFromRight 1s ease-in-out",
        "slide-in-from-left": "slideInFromLeft 1s ease-in-out",
        pulse: "pulse 1s",
        blink: 'blink 0.7s step-start infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { color: '#ffffff' },
          '50%':     { color: '#67e8f9' }, // tương ứng cyan-400
        },
        firework: {
          "0%": { transform: "scale(0.5)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        fadeIn: {
          "0%": { transform: "translateY(-100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeInFromBottom: {
          "0%": { transform: "translateY(100%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        pulse: {
          "0%": { transform: "scale(0.5)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
