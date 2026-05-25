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

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        {[0, 1.5, 3, 4.5, 6, 7.5].map((delay, i) => (
          <circle
            key={i}
            cx="75"
            cy="50"
            r="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.1"
            opacity="0"
            style={{
              animation: `logoRipple 9s ease-out infinite`,
              animationDelay: `${delay}s`,
              vectorEffect: "non-scaling-stroke",
            }}
          />
        ))}

        <style>{`
          @keyframes logoRipple {
            0% {
              r: 5;
              opacity: 0;
              stroke-width: 0.15;
            }
            5% {
              opacity: 0.3;
            }
            100% {
              r: 80;
              opacity: 0;
              stroke-width: 0.05;
            }
          }
        `}</style>
      </svg>
    </div>
  )
}
