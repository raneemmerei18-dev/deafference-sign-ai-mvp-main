"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

// Lattice of "lines of longitude/latitude" ellipses plus a scatter of node
// points -- reads as a glowing, translucent sphere rather than a literal
// wireframe globe.
const SPHERE_NODES = [
  { cx: 58, cy: 46, r: 3.2, delay: 0 },
  { cx: 168, cy: 34, r: 2.4, delay: 0.4 },
  { cx: 198, cy: 108, r: 2.8, delay: 0.9 },
  { cx: 158, cy: 190, r: 2.4, delay: 1.4 },
  { cx: 64, cy: 182, r: 3.2, delay: 0.7 },
  { cx: 24, cy: 100, r: 2.4, delay: 1.8 },
  { cx: 110, cy: 20, r: 2, delay: 1.1 },
  { cx: 205, cy: 150, r: 2, delay: 0.2 },
  { cx: 30, cy: 150, r: 2, delay: 1.6 },
  { cx: 120, cy: 205, r: 2, delay: 0.5 },
] as const

// Angles the orange "communication energy" travels outward along, from the
// logo at the sphere's heart toward its surface.
const ENERGY_ANGLES = [15, 60, 105, 160, 205, 250, 295, 335] as const

const FLOATING_CARDS = [
  { id: "sign", title: "You sign", className: "-left-4 top-2 sm:-left-10 sm:top-4", delay: 0 },
  { id: "ai", title: "AI understands", className: "-right-4 top-16 sm:-right-12 sm:top-20", delay: 0.6 },
  { id: "hear", title: "They hear you", className: "-left-6 bottom-20 sm:-left-14 sm:bottom-24", delay: 1.2 },
  { id: "connect", title: "Everyone connects", className: "-right-6 bottom-0 sm:-right-10 sm:bottom-2", delay: 1.8 },
] as const

function HandLandmarkArt() {
  // MediaPipe-style hand skeleton: blue joints, orange bone connections.
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-9" aria-hidden="true">
      <g stroke="var(--blue-accent)" strokeWidth="1.6" strokeLinecap="round">
        <path d="M14 34c-4-2-6-6-6-11v-5" />
        <path d="M14 18V7a2 2 0 0 1 4 0v10" />
        <path d="M18 18V5a2 2 0 0 1 4 0v13" />
        <path d="M22 18.4V8a2 2 0 0 1 4 0v13" />
        <path d="M26 19.5V12a2 2 0 0 1 4 0v9c0 6-3 11-7 11" />
      </g>
      <g stroke="var(--brand-orange)" strokeWidth="1.1" strokeLinecap="round" opacity="0.85">
        <path d="M14 18 18 18 22 18.4 26 19.5" />
      </g>
      <g fill="var(--blue-accent)">
        <circle cx="14" cy="18" r="1.6" />
        <circle cx="18" cy="18" r="1.6" />
        <circle cx="22" cy="18.4" r="1.6" />
        <circle cx="26" cy="19.5" r="1.6" />
        <circle cx="14" cy="34" r="1.4" />
      </g>
    </svg>
  )
}

function BrainLineArt() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="size-9" aria-hidden="true">
      <path
        d="M15 8c-4 0-7 3-7 6-2 1-3 3-3 5s1 4 3 5c0 4 3 7 7 7 2 0 3-1 4-2 1 1 2 2 4 2 4 0 7-3 7-7 2-1 3-3 3-5s-1-4-3-5c0-3-3-6-7-6-2 0-3 1-4 2-1-1-2-2-4-2Z"
        stroke="var(--blue-accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M19 10v20M13 14c2 1 3 3 3 5s-1 4-3 5M27 14c-2 1-3 3-3 5s1 4 3 5" stroke="var(--blue-accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
    </svg>
  )
}

