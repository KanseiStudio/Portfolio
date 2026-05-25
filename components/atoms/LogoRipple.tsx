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
      className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 800"
        className="w-[180%] h-[180%] max-w-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[0, 1.5, 3, 4.5].map((delay, i) => (
          <circle
            key={i}
            cx="400"
            cy="400"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0"
            style={{
              animation: `logoRipple 6s ease-out infinite`,
              animationDelay: `${delay}s`,
              transformOrigin: "400px 400px",
            }}
          />
        ))}

        <style>{`
          @keyframes logoRipple {
            0% {
              r: 120px;
              opacity: 0;
              stroke-width: 1.5;
            }
            5% {
              opacity: 0.4;
            }
            100% {
              r: 600px;
              opacity: 0;
              stroke-width: 0.5;
            }
          }
        `}</style>
      </svg>
    </div>
  )
}
