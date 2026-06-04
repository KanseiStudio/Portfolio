"use client"

import { useReducedMotion } from "motion/react"

/* ─── Config ──────────────────────────────────────────────────────────────
   Rings originate from the approximate visual centre of the flower on
   desktop. The value is in viewport-% (left/top). Adjust if the flower
   column changes.
   ──────────────────────────────────────────────────────────────────────── */
const RINGS    = 7
const DURATION = 8      // seconds for one ring to expand full-page
const ORIGIN_X = "72%"  // flower approx. left position in viewport
const ORIGIN_Y = "48%"  // flower approx. top  position in viewport

export function HomeRippleOverlay() {
  const prefersReduced = useReducedMotion()

  /* Hidden on mobile + when user prefers reduced motion */
  if (prefersReduced) return null

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {/* Origin point — all rings expand from here */}
      <div
        style={{
          position: "absolute",
          left: ORIGIN_X,
          top:  ORIGIN_Y,
          transform: "translate(-50%, -50%)",
        }}
      >
        {Array.from({ length: RINGS }, (_, i) => (
          <div
            key={i}
            style={{
              position:     "absolute",
              /* 200vmax guarantees the ring covers the viewport at scale=1
                 regardless of orientation or aspect ratio               */
              width:        "200vmax",
              height:       "200vmax",
              top:          "-100vmax",
              left:         "-100vmax",
              borderRadius: "50%",
              border:       "1px solid rgba(255,255,255,0.08)",

              animationName:           "ks-ripple-full",
              animationDuration:       `${DURATION}s`,
              animationDelay:          `${i * (DURATION / RINGS)}s`,
              animationTimingFunction: "cubic-bezier(0.18, 0, 0.65, 1)",
              animationIterationCount: "infinite",
              animationFillMode:       "both",
              willChange:              "transform, opacity",
            }}
          />
        ))}
      </div>
    </div>
  )
}
