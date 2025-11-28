/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }

  module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  safelist: [
    { pattern: /(bg|hover:bg|text|border)-(blue|red|green|yellow)-(100|200|800)/ }
  ]
}