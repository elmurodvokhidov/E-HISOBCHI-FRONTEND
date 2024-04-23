/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        dim: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        smooth: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
        "dim-right": "7px 0px 29px 0px rgba(100, 100, 111, 0.2)",
      },
      screens: {
        sm: '425px',
        xsm: '375px',
        '2xsm': '320px'
      }
    },
  },
  plugins: [],
}