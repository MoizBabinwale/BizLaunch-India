/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        "primary-dark": "#1D4ED8",
        "primary-light": "#93C5FD",
        "primary-sky": "#EAF2FF",
        secondary: "#0F766E",
        "secondary-soft": "#DDF7F4",
        background: "#F5F7FB",
        card: "#FFFFFF",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        "accent-purple": "#7C3AED",
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        muted: "#64748B",
        border: "#E2E8F0",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.08)",
        panel: "0 16px 40px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        display: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(37, 99, 235, 0.14), transparent 26%), radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 22%), linear-gradient(180deg, #f8fbff 0%, #f5f7fb 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
