'use client'

import { motion } from 'framer-motion'

// Teal motion trails — represent voice having become visible sign around
// the signer's hands. Purely decorative reinforcement of the sign moment.
export function SignalTrails({
  active,
  className = '',
}: {
  active: boolean
  className?: string
}) {
  const paths = [
    'M20 70 C 35 40, 55 45, 62 28',
    'M78 72 C 66 46, 50 50, 44 30',
    'M30 60 C 44 48, 54 52, 58 40',
  ]
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="var(--signal)"
          strokeWidth={0.8}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            active
              ? { pathLength: [0, 1, 1], opacity: [0, 0.9, 0.35] }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: 2.2,
            repeat: active ? Infinity : 0,
            repeatDelay: 0.6,
            ease: [0.16, 1, 0.3, 1],
            delay: i * 0.35,
          }}
          style={{ filter: 'drop-shadow(0 0 6px var(--signal))' }}
        />
      ))}
    </svg>
  )
}
