'use client'

import { useEffect, useState } from 'react'

interface WaveformAnimationProps {
  isActive: boolean
}

export default function WaveformAnimation({ isActive }: WaveformAnimationProps) {
  const [bars, setBars] = useState(Array(12).fill(20))

  useEffect(() => {
    if (!isActive) {
      setBars(Array(12).fill(20))
      return
    }

    const interval = setInterval(() => {
      setBars(Array(12).fill(0).map(() => Math.random() * 100))
    }, 100)

    return () => clearInterval(interval)
  }, [isActive])

  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {bars.map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full transition-all duration-100"
          style={{
            height: `${Math.max(height, 20)}%`,
            minHeight: '4px',
            opacity: isActive ? 0.8 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
