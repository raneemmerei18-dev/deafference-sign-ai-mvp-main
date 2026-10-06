export type CategoryId =
  | "Restaurant"
  | "Healthcare"
  | "Reception"
  | "Education"
  | "General"

export type Status =
  | "idle"
  | "listening"
  | "understanding"
  | "preparing"
  | "signing"
  | "complete"
  | "error"

export const PIPELINE_STEPS = [
  "Listening",
  "Understanding",
  "Preparing Sign",
  "Showing Animation",
  "Complete",
] as const

/** Human-friendly badge label for each status. */
export const STATUS_LABEL: Record<Status, string> = {
  idle: "Ready",
  listening: "Listening",
  understanding: "Understanding",
  preparing: "Preparing sign",
  signing: "Signing",
  complete: "Complete",
  error: "Needs attention",
}

/** Index into PIPELINE_STEPS for a given status (-1 when idle). */
export const STATUS_STEP: Record<Status, number> = {
  idle: -1,
  listening: 0,
  understanding: 1,
  preparing: 2,
  signing: 3,
  complete: 4,
  error: -1,
}

/**
 * Result of looking a phrase up in the demo sign library. There is no sign
 * translation engine yet: a result only exists when the phrase matches (or
 * closely matches) one of the library phrases below.
 */
export type TranslationResult = {
  original: string
  /** Canonical (English) library phrase — also the key into `studio.phrases`. */
  matchedSign: string
  category: CategoryId
  matchType: "exact" | "close"
  /** String similarity between the input and the library phrase, 0–100. */
  score: number
}

export type PhraseGroup = {
  id: CategoryId
  label: string
  phrases: string[]
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "Restaurant", label: "Restaurant" },
  { id: "Healthcare", label: "Healthcare" },
  { id: "Reception", label: "Reception" },
  { id: "Education", label: "Education" },
  { id: "General", label: "General" },
]

export const QUICK_PHRASES: PhraseGroup[] = [
  {
    id: "Restaurant",
    label: "Restaurant",
    phrases: [
      "Hello",
      "I need water",
      "I want to order",
      "Please repeat",
      "Thank you",
      "Yes",
      "No",
      "I need help",
      "Where is the bathroom?",
      "How much does this cost?",
      "I am allergic",
      "Please call someone",
    ],
  },
  {
    id: "Healthcare",
    label: "Healthcare",
    phrases: [
      "Hello",
      "I need a doctor",
      "I am in pain",
      "Please repeat",
      "I need help",
      "Yes",
      "No",
      "I feel dizzy",
      "Where is the restroom?",
      "I take medication",
      "I am allergic",
      "Please call my family",
    ],
  },
  {
    id: "Reception",
    label: "Reception",
    phrases: [
      "Hello",
      "I have an appointment",
      "I am here to check in",
      "Please repeat",
      "Thank you",
      "Yes",
      "No",
      "I need help",
      "Where do I wait?",
      "Can you write it down?",
      "I need a form",
      "Please call someone",
    ],
  },
  {
    id: "Education",
    label: "Education",
    phrases: [
      "Hello",
      "I have a question",
      "Please repeat",
      "I do not understand",
      "Thank you",
      "Yes",
      "No",
      "I need help",
      "Can you slow down?",
      "Where is my classroom?",
      "Please write it down",
      "May I leave?",
    ],
  },
  {
    id: "General",
    label: "General",
    phrases: [
      "Hello",
      "Thank you",
      "Please repeat",
      "Yes",
      "No",
      "I need help",
      "I do not understand",
      "Where is the bathroom?",
      "How much does this cost?",
      "Please wait",
      "Nice to meet you",
      "Goodbye",
    ],
  },
]

/** Preferred category for phrases that appear in several groups. */
const PHRASE_CATEGORY: Record<string, CategoryId> = {
  "I need water": "Restaurant",
  "I need a doctor": "Healthcare",
  "How much does this cost?": "Restaurant",
  "I am allergic": "Healthcare",
}

/** Every distinct phrase in the demo sign library. */
export const SIGN_LIBRARY: string[] = Array.from(new Set(QUICK_PHRASES.flatMap((group) => group.phrases)))

/** Lower-cases, strips punctuation/diacritics and unifies common Arabic letter variants. */
export function normalizePhrase(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[ً-ٰٟـ]/g, "") // Arabic tashkeel + tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = curr
  }
  return prev[b.length]
}

function similarity(input: string, phrase: string): number {
  const longest = Math.max(input.length, phrase.length)
  let score = longest === 0 ? 0 : 1 - levenshtein(input, phrase) / longest
  // "hi, i need water please" still contains the whole library phrase.
  const padded = ` ${input} `
  if (phrase.length >= 2 && padded.includes(` ${phrase} `)) {
    score = Math.max(score, Math.min(0.97, 0.8 + 0.2 * (phrase.length / input.length)))
  }
  return score
}

const CLOSE_MATCH_THRESHOLD = 0.75

/**
 * Looks a phrase up in the demo sign library (exact first, then a close
 * string match). `aliases` maps library phrases to translated display text
 * (e.g. Arabic) so input in the UI language can match too. Returns `null`
 * when nothing in the library is close enough — callers must say so rather
 * than invent a sign.
 */
export function matchSign(
  input: string,
  activeCategory: CategoryId,
  aliases: Record<string, string> = {},
): TranslationResult | null {
  const original = input.trim()
  const key = normalizePhrase(original)
  if (!key) return null

  let best: { phrase: string; score: number } | null = null
  for (const phrase of SIGN_LIBRARY) {
    const keys = [normalizePhrase(phrase)]
    if (aliases[phrase]) keys.push(normalizePhrase(aliases[phrase]))
    for (const candidate of keys) {
      const score = candidate === key ? 1 : similarity(key, candidate)
      if (!best || score > best.score) best = { phrase, score }
    }
    if (best?.score === 1) break
  }
  if (!best || best.score < CLOSE_MATCH_THRESHOLD) return null

  const phrase = best.phrase
  const inGroup = (id: CategoryId) => QUICK_PHRASES.find((group) => group.id === id)?.phrases.includes(phrase)
  const category: CategoryId = inGroup(activeCategory)
    ? activeCategory
    : PHRASE_CATEGORY[phrase] ??
      (inGroup("General") ? "General" : QUICK_PHRASES.find((group) => group.phrases.includes(phrase))?.id ?? "General")

  return {
    original,
    matchedSign: best.phrase,
    category,
    matchType: best.score === 1 ? "exact" : "close",
    score: Math.round(best.score * 100),
  }
}
