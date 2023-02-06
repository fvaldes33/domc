const konstaConfig = require("konsta/config");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = konstaConfig({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ocean: "#031b4d",
        "ios-light-surface": "#fff",
        "ios-light-surface-2": "#fff",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        ios: ["Inter", ...defaultTheme.fontFamily.sans],
        material: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
});
