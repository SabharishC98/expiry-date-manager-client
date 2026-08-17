/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // slate-900
        foreground: "#f8fafc", // slate-50
        primary: {
          DEFAULT: "#0984e3",
          hover: "#0873c4",
        },
        secondary: {
          DEFAULT: "#e17055",
          hover: "#cc654c",
        },
        card: "#1e293b", // slate-800
        cardForeground: "#f1f5f9", // slate-100
        input: "#334155", // slate-700
        border: "#334155", // slate-700
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
