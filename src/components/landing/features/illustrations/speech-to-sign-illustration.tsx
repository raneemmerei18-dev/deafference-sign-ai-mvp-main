"use client"

import { motion } from "framer-motion"

const BARS = [
  { height: [15, 80, 30, 95, 40, 15], color: "#60A5FA", delay: 0 },
  { height: [60, 20, 90, 35, 80, 60], color: "#3B82F6", delay: 0.1 },
  { height: [30, 95, 25, 75, 30, 30], color: "#93C5FD", delay: 0.2 },
  { height: [85, 30, 95, 20, 70, 85], color: "#2563EB", delay: 0.3 },
  { height: [40, 75, 20, 85, 45, 40], color: "#FF8A3D", delay: 0.4 },
  { height: [90, 30, 70, 35, 90, 90], color: "#3B82F6", delay: 0.5 },
]

export function SpeechToSignIllustration({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const duration = 1.6

  return (
    <div className="pointer-events-none relative flex h-full w-full select-none items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card1-speech-to-sign-illustration.png"
        alt="Speech to Sign original illustration"
        className="h-full max-h-[175px] w-full rounded-xl object-contain"
      />

      <div className="absolute inset-0 h-full w-full">
        <svg viewBox="0 0 236 167" className="absolute inset-0 h-full w-full overflow-visible">
          {!reducedMotion ? (
            <g>
              <motion.path
                d="M 112 80 A 18 18 0 0 1 112 110"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0, scale: 0.8, x: 0 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.25, 1.5], x: [0, 10, 22] }}
                transition={{ repeat: Infinity, duration, ease: "easeOut" }}
              />
              <motion.path
                d="M 118 75 A 25 25 0 0 1 118 115"
                stroke="#FF8A3D"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0, scale: 0.8, x: 0 }}
                animate={{ opacity: [0, 0.95, 0], scale: [0.8, 1.25, 1.5], x: [0, 10, 22] }}
                transition={{ repeat: Infinity, duration, delay: 0.4, ease: "easeOut" }}
              />
              <motion.path
                d="M 124 70 A 32 32 0 0 1 124 120"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0, scale: 0.8, x: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.25, 1.5], x: [0, 10, 22] }}
                transition={{ repeat: Infinity, duration, delay: 0.8, ease: "easeOut" }}
              />
            </g>
          ) : (
            <g opacity={0.8}>
              <path d="M 115 80 A 18 18 0 0 1 115 110" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 122 75 A 25 25 0 0 1 122 115" stroke="#FF8A3D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          )}
        </svg>

        <div className="absolute top-[35%] right-[12%] flex h-[38%] w-[28%] items-end justify-center gap-1 rounded-md bg-white/20 px-1 backdrop-blur-[1px]">
          {BARS.map((bar, idx) => (
            <div key={idx} className="flex h-full flex-1 items-end justify-center">
              {!reducedMotion ? (
                <motion.div
                  className="w-full rounded-full shadow-sm"
                  style={{ backgroundColor: bar.color }}
                  animate={{ height: bar.height.map((h) => `${h}%`) }}
                  transition={{ repeat: Infinity, duration, delay: bar.delay, ease: "easeInOut" }}
                />
              ) : (
                <div className="h-[60%] w-full rounded-full" style={{ backgroundColor: bar.color }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
