// Deafference design tokens — single source of truth.
// Consumed directly in JS/TS, and mirrored in tokens.css and tailwind.config.js.

export const colors = {
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
}

export const typography = {
  display: { fontSize: "2.5rem", lineHeight: "1.2", fontWeight: "700" },
  h1: { fontSize: "2rem", lineHeight: "1.25", fontWeight: "700" },
  h2: { fontSize: "1.5rem", lineHeight: "1.3", fontWeight: "600" },
  h3: { fontSize: "1.25rem", lineHeight: "1.4", fontWeight: "600" },
  bodyLg: { fontSize: "1.125rem", lineHeight: "1.5", fontWeight: "400" },
  bodyBase: { fontSize: "1rem", lineHeight: "1.5", fontWeight: "400" },
  caption: { fontSize: "0.75rem", lineHeight: "1.4", fontWeight: "700", letterSpacing: "0.05em" },
}

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
}

export const radii = {
  card: "1.5rem",
  cardLg: "2rem",
  pill: "9999px",
  badge: "0.75rem",
}

export const shadows = {
  cardDefault: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
  cardHover: "0 20px 35px -10px rgba(238, 108, 43, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.04)",
}

export const tokens = { colors, typography, spacing, radii, shadows }

export default tokens
