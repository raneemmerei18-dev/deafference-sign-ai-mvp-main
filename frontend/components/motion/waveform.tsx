'use client'

import { motion } from 'framer-motion'

// A coral audio waveform — used to represent spoken voice entering a scene.
export function Waveform({
  active = true,
  bars = 28,
  className = '',
  color = 'var(--voice)',
}: {
  active?: boolean
  bars?: number
  className?: string
  color?: string
}) {
  return (
    <div
      className={`flex items-center gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
          initial={{ height: 4, opacity: 0.4 }}
          animate={
            active
              ? {
                  height: [4, 6 + ((i * 7) % 26), 4],
                  opacity: [0.4, 1, 0.4],
                }
              : { height: 4, opacity: 0.3 }
          }
          transition={{
            duration: 0.9 + (i % 5) * 0.12,
            repeat: active ? Infinity : 0,
            ease: 'easeInOut',
            delay: (i % 7) * 0.05,
          }}
        />
      ))}
    </div>
  )
}
