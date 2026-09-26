import type { LucideIcon } from "lucide-react"

export type EmergencyCategoryId = "medical" | "police" | "fire" | "assistance" | "toggles"
export type EmergencyFilterId = "all" | EmergencyCategoryId

export type EmergencyCategoryMeta = {
  id: EmergencyCategoryId
  label: string
  shortLabel: string
  /** Exact brand hex per the emergency design spec — kept literal (not a token) on purpose. */
  color: string
}

export const EMERGENCY_CATEGORIES: EmergencyCategoryMeta[] = [
  { id: "medical", label: "Critical Medical Emergencies", shortLabel: "Medical", color: "#DC2626" },
  {
    id: "police",
    label: "Safety, Police & Law Enforcement",
    shortLabel: "Police/Safety",
    color: "#2563EB",
  },
  { id: "fire", label: "Fire & Disaster Evacuation", shortLabel: "Fire", color: "#EE6C2B" },
  {
    id: "assistance",
    label: "Immediate Assistance & Medical Devices",
    shortLabel: "Assistance",
    color: "#F59E0B",
  },
  {
    id: "toggles",
    label: "Rapid Bystander Response Toggles",
    shortLabel: "Quick Toggles",
    color: "#1A1A1A",
  },
]

export const EMERGENCY_CATEGORY_MAP: Record<EmergencyCategoryId, EmergencyCategoryMeta> =
  Object.fromEntries(EMERGENCY_CATEGORIES.map((c) => [c.id, c])) as Record<
    EmergencyCategoryId,
    EmergencyCategoryMeta
  >

export type EmergencyPhrase = {
  id: string
  category: EmergencyCategoryId
  icon: LucideIcon
  /** Short, bold, glanceable card label — the primary thing a panicked user reads. */
  label: string
  /** Full sentence spoken aloud and shown on the fullscreen broadcast card. */
  text: string
  /** Extra-large treatment for the YES / NO confirmation toggles. */
  xl?: boolean
  /** Overrides the category color for this card's icon (YES / NO). */
  iconColor?: string
}

// Icons are resolved once here (not inline in JSX) so the data file stays the
// single source of truth for "which icon means which emergency."
import {
  Accessibility,
  Ambulance,
  AlertTriangle,
  Bandage,
  Biohazard,
  Building2,
  CheckCircle2,
  DoorOpen,
  EarOff,
  Flame,
  GlassWater,
  HeartHandshake,
  HeartPulse,
  Hospital,
  Keyboard,
  Languages,
  MapPin,
  PenTool,
  PhoneCall,
  Pill,
  ShieldCheck,
  Siren,
  UserX,
  Wind,
  XCircle,
} from "lucide-react"

