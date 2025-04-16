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
        primary: "#2A4365",
        secondary: "#D4AF37",
        accent: "#C53030",
        neutral_teks: "#F5F7FA",
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
