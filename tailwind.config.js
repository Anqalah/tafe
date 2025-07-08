/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/js/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#D4AF37",
        secondary: "#2A4365",
        accent: "#C53030",
        neutral_text: "#F5F7FA",
        neutral_bg: "#F5F7FA ",
      },
      utilities: {
        ".hide-scrollbar": {
          /* Untuk browser berbasis WebKit (Chrome, Safari) */
          "-webkit-overflow-scrolling": "touch",
          "-webkit-scrollbar": "none",
          /* Untuk Firefox */
          "scrollbar-width": "none",
        },
        ".hide-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
};