export const EMERGENCY_PHRASES: EmergencyPhrase[] = [
  // A. Critical Medical Emergencies
  {
    id: "med-1",
    category: "medical",
    icon: Ambulance,
    label: "Call Ambulance",
    text: "I need an ambulance immediately!",
  },
  {
    id: "med-2",
    category: "medical",
    icon: HeartPulse,
    label: "Severe Chest Pain",
    text: "I am experiencing severe chest pain.",
  },
  {
    id: "med-3",
    category: "medical",
    icon: Bandage,
    label: "Severe Bleeding / Injured",
    text: "I am bleeding severely / critically injured.",
  },
  {
    id: "med-4",
    category: "medical",
    icon: Wind,
    label: "Cannot Breathe",
    text: "I am having severe difficulty breathing.",
  },
  {
    id: "med-5",
    category: "medical",
    icon: UserX,
    label: "Dizzy / About to Faint",
    text: "I feel extremely dizzy / about to faint.",
  },

  // B. Safety, Police & Law Enforcement
  {
    id: "pol-1",
    category: "police",
    icon: Siren,
    label: "Call Police (911)",
    text: "Please call the Police (911) right now!",
  },
  {
    id: "pol-2",
    category: "police",
    icon: PenTool,
    label: "I am Deaf — Write Here",
    text: "I am Deaf / Hard of Hearing — Please write down what you say.",
  },
  {
    id: "pol-3",
    category: "police",
    icon: AlertTriangle,
    label: "In Danger / Followed",
    text: "I am in danger / I am being followed!",
  },
  {
    id: "pol-4",
    category: "police",
    icon: Languages,
    label: "Need Sign Interpreter",
    text: "I need an official ASL / Sign Language Interpreter!",
  },
  {
    id: "pol-5",
    category: "police",
    icon: MapPin,
    label: "Lost — Need Help",
    text: "I am lost — I need help finding safety.",
  },

  // C. Fire & Disaster Evacuation
  {
    id: "fire-1",
    category: "fire",
    icon: Flame,
    label: "FIRE! Evacuate Now",
    text: "There is a FIRE! We need to evacuate immediately!",
  },
  {
    id: "fire-2",
    category: "fire",
    icon: EarOff,
    label: "Cannot Hear Sirens/Alarms",
    text: "I cannot hear sirens or audio emergency alarms!",
  },
  {
    id: "fire-3",
    category: "fire",
    icon: DoorOpen,
    label: "Nearest Emergency Exit?",
    text: "Where is the nearest emergency exit / shelter?",
  },
  {
    id: "fire-4",
    category: "fire",
    icon: Biohazard,
    label: "Gas Leak / Hazard",
    text: "Is there a gas leak / chemical hazard?",
  },
  {
    id: "fire-5",
    category: "fire",
    icon: Accessibility,
    label: "Need Evacuation Help",
    text: "I need help evacuating — I have mobility limitations.",
  },

  // D. Immediate Assistance & Medical Devices
  {
    id: "asst-1",
    category: "assistance",
    icon: HeartHandshake,
    label: "Please Stay With Me",
    text: "Please do NOT leave me alone — Stay with me!",
  },
  {
    id: "asst-2",
    category: "assistance",
    icon: PhoneCall,
    label: "Call Emergency Contact",
    text: "Please contact my emergency contact immediately.",
  },
  {
    id: "asst-3",
    category: "assistance",
    icon: Hospital,
    label: "Nearest Hospital?",
    text: "Where is the nearest hospital or emergency room?",
  },
  {
    id: "asst-4",
    category: "assistance",
    icon: Pill,
    label: "Lost Medication / Device",
    text: "I lost my medication / essential medical device.",
  },
  {
    id: "asst-5",
    category: "assistance",
    icon: GlassWater,
    label: "Need Water / Insulin",
    text: "I need water / insulin / urgent sugar support.",
  },

  // E. Rapid Bystander Response Toggles
  {
    id: "tog-1",
    category: "toggles",
    icon: CheckCircle2,
    label: "YES",
    text: "YES.",
    xl: true,
    iconColor: "#16A34A",
  },
  {
    id: "tog-2",
    category: "toggles",
    icon: XCircle,
    label: "NO",
    text: "NO.",
    xl: true,
    iconColor: "#DC2626",
  },
  {
    id: "tog-3",
    category: "toggles",
    icon: Keyboard,
    label: "Help Me Type Response",
    text: "I need help typing my response.",
  },
  {
    id: "tog-4",
    category: "toggles",
    icon: Building2,
    label: "Point to Nearest Station",
    text: "Please point me toward the nearest police station or clinic.",
  },
  {
    id: "tog-5",
    category: "toggles",
    icon: ShieldCheck,
    label: "I Am Safe Now — Thanks",
    text: "I am safe now — Thank you for helping me.",
  },
]

export const EMERGENCY_FILTERS: { id: EmergencyFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "medical", label: "Medical" },
  { id: "police", label: "Police/Safety" },
  { id: "fire", label: "Fire" },
  { id: "assistance", label: "Assistance" },
  { id: "toggles", label: "Quick Toggles" },
]
