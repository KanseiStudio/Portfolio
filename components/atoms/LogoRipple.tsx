"use client"

import { useEffect, useState } from "react"

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
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/*
        viewBox 0 0 1440 800 proporzionato al desktop standard.
        cx=1080 = 75% di 1440 → centro ancorato sul fiore (colonna destra).
        cy=400 → centro verticale dell'hero.
        4 cerchi con delay fisso: animazione puramente CSS, nessuno stato
        React aggiornato a runtime → nessun flicker/lampeggio.
      */}
      <svg
        viewBox="0 0 1440 800"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {([0, 1.5, 3, 4.5] as const).map((delay, i) => (
          <circle
            key={i}
            cx="1080" cy="400" r="100"
            stroke="white" strokeOpacity="0.20" strokeWidth="1"
            opacity="0"
            style={{
              animation:      "logoRipple 6s ease-out infinite",
              animationDelay: `${delay}s`,
            }}
          />
        ))}

        {/* @keyframes definiti dentro l'SVG — scope locale, nessuna
            collisione con altri componenti. r senza unità = SVG user units */}
        <style>{`
          @keyframes logoRipple {
            0%   { r: 100;  opacity: 0;    }
            10%  {           opacity: 0.28; }
            100% { r: 1400;  opacity: 0;    }
          }
        `}</style>
      </svg>
    </div>
  )
}
