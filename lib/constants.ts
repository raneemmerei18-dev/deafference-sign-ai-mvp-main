export const COMPANY_NAME = "Deafference"
export const COMPANY_TAGLINE = "AI speech-to-sign translation for real-world communication"

export const APP_ROUTES = {
  home: "/",
  translate: "/translate",
  history: "/history",
  settings: "/settings",
  about: "/about",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
} as const

// Exact link set + order required for the primary navbar. "For you" and "For
// organisations" map to the closest existing sections (scenario grid and the
// value-proposition section) rather than net-new pages.
export const LANDING_NAV = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For you", href: "#use-cases" },
  { label: "For organisations", href: "#why-choose-us" },
  { label: "Resources", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
] as const

// Additional site sections not in the primary nav, surfaced in the footer instead.
export const FOOTER_EXPLORE_NAV = [
  ...LANDING_NAV,
  { label: "Features", href: "#features" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Translate", href: APP_ROUTES.translate },
] as const

export const FOOTER_COMPANY_NAV = [
  { label: "Demo center", href: "#demo" },
  { label: "Privacy policy", href: "#privacy" },
] as const

export const LANDING_METRICS = [
  { value: "< 10s", label: "to get a usable result" },
  { value: "24/7", label: "always-on communication support" },
  { value: "Multilingual", label: "designed for global teams" },
] as const

// App-shell sidebar: every application route NOT already reachable from the
// top navbar (LANDING_NAV anchors + the Login/Sign Up buttons). Icon values
// are lookup keys into the ICONS map in components/app-shell/sidebar.tsx —
// kept as strings here so this file stays framework/JSX-free.
export const SIDEBAR_NAV = [
  {
    heading: "Workspace",
    items: [
      { label: "Translate", href: APP_ROUTES.translate, icon: "Mic" },
      { label: "History", href: APP_ROUTES.history, icon: "History" },
      { label: "Settings", href: APP_ROUTES.settings, icon: "Settings2" },
    ],
  },
  {
    heading: "Demos & Prototypes",
    items: [
      { label: "Components Demo", href: "/components-demo", icon: "LayoutGrid" },
      { label: "State Machine Demo", href: "/enhanced-state-machine-demo", icon: "GitBranch" },
      { label: "Mock Testing Demo", href: "/mock-testing-demo", icon: "FlaskConical" },
      { label: "Gloss Buffer Demo", href: "/translation-with-buffer", icon: "Layers" },
    ],
  },
] as const
