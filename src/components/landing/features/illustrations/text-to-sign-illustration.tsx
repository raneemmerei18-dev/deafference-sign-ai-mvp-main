"use client"

import { motion } from "framer-motion"

const LINE_1_WIDTH = [0, 95, 95, 95, 0]
const LINE_2_WIDTH = [0, 0, 75, 75, 0]
const LINE_3_WIDTH = [0, 0, 0, 85, 0]

export function TextToSignIllustration({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const duration = 2.4

  return (
    <div className="pointer-events-none relative flex h-full w-full select-none items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card3-text-to-sign-illustration.png"
        alt="Text to Sign original illustration"
        className="h-full max-h-[175px] w-full rounded-xl object-contain"
      />

      <div className="absolute inset-0 h-full w-full">
        {!reducedMotion && (
          <motion.div
            className="absolute top-[68%] left-[45%] h-[15%] w-[25%] rounded-md bg-sky-300/30 blur-[2px]"
            animate={{ opacity: [0.2, 0.8, 0.3, 0.9, 0.2], scale: [0.95, 1.05, 0.98, 1.02, 0.95] }}
            transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
          />
        )}

        <div className="absolute top-[22%] right-[22%] flex h-[42%] w-[28%] flex-col justify-start space-y-1.5 rounded-md border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-[1px]">
          <div className="flex items-center space-x-1 border-b border-slate-200 pb-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="text-[8px] font-bold tracking-tighter text-slate-500 uppercase">Text Editor</span>
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-sky-500"
              animate={reducedMotion ? { width: "85%" } : { width: LINE_1_WIDTH.map((w) => `${w}%`) }}
              transition={{ repeat: Infinity, duration, ease: "easeOut" }}
            />
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-blue-400"
              animate={reducedMotion ? { width: "65%" } : { width: LINE_2_WIDTH.map((w) => `${w}%`) }}
              transition={{ repeat: Infinity, duration, ease: "easeOut" }}
            />
          </div>

          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-slate-700"
              animate={reducedMotion ? { width: "75%" } : { width: LINE_3_WIDTH.map((w) => `${w}%`) }}
              transition={{ repeat: Infinity, duration, ease: "easeOut" }}
            />
          </div>

          {!reducedMotion && (
            <motion.div
              className="h-2 w-1 rounded-sm bg-brand-orange"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
