export type SpeechQueueItem = { id: string; text: string }
export type SpeechState = { supported: boolean; voices: SpeechSynthesisVoice[]; voiceURI: string | null; speaking: boolean; current: SpeechQueueItem | null; queue: SpeechQueueItem[] }
export type SpeakResult = { ok: true } | { ok: false; reason: "unsupported" | "empty" }
const initialState: SpeechState = { supported: false, voices: [], voiceURI: null, speaking: false, current: null, queue: [] }
let state = initialState, initialized = false, idCounter = 0
const listeners = new Set<() => void>()
const isSupported = () => typeof window !== "undefined" && "speechSynthesis" in window
function setState(patch: Partial<SpeechState>) { state = { ...state, ...patch }; listeners.forEach((listener) => listener()) }
function refreshVoices() { const voices = window.speechSynthesis.getVoices(); setState({ voices, voiceURI: state.voiceURI && voices.some((voice) => voice.voiceURI === state.voiceURI) ? state.voiceURI : voices[0]?.voiceURI ?? null }) }
function ensureInitialized() { if (initialized || !isSupported()) return; initialized = true; setState({ supported: true }); refreshVoices(); window.speechSynthesis.addEventListener("voiceschanged", refreshVoices) }
function playNext() { if (!isSupported()) return; const [next, ...rest] = state.queue; if (!next) { setState({ current: null, speaking: false }); return }; setState({ queue: rest, current: next, speaking: true }); const utterance = new SpeechSynthesisUtterance(next.text); const voice = state.voices.find((item) => item.voiceURI === state.voiceURI); if (voice) utterance.voice = voice; utterance.onend = playNext; utterance.onerror = playNext; window.speechSynthesis.speak(utterance) }
export function speak(text: string): SpeakResult { ensureInitialized(); if (!isSupported()) return { ok: false, reason: "unsupported" }; const trimmed = text.trim(); if (!trimmed) return { ok: false, reason: "empty" }; setState({ queue: [...state.queue, { id: `speech-${++idCounter}`, text: trimmed }] }); if (!state.current) playNext(); return { ok: true } }
export function stop() { if (!isSupported()) return; setState({ queue: [], current: null, speaking: false }); window.speechSynthesis.cancel() }
export function setVoice(voiceURI: string | null) { setState({ voiceURI }) }
export function subscribe(onChange: () => void) { ensureInitialized(); listeners.add(onChange); return () => listeners.delete(onChange) }
export const getSnapshot = () => state
export const getServerSnapshot = () => initialState
