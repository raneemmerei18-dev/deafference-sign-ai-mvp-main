// MOCK UI — no live inference
// Controlled phrase library for scripted demo states. No speech recognition,
// no ML, no network. Everything here is local mock data.

export type DemoState =
  | 'ready'
  | 'listening'
  | 'captioning'
  | 'matched'
  | 'signing'
  | 'unavailable'
  | 'complete'

export type Phrase = {
  id: string
  text: string
  environment: string
  supported: boolean
}

// A small, controlled phrase library. This is deliberately finite — the MVP
// matches supported spoken phrases, not unrestricted ASL translation.
export const PHRASE_LIBRARY: Phrase[] = [
  { id: 'good-morning', text: 'Good morning.', environment: 'General', supported: true },
  { id: 'confirm-name', text: 'Please confirm your name.', environment: 'Clinic', supported: true },
  { id: 'counter-three', text: 'Counter three is ready.', environment: 'Bank', supported: true },
  { id: 'gate-changed', text: 'Your gate has changed.', environment: 'Airport', supported: true },
  { id: 'take-a-seat', text: 'Please take a seat.', environment: 'General', supported: true },
  { id: 'card-or-cash', text: 'Card or cash?', environment: 'Retail', supported: true },
]

// A phrase intentionally outside the library, to demonstrate the honest
// "not available" state.
export const UNAVAILABLE_SAMPLE = 'Tell me about your weekend plans.'

export const STATE_LABEL: Record<DemoState, string> = {
  ready: 'Ready',
  listening: 'Listening',
  captioning: 'Captioning',
  matched: 'Supported phrase found',
  signing: 'Signing',
  unavailable: 'That phrase is not available yet.',
  complete: 'Complete',
}

// The scripted sequence a successful interaction moves through.
export const SUCCESS_SEQUENCE: DemoState[] = [
  'ready',
  'listening',
  'captioning',
  'matched',
  'signing',
  'complete',
]

// Timing (ms) for the scripted mock playback.
export const STEP_DURATION: Record<DemoState, number> = {
  ready: 600,
  listening: 1600,
  captioning: 1400,
  matched: 1100,
  signing: 3200,
  unavailable: 2200,
  complete: 1800,
}

export type EnvironmentPortal = {
  id: string
  name: string
  image: string
  caption: string
  moment: string
}

export const ENVIRONMENTS: EnvironmentPortal[] = [
  {
    id: 'clinic',
    name: 'Clinic',
    image: '/env-clinic.png',
    caption: 'Please confirm your name.',
    moment: 'Check-in',
  },
  {
    id: 'bank',
    name: 'Bank',
    image: '/env-bank.png',
    caption: 'Counter three is ready.',
    moment: 'Queue number',
  },
  {
    id: 'retail',
    name: 'Retail',
    image: '/env-retail.png',
    caption: 'Card or cash?',
    moment: 'Payment',
  },
  {
    id: 'school',
    name: 'School',
    image: '/env-school.png',
    caption: 'The office is upstairs.',
    moment: 'Direction',
  },
  {
    id: 'airport',
    name: 'Airport',
    image: '/env-airport.png',
    caption: 'Your gate has changed.',
    moment: 'Gate change',
  },
  {
    id: 'venue',
    name: 'Venue',
    image: '/env-venue.png',
    caption: 'Row F, on your left.',
    moment: 'Seat guidance',
  },
]
