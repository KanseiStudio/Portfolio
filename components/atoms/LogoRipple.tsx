"use client"

/**
 * HomeRipple — "cerchi nell'acqua" expanding from the flower centre.
 *
 * Rules:
 * - Pure CSS animation: transform:scale, NO SVG r attribute animation.
 * - NO runtime React state updates (only reducedMotion, set once on mount).
 * - NO dynamic keys, NO Math.random(), NO useMemo dependent on mounted.
 * - 4 circles with fixed animation-delay → loop continuo senza flicker.
 * - pointer-events:none, absolute inset-0, z-index below content.
 */

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
        viewBox 0 0 1440 800 — proportioned to a standard desktop section.
        cx = 1024 ≈ 71 % of 1440 → visual centre of the right 7/12 column.
        cy = 400 → vertical centre of the 800-unit-tall section.
        r  = 80 SVG units = starting radius (tiny dot effect at scale 1).
        Each circle uses transform:scale via CSS @keyframes:
          scale(1) → invisible speck;  scale(17) → r≈1360, covers full viewport.
        transformBox:fill-box + transformOrigin:center → scales from each
        circle's own centre, not the SVG origin — correct ripple behaviour.
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
            cx="1024" cy="400" r="80"
            stroke="white" strokeOpacity="0.18" strokeWidth="1"
            opacity="0"
            style={{
              animation:       "homeRipple 6s ease-out infinite",
              animationDelay:  `${delay}s`,
              transformBox:    "fill-box",
              transformOrigin: "center",
            }}
          />
        ))}

        {/* Scoped keyframe — no global name collision */}
        <style>{`
          @keyframes homeRipple {
            0%   { transform: scale(1);  opacity: 0;    }
            8%   {                        opacity: 0.22; }
            100% { transform: scale(17); opacity: 0;    }
          }
        `}</style>
      </svg>
    </div>
  )
}
