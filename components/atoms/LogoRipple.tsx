"use client"

import { useState, useEffect } from "react"

export function LogoRipple() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  if (reducedMotion) return null

  const RIPPLES = Array.from({ length: 10 }, (_, i) => i * 1.5)

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
        {RIPPLES.map((delay, i) => (
          <circle
            key={i}
            cx="1440"
            cy="400"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0"
            style={{
              animation: `logoRipple 15s ease-out infinite`,
              animationDelay: `${delay}s`,
              vectorEffect: "non-scaling-stroke",
            }}
          />
        ))}

        <style>{`
          @keyframes logoRipple {
            0% {
              r: 100px;
              opacity: 0;
              stroke-width: 2;
            }
            10% {
              opacity: 0.5;
            }
            100% {
              r: 1400px;
              opacity: 0;
              stroke-width: 0.5;
            }
          }
        `}</style>
      </svg>
    </div>
  )
}
