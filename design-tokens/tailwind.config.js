/** @type {import('tailwindcss').Config} */
// Deafference design tokens — single source of truth.
// Mirrors tokens.js and tokens.css. Merge this `theme.extend` block into the
// project's Tailwind config (or `@config` this file in, on Tailwind v3).
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            DEFAULT: "#EE6C2B",
            hover: "#E85D04",
            tint: "#FFF2E8",
          },
          yellow: "#F59E0B",
        },
        text: {
          primary: "#1A1A1A",
          navy: "#0F172A",
          muted: "#4A5568",
        },
        surface: {
          canvas: "#FFFFFF",
          warm: "#FDFBF7",
        },
        border: {
          DEFAULT: "#E2E8F0",
          focus: "#FDBA74",
        },
      },
      fontSize: {
        display: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h1: ["2rem", { lineHeight: "1.25", fontWeight: "700" }],
        h2: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h3: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.5", fontWeight: "400" }],
        "body-base": ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "700", letterSpacing: "0.05em" }],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      borderRadius: {
        card: "1.5rem",
        "card-lg": "2rem",
        pill: "9999px",
        badge: "0.75rem",
      },
      boxShadow: {
        "card-default": "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        "card-hover": "0 20px 35px -10px rgba(238, 108, 43, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
}
