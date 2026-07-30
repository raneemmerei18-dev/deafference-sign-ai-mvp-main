"use client"

import { useEffect, useRef } from "react"
import "./mira-companion.css"

const MOODS = ["neutral", "happy", "sad", "think", "listen", "talk", "cheer"] as const
const ACTS = ["a-wave", "a-point", "a-cheer"] as const

// Mira, the landing page's walking companion. She tracks whichever
// [data-mira-zone] section is centered in view and reacts when the visitor
// hovers or clicks a [data-mira-say] element. Ported 1:1 from the standalone
// mockup (deafference-landing-live character.html) into a client component.
export function MiraCompanion() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dockEl = containerRef.current
    const mira = svgRef.current
    const bubble = bubbleRef.current
    if (!dockEl || !mira || !bubble) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let posX = 0
    let facing = 1
    let busy = false
    let current: Element | null = null
    let walkTimer: ReturnType<typeof setTimeout> | undefined
    let actTimer: ReturnType<typeof setTimeout> | undefined
    let sayTimer: ReturnType<typeof setTimeout> | undefined
    let hoverTimer: ReturnType<typeof setTimeout> | undefined

    function limit(x: number) {
      const w = dockEl!.offsetWidth || 130
      return Math.max(8, Math.min(window.innerWidth - w - 8, x))
    }
    function mood(name: string) {
      MOODS.forEach((m) => mira!.classList.remove(`mira-e-${m}`))
      mira!.classList.add(`mira-e-${name}`)
    }
    function act(name: string | null, ms?: number) {
      ACTS.forEach((a) => mira!.classList.remove(a))
      if (name) mira!.classList.add(`a-${name}`)
      clearTimeout(actTimer)
      if (name && ms) actTimer = setTimeout(() => mira!.classList.remove(`a-${name}`), ms)
    }
    function say(text: string | null, ms?: number) {
      if (!text) {
        bubble!.classList.remove("on")
        return
      }
      bubble!.textContent = text
      bubble!.classList.add("on")
      clearTimeout(sayTimer)
      sayTimer = setTimeout(() => bubble!.classList.remove("on"), ms || 2800)
    }
    function place(x: number) {
      posX = limit(x)
      dockEl!.style.transform = `translateX(${posX}px)`
    }
    function walkTo(x: number, done?: () => void) {
      x = limit(x)
      const dx = x - posX
      if (reduced || Math.abs(dx) < 14) {
        place(x)
        done?.()
        return
      }
      facing = dx > 0 ? 1 : -1
      const dur = Math.min(2400, Math.max(520, Math.abs(dx) * 3))
      act(null)
      mira!.classList.add("walking")
      dockEl!.style.transitionDuration = `${dur}ms`
      dockEl!.style.transform = `translateX(${x}px) scaleX(${facing})`
      posX = x
      clearTimeout(walkTimer)
      walkTimer = setTimeout(() => {
        mira!.classList.remove("walking")
        dockEl!.style.transitionDuration = "260ms"
        dockEl!.style.transform = `translateX(${posX}px) scaleX(1)`
        done?.()
      }, dur)
    }

    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-mira-zone]"))
    let io: IntersectionObserver | undefined
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting || en.intersectionRatio < 0.45) return
            const el = en.target
            if (el === current || busy) return
            current = el
            const frac = parseFloat(el.getAttribute("data-mira-zone") || "0.5")
            walkTo(window.innerWidth * frac - 66, () => {
              mood(el.getAttribute("data-mira-mood") || "neutral")
              say(el.getAttribute("data-mira-line"), 3200)
            })
          })
        },
        { threshold: [0.45, 0.7] },
      )
      zones.forEach((z) => io!.observe(z))
    }

    const buttons = Array.from(document.querySelectorAll<HTMLElement>("[data-mira-say]"))
    const buttonCleanups: Array<() => void> = []
    buttons.forEach((b) => {
      function onEnter() {
        clearTimeout(hoverTimer)
        hoverTimer = setTimeout(() => {
          if (busy) return
          const r = b.getBoundingClientRect()
          walkTo(r.left + r.width / 2 - 66, () => {
            mood("talk")
            act("point")
            say(b.getAttribute("data-mira-say") || "This one.", 2400)
          })
        }, 220)
      }
      function onLeave() {
        clearTimeout(hoverTimer)
        if (!busy)
          setTimeout(() => {
            if (!busy) {
              act(null)
              mood("neutral")
            }
          }, 500)
      }
      function onClick() {
        busy = true
        if (b.hasAttribute("data-mira-cheer")) {
          mood("cheer")
          act("cheer", 2600)
          say(b.getAttribute("data-mira-say"), 2600)
        } else if (b.hasAttribute("data-mira-sad")) {
          mood("sad")
          act(null)
          say(b.getAttribute("data-mira-say"), 3200)
        } else {
          mood("happy")
          act("wave", 1800)
          say(b.getAttribute("data-mira-say") || "On it.", 2200)
        }
        setTimeout(() => {
          busy = false
          mood("neutral")
          act(null)
        }, 3400)
      }
      b.addEventListener("mouseenter", onEnter)
      b.addEventListener("mouseleave", onLeave)
      b.addEventListener("click", onClick)
      buttonCleanups.push(() => {
        b.removeEventListener("mouseenter", onEnter)
        b.removeEventListener("mouseleave", onLeave)
        b.removeEventListener("click", onClick)
      })
    })

    const idleInterval = setInterval(() => {
      if (busy || mira!.classList.contains("walking")) return
      const r = Math.random()
      if (r < 0.3) {
        act("wave", 1600)
      } else if (r < 0.5) {
        mood("think")
        setTimeout(() => mood("neutral"), 2200)
      } else if (r < 0.62) {
        walkTo(posX + (Math.random() > 0.5 ? 70 : -70))
      }
    }, 9000)

    function handleResize() {
      place(posX)
    }
    window.addEventListener("resize", handleResize)

    place(-140)
    const enterTimer = setTimeout(() => {
      walkTo(window.innerWidth * 0.62 - 66, () => {
        mood("happy")
        act("wave", 2400)
        say("Hi — I'm Mira. Scroll, I'll follow.", 3600)
      })
    }, 400)

    return () => {
      io?.disconnect()
      buttonCleanups.forEach((fn) => fn())
      window.removeEventListener("resize", handleResize)
      clearTimeout(walkTimer)
      clearTimeout(actTimer)
      clearTimeout(sayTimer)
      clearTimeout(hoverTimer)
      clearTimeout(enterTimer)
      clearInterval(idleInterval)
    }
  }, [])

  return (
    <div id="mira-companion" ref={containerRef}>
      <div id="mira-bubble" ref={bubbleRef} aria-live="polite" />
      <svg
        id="mira-mascot"
        ref={svgRef}
        className="mira-e-neutral"
        viewBox="0 0 240 400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="120" cy="392" rx="62" ry="7" fill="#EAF3FF" />

        <g id="mira-legL">
          <path d="M104 244 L100 320 L98 366" stroke="#6B7280" strokeWidth="26" strokeLinecap="round" fill="none" />
          <rect x="76" y="358" width="46" height="22" rx="11" fill="#10264A" />
        </g>
        <g id="mira-legR">
          <path d="M136 244 L140 320 L142 366" stroke="#6B7280" strokeWidth="26" strokeLinecap="round" fill="none" />
          <rect x="118" y="358" width="46" height="22" rx="11" fill="#10264A" />
        </g>

        <rect x="108" y="96" width="24" height="34" rx="12" fill="#FCFBF9" stroke="#10264A" strokeWidth="3.4" />
        <path
          d="M120 118 q-36 0 -47 24 q-13 24 -15 58 l-4 46 q0 8 8 8 h116 q8 0 8 -8 l-4 -46 q-2 -34 -15 -58 q-11 -24 -47 -24 z"
          fill="#10264A"
        />
        <path d="M73 142 q-13 24 -15 58 l-3 40" fill="none" stroke="#7C6EE6" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M101 124 q19 19 38 0 q-19 13 -38 0 z" fill="#EAF3FF" />
        <rect x="146" y="162" width="9" height="28" rx="4.5" fill="#F47C20" />

        <g id="mira-armL">
          <path d="M84 150 L70 206" stroke="#10264A" strokeWidth="28" strokeLinecap="round" fill="none" />
          <path d="M69 210 L64 258" stroke="#10264A" strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M69 210 L64 258" stroke="#FCFBF9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path d="M56 208 L82 211" stroke="#F47C20" strokeWidth="8" strokeLinecap="round" fill="none" />
          <g transform="translate(64,258) scale(1.5,-1.5)">
            <path
              d="M-8 0 q-2 -12 0 -18 q8 -5 16 0 q2 6 0 18 q-8 5 -16 0 z"
              fill="#FCFBF9"
              stroke="#10264A"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <g stroke="#10264A" strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M-5 -16 L-7 -30" />
              <path d="M0 -18 L0 -33" />
              <path d="M5 -17 L7 -30" />
              <path d="M9 -14 L12 -25" />
              <path d="M-8 -7 L-16 -13" />
            </g>
            <g stroke="#FCFBF9" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M-5 -16 L-7 -30" />
              <path d="M0 -18 L0 -33" />
              <path d="M5 -17 L7 -30" />
              <path d="M9 -14 L12 -25" />
              <path d="M-8 -7 L-16 -13" />
            </g>
          </g>
        </g>

        <g id="mira-armR">
          <path d="M156 150 L170 206" stroke="#10264A" strokeWidth="28" strokeLinecap="round" fill="none" />
          <path d="M171 210 L176 258" stroke="#10264A" strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M171 210 L176 258" stroke="#FCFBF9" strokeWidth="20" strokeLinecap="round" fill="none" />
          <path d="M158 211 L184 208" stroke="#F47C20" strokeWidth="8" strokeLinecap="round" fill="none" />
          <g id="mira-handOpenR" transform="translate(176,258) scale(-1.5,-1.5)">
            <path
              d="M-8 0 q-2 -12 0 -18 q8 -5 16 0 q2 6 0 18 q-8 5 -16 0 z"
              fill="#FCFBF9"
              stroke="#10264A"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <g stroke="#10264A" strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M-5 -16 L-7 -30" />
              <path d="M0 -18 L0 -33" />
              <path d="M5 -17 L7 -30" />
              <path d="M9 -14 L12 -25" />
              <path d="M-8 -7 L-16 -13" />
            </g>
            <g stroke="#FCFBF9" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M-5 -16 L-7 -30" />
              <path d="M0 -18 L0 -33" />
              <path d="M5 -17 L7 -30" />
              <path d="M9 -14 L12 -25" />
              <path d="M-8 -7 L-16 -13" />
            </g>
          </g>
          <g id="mira-handPointR" transform="translate(176,258) scale(-1.5,-1.5)">
            <path
              d="M-8 0 q-2 -12 0 -18 q8 -5 16 0 q2 6 0 18 q-8 5 -16 0 z"
              fill="#FCFBF9"
              stroke="#10264A"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <g stroke="#10264A" strokeWidth="6" strokeLinecap="round" fill="none">
              <path d="M-4 -16 L-5 -36" />
              <path d="M1 -17 L4 -22" />
              <path d="M6 -16 L9 -20" />
              <path d="M9 -13 L12 -17" />
              <path d="M-8 -7 L-15 -11" />
            </g>
            <g stroke="#FCFBF9" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M-4 -16 L-5 -36" />
              <path d="M1 -17 L4 -22" />
              <path d="M6 -16 L9 -20" />
              <path d="M9 -13 L12 -17" />
              <path d="M-8 -7 L-15 -11" />
            </g>
          </g>
        </g>

        <g id="mira-head">
          <ellipse cx="120" cy="58" rx="47" ry="51" fill="#10264A" />
          <ellipse cx="120" cy="64" rx="40" ry="44" fill="#FCFBF9" stroke="#10264A" strokeWidth="3.4" />
          <path d="M148 36 q14 30 -2 56 q9 -30 -4 -50 z" fill="#EAF3FF" />
          <path d="M80 52 q10 -33 40 -33 q30 0 40 33 q-19 -16 -40 -16 q-21 0 -40 16 z" fill="#10264A" />

          <g data-mira-v="" id="mira-browsFlat">
            <path d="M96 57 q9 -6 17 0" stroke="#10264A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M127 57 q9 -6 17 0" stroke="#10264A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-browsSad">
            <path d="M96 52 q9 3 17 8" stroke="#10264A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M127 60 q9 -5 17 -8" stroke="#10264A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-browsThink">
            <path d="M96 60 q9 -4 17 -1" stroke="#10264A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M127 50 q9 -1 17 4" stroke="#10264A" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </g>

          <g data-mira-v="" id="mira-eyesOpen">
            <g id="mira-eyes">
              <ellipse cx="105" cy="72" rx="5.2" ry="6.8" fill="#10264A" />
              <ellipse cx="135" cy="72" rx="5.2" ry="6.8" fill="#10264A" />
            </g>
            <circle cx="107" cy="69" r="1.9" fill="#FCFBF9" />
            <circle cx="137" cy="69" r="1.9" fill="#FCFBF9" />
          </g>
          <g data-mira-v="" id="mira-eyesWide">
            <ellipse cx="105" cy="72" rx="6.4" ry="8.4" fill="#10264A" />
            <ellipse cx="135" cy="72" rx="6.4" ry="8.4" fill="#10264A" />
            <circle cx="107" cy="69" r="2.2" fill="#FCFBF9" />
            <circle cx="137" cy="69" r="2.2" fill="#FCFBF9" />
          </g>
          <g data-mira-v="" id="mira-eyesArc">
            <path d="M97 74 q8 -11 16 0" stroke="#10264A" strokeWidth="3.6" fill="none" strokeLinecap="round" />
            <path d="M127 74 q8 -11 16 0" stroke="#10264A" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-eyesSad">
            <path d="M97 72 q8 9 16 0" stroke="#10264A" strokeWidth="3.6" fill="none" strokeLinecap="round" />
            <path d="M127 72 q8 9 16 0" stroke="#10264A" strokeWidth="3.6" fill="none" strokeLinecap="round" />
          </g>

          <g data-mira-v="" id="mira-cheeks">
            <circle cx="88" cy="84" r="7" fill="#EAF3FF" />
            <circle cx="152" cy="84" r="7" fill="#EAF3FF" />
          </g>
          <g data-mira-v="" id="mira-tear">
            <path d="M141 82 q5 8 0 12 q-5 -4 0 -12 z" fill="#7C6EE6" />
          </g>

          <g data-mira-v="" id="mira-mouthSmile">
            <path d="M108 94 q12 11 24 0" stroke="#10264A" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-mouthBig">
            <path d="M104 90 q16 20 32 0 q-16 8 -32 0 z" fill="#10264A" />
          </g>
          <g data-mira-v="" id="mira-mouthFrown">
            <path d="M108 99 q12 -10 24 0" stroke="#10264A" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-mouthFlat">
            <path d="M110 96 h20" stroke="#10264A" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-mouthSmall">
            <path d="M112 95 q8 6 16 0" stroke="#10264A" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-mouthO">
            <ellipse cx="120" cy="96" rx="7" ry="8.5" fill="#10264A" />
          </g>

          <rect x="160" y="56" width="9" height="21" rx="4.5" fill="#10264A" />
          <circle id="mira-earLight" cx="164.5" cy="62" r="3.6" fill="#7C6EE6" />

          <g data-mira-v="" id="mira-dots">
            <circle cx="176" cy="24" r="3" fill="#7C6EE6" />
            <circle cx="188" cy="12" r="4.5" fill="#7C6EE6" />
            <circle cx="203" cy="0" r="6" fill="#7C6EE6" />
          </g>
          <g data-mira-v="" id="mira-waves">
            <path d="M66 56 q-10 18 0 34" stroke="#F47C20" strokeWidth="3.2" fill="none" strokeLinecap="round" />
            <path d="M54 46 q-15 28 0 54" stroke="#F47C20" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          </g>
          <g data-mira-v="" id="mira-sparks">
            <path d="M172 18 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 z" fill="#F47C20" />
            <path
              d="M62 26 l2.4 5.6 l5.6 2.4 l-5.6 2.4 l-2.4 5.6 l-2.4 -5.6 l-5.6 -2.4 l5.6 -2.4 z"
              fill="#F47C20"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
