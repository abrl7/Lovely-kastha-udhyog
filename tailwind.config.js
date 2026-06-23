/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        walnut: "#4A3528",
        "walnut-deep": "#2E2017",
        cream: "#EFE6D8",
        "cream-soft": "#F7F1E6",
        sienna: "#B5552B",
        "sienna-dark": "#9C4621",
        charcoal: "#2B2620",
        brass: "#A8854F",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-work-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
