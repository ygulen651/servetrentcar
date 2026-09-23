/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#c99a3d",
        ink: "#171a1d",
        muted: "#687078",
        cream: "#f4f2ed",
        line: "#dcdedb",
      },
    },
  },
  plugins: [],
}