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
        transform:scale approach — more reliable than animating SVG r.
        transform-box:fill-box + transform-origin:center → scales from
        each circle's own centre (cx=1080, cy=400).
        scale(1) = r×1 = 80 SVG units; scale(17) ≈ 1360 SVG units,
        enough to cover the full viewport from the right-column origin.
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
            cx="1080" cy="400" r="80"
            stroke="white" strokeOpacity="0.22" strokeWidth="1"
            opacity="0"
            style={{
              animation:      "logoRipple 6s ease-out infinite",
              animationDelay: `${delay}s`,
              transformBox:   "fill-box",
              transformOrigin: "center",
            }}
          />
        ))}

        <style>{`
          @keyframes logoRipple {
            0%   { transform: scale(1);  opacity: 0;    }
            8%   {                        opacity: 0.26; }
            100% { transform: scale(17); opacity: 0;    }
          }
        `}</style>
      </svg>
    </div>
  )
}
