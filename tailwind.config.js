/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: "#2563EB",
        "primary-dark": "#1D4ED8",
        "primary-light": "#60A5FA",
        "primary-sky": "#DBEAFE",

        // Secondary Colors
        background: "#F8FAFC",
        card: "#FFFFFF",

        // Accent Colors
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        "accent-purple": "#7C3AED",

        // Text Colors
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        muted: "#94A3B8",

        // Border
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
