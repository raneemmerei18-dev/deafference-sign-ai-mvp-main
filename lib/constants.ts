export const COMPANY_NAME = "Deafference"
export const COMPANY_TAGLINE = "AI speech-to-sign translation for real-world communication"

export const APP_ROUTES = {
  home: "/",
  translate: "/translate",
  history: "/history",
  settings: "/settings",
  profile: "/profile",
  admin: "/admin",
  about: "/about",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
} as const

// Exact link set + order required for the primary navbar.
export const LANDING_NAV = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const

// Additional site sections not in the primary nav, surfaced in the footer instead.
export const FOOTER_EXPLORE_NAV = [
  ...LANDING_NAV,
  { label: "Why Us", href: "#why-choose-us" },
  { label: "Scenarios", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
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

// Shared between the full FAQ accordion and the compact preview card next to
// "How It Works" — one source of truth so the preview never drifts out of
// sync with the real answers.
export const FAQ_ITEMS = [
  {
    title: "What does Deafference include today?",
    content:
      "A polished landing page structure and an independent translation app architecture, ready for future product expansion.",
  },
  {
    title: "Does the landing page depend on the translation workflow?",
    content:
      "No. The marketing site and the AI translation app are intentionally separated so they can evolve on different timelines.",
  },
  {
    title: "Can dashboard, pricing, and docs be added later?",
    content:
      "Yes. The folder structure and shared primitives are designed to make additional pages straightforward to add.",
  },
  {
    title: "Is backend logic implemented yet?",
    content:
      "No. This build intentionally stops at architecture, reusable components, and placeholder content.",
  },
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
      { label: "Profile", href: APP_ROUTES.profile, icon: "UserCircle2" },
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
