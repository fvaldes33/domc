const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
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
