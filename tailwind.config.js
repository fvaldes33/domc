const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        slideUp: "slideUp 0.3s ease-in-out forwards",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: 0, transform: "translatey(30px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" },
        },
      },
      colors: {
        ocean: "#031b4d",
        "ocean-2": "#0061eb",
        "ios-light-surface": "#fff",
        "ios-light-surface-2": "#fff",
      },
      fontFamily: {
        sans: ["var(--nunito-font)", ...defaultTheme.fontFamily.sans],
        ios: ["var(--nunito-font)", ...defaultTheme.fontFamily.sans],
        material: ["var(--nunito-font)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("tailwindcss-safe-area"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