function WaveformArt() {
  const bars = [7, 14, 9, 18, 11, 16, 8]
  return (
    <div className="flex h-9 items-center gap-[3px]" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-brand-orange"
          style={{ height: h }}
          animate={{ scaleY: [1, 1.7, 0.6, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

function ConnectionArt() {
  // Two friendly figures mid-conversation: one signing, one speaking --
  // stands in for the "bright office, natural smiles" photography the brief
  // describes, rendered as a soft line illustration instead of a fabricated photo.
  return (
    <svg viewBox="0 0 44 32" fill="none" className="h-8 w-11" aria-hidden="true">
      <circle cx="12" cy="9" r="5" fill="var(--brand-navy)" />
      <path d="M4 30c0-6 4-10 8-10s8 4 8 10" fill="var(--brand-navy)" />
      <path d="M6 20 2 15M6 20l-2 6" stroke="var(--brand-orange)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="32" cy="9" r="5" fill="var(--blue-accent)" />
      <path d="M24 30c0-6 4-10 8-10s8 4 8 10" fill="var(--blue-accent)" />
      <path d="M22 14c-2 1-2 4 0 5" stroke="var(--brand-orange)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

function FloatingCard({
  id,
  title,
  className,
  delay,
}: {
  id: (typeof FLOATING_CARDS)[number]["id"]
  title: string
  className: string
  delay: number
}) {
  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/75 px-3.5 py-3 shadow-[0_18px_40px_-20px_rgba(14,35,68,0.35)] backdrop-blur-xl ${className}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: [0, -7, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.4 + delay * 0.15 },
        y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
      whileHover={{ y: -10, scale: 1.03, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF8F4]">
        {id === "sign" && <HandLandmarkArt />}
        {id === "ai" && <BrainLineArt />}
        {id === "hear" && <WaveformArt />}
        {id === "connect" && <ConnectionArt />}
      </span>
      <span className="text-xs font-semibold whitespace-nowrap text-brand-navy">{title}</span>
    </motion.div>
  )
}

export function HeroIllustration() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 80, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 80, damping: 20 })
  const wrapRef = useRef<HTMLDivElement>(null)

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = wrapRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function handlePointerLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto flex aspect-square max-w-[420px] items-center justify-center sm:max-w-[480px]"
      style={{ perspective: 1000 }}
    >
      {/* Soft natural glow behind the sphere -- no hard gradients */}
      <div className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle,_rgba(255,210,166,0.55),_transparent_65%)] blur-2xl" />

      <motion.div className="relative flex size-[280px] items-center justify-center sm:size-[320px]" style={{ rotateX, rotateY }}>
        {/* Slow floating drift for the whole sphere group */}
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Slow rotation of the lattice + nodes */}
          <motion.svg
            className="absolute inset-0 size-full"
            viewBox="0 0 230 230"
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            <circle cx="115" cy="115" r="105" fill="white" fillOpacity="0.5" stroke="var(--blue-accent)" strokeOpacity="0.3" />
            <ellipse cx="115" cy="115" rx="105" ry="38" fill="none" stroke="var(--blue-accent)" strokeOpacity="0.28" />
            <ellipse cx="115" cy="115" rx="105" ry="68" fill="none" stroke="var(--blue-accent)" strokeOpacity="0.2" />
            <ellipse cx="115" cy="115" rx="38" ry="105" fill="none" stroke="var(--blue-accent)" strokeOpacity="0.2" />
            <line x1="10" y1="115" x2="220" y2="115" stroke="var(--blue-accent)" strokeOpacity="0.2" />
            {SPHERE_NODES.map((node, i) => (
              <motion.circle
                key={i}
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="var(--blue-accent)"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: node.delay }}
              />
            ))}
          </motion.svg>

          {/* Orange communication energy, pulsing outward from the logo */}
          <svg className="absolute inset-0 size-full" viewBox="-115 -115 230 230" aria-hidden="true">
            {ENERGY_ANGLES.map((deg, i) => {
              const rad = (deg * Math.PI) / 180
              const x2 = Math.cos(rad) * 100
              const y2 = Math.sin(rad) * 100
              return (
                <motion.circle
                  key={deg}
                  r="2.6"
                  fill="var(--brand-orange)"
                  initial={{ cx: 0, cy: 0, opacity: 0 }}
                  animate={{ cx: [0, x2], cy: [0, y2], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.3 }}
                />
              )
            })}
          </svg>

          {/* Deafference logo at the heart of the system, warm orange glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-[0_0_0_5px_rgba(255,122,26,0.16),0_20px_45px_-14px_rgba(255,122,26,0.6)] sm:size-24">
              <div className="relative size-20 overflow-hidden rounded-full sm:size-24">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/deafference-logo.png"
                  alt="Deafference"
                  className="absolute top-1/2 left-0 h-11 w-auto max-w-none -translate-y-1/2 sm:h-[52px]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {FLOATING_CARDS.map((card) => (
        <FloatingCard key={card.id} {...card} />
      ))}
    </div>
  )
}
