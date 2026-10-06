"use client"

import { motion } from "framer-motion"
import { useI18n } from "@/i18n/use-i18n"

export function SignToTextIllustration({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const { t } = useI18n()
  const labels = t.landing.features.illustration
  const duration = 2.4

  return (
    <div className="pointer-events-none relative flex h-full w-full select-none items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/card4-sign-to-text-illustration.png"
        alt=""
        className="h-full max-h-[175px] w-full rounded-xl object-contain"
      />

      <div className="absolute inset-0 h-full w-full">
        <div className="absolute top-[22%] left-[46%] flex flex-col gap-1">
          <motion.div
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-black tracking-wider text-slate-900 uppercase shadow-md"
            animate={
              reducedMotion
                ? {}
                : {
                    y: [0, -4, 0],
                    scale: [0.95, 1.05, 0.95],
                    boxShadow: [
                      "0 2px 6px rgba(0,0,0,0.1)",
                      "0 4px 12px rgba(255,138,61,0.3)",
                      "0 2px 6px rgba(0,0,0,0.1)",
                    ],
                  }
            }
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-brand-orange" />
            <span>{labels.signIn}</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-black tracking-wider text-slate-900 uppercase shadow-md"
            animate={
              reducedMotion
                ? {}
                : {
                    y: [0, -5, 0],
                    scale: [0.9, 1.04, 0.9],
                    boxShadow: [
                      "0 2px 6px rgba(0,0,0,0.1)",
                      "0 4px 12px rgba(59,130,246,0.35)",
                      "0 2px 6px rgba(0,0,0,0.1)",
                    ],
                  }
            }
            transition={{ repeat: Infinity, duration: 2.4, delay: 0.5, ease: "easeInOut" }}
          >
            <span>{labels.signIn}</span>
          </motion.div>
        </div>

        <div className="absolute top-[18%] right-[10%] flex h-[48%] w-[32%] flex-col justify-start gap-1.5 rounded-md border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-[1px]">
          <div className="flex items-center justify-between border-b border-slate-200 pb-0.5">
            <span className="text-[8px] font-black tracking-tighter text-[#0369A1]">{labels.captions}</span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-[#0EA5E9]"
              animate={
                reducedMotion
                  ? { width: "90%" }
                  : { width: ["0%", "90%", "90%", "0%"], opacity: [0, 1, 1, 0] }
              }
              transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
            />
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-sky-400"
              animate={
                reducedMotion
                  ? { width: "80%" }
                  : { width: ["0%", "0%", "80%", "0%"], opacity: [0, 0, 1, 0] }
              }
              transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
            />
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              animate={
                reducedMotion
                  ? { width: "85%" }
                  : { width: ["0%", "0%", "85%", "0%"], opacity: [0, 0, 1, 0] }
              }
              transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
            />
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-blue-300"
              animate={
                reducedMotion
                  ? { width: "65%" }
                  : { width: ["0%", "0%", "65%", "0%"], opacity: [0, 0, 1, 0] }
              }
              transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
