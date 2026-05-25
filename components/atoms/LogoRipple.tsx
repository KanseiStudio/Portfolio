"use client"

import { useState, useEffect, useMemo } from "react"

interface Ripple {
  delay: number
  duration: number
}

export function LogoRipple() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const ripples = useMemo<Ripple[]>(() => {
    if (!mounted) return []
    return Array.from({ length: 12 }, () => ({
      delay: Math.random() * 16,
      duration: 14 + Math.random() * 4,
    }))
  }, [mounted])

  if (!mounted || reducedMotion) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {ripples.map((ripple, i) => (
          <circle
            key={i}
            cx="1440"
            cy="400"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0"
            style={{
              animation: `logoRipple ${ripple.duration}s ease-out infinite`,
              animationDelay: `${ripple.delay}s`,
              vectorEffect: "non-scaling-stroke",
            }}
          />
        ))}

        <style>{`
          @keyframes logoRipple {
            0% {
              r: 100px;
              opacity: 0;
              stroke-width: 1.2;
            }
            12% {
              opacity: 0.4;
            }
            100% {
              r: 1400px;
              opacity: 0;
              stroke-width: 0.4;
            }
          }
        `}</style>
      </svg>
    </div>
  )
}
