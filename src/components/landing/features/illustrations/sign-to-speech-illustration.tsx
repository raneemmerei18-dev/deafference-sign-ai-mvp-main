"use client"

import { motion } from "framer-motion"
import { useI18n } from "@/i18n/use-i18n"

const WAVEFORM_HEIGHTS = [
  [20, 60, 90, 40, 95, 30, 75, 20],
  [70, 25, 45, 95, 35, 80, 40, 65],
  [30, 80, 35, 55, 90, 25, 85, 40],
  [90, 40, 95, 30, 65, 95, 35, 20],
  [20, 60, 90, 40, 95, 30, 75, 20],
]

const COLORS = ["#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#FF8A3D", "#2563EB", "#60A5FA", "#1D4ED8"]

export function SignToSpeechIllustration({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { t } = useI18n()
  const duration = 2.0

  return (
    <div className="pointer-events-none relative flex h-full w-full select-none items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card2-sign-to-speech-illustration.png"
        alt=""
        className="h-full max-h-[175px] w-full rounded-xl object-contain"
      />

      <div className="absolute inset-0 h-full w-full">
        {!reducedMotion && (
          <svg viewBox="0 0 236 167" className="absolute inset-0 h-full w-full">
            <motion.circle
              cx="95"
              cy="90"
              r="14"
              stroke="#FF8A3D"
              strokeWidth="2"
              fill="none"
              animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.2, 0.8, 0.2] }}
              transition={{ repeat: Infinity, duration }}
            />
            <motion.circle
              cx="135"
              cy="115"
              r="14"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.2, 0.8, 0.2] }}
              transition={{ repeat: Infinity, duration, delay: 0.4 }}
            />
          </svg>
        )}

        <motion.div
          className="absolute top-[8%] right-[8%] flex h-[48%] w-[42%] flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white p-2 shadow-lg"
          animate={reducedMotion ? {} : { scale: [0.97, 1.03, 0.97], y: [-2, 3, -2] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        >
          <div className="mb-1 flex items-center justify-between border-b border-slate-100 pb-1">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[9px] font-extrabold tracking-tight text-slate-600">{t.landing.features.illustration.audio}</span>
          </div>

          <div className="flex flex-1 items-end justify-between gap-0.5 px-1 pb-1">
            {COLORS.map((color, barIdx) => (
              <div key={barIdx} className="flex h-full flex-1 items-end justify-center">
                {!reducedMotion ? (
                  <motion.div
                    className="w-full rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ height: WAVEFORM_HEIGHTS.map((h) => `${h[barIdx]}%`) }}
                    transition={{ repeat: Infinity, duration, delay: barIdx * 0.1, ease: "easeInOut" }}
                  />
                ) : (
                  <div className="h-[50%] w-full rounded-full" style={{ backgroundColor: color }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
