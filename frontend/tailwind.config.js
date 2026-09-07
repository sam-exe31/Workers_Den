/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: "#0B0B0D",
          light: "#F7F6F2",
        },
        card: {
          light: "#FFFFFF",
          dark: "#16161A",
        },
        accent: {
          DEFAULT: "#F4A340",
          hover: "#E09230",
        },
        muted: {
          dark: "#57575E",
          light: "#A0A0AA",
        }
      },
      borderRadius: {
        btn: "10px",
        card: "14px",
        container: "20px",
      },
      fontFamily: {
        heading: ["Space Grotesk", "Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};