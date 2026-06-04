"use client"

import { useState, useEffect } from "react"
import { useReducedMotion } from "motion/react"

const RINGS   = 6
const DURATION = 5   // seconds per ring cycle
const DELAY_STEP = DURATION / RINGS  // 0.833s stagger

export function HomeFlowerOrbit() {
  const [mounted, setMounted]     = useState(false)
  const prefersReduced            = useReducedMotion()

  useEffect(() => { setMounted(true) }, [])

  return (
    <div
      className="relative w-full aspect-square"
      aria-hidden="true"
      style={{ isolation: "isolate" }}
    >
      {/* ── Static reference orbit lines ──────────────────────────── */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer solid ring */}
        <circle cx="250" cy="250" r="242" stroke="white" strokeOpacity="0.10" strokeWidth="0.8" />
        {/* Mid dashed ring */}
        <circle cx="250" cy="250" r="192" stroke="white" strokeOpacity="0.05" strokeWidth="0.6" strokeDasharray="4 12" />
        {/* Inner ring */}
        <circle cx="250" cy="250" r="140" stroke="white" strokeOpacity="0.06" strokeWidth="0.6" />
        {/* Innermost ring */}
        <circle cx="250" cy="250" r="88"  stroke="white" strokeOpacity="0.04" strokeWidth="0.5" strokeDasharray="2 8" />
        {/* Cardinal ticks */}
        <line x1="250" y1="4"   x2="250" y2="20"  stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        <line x1="496" y1="250" x2="480" y2="250" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        <line x1="250" y1="496" x2="250" y2="480" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        <line x1="4"   y1="250" x2="20"  y2="250" stroke="white" strokeOpacity="0.18" strokeWidth="0.8" />
        {/* Cardinal dots */}
        <circle cx="250" cy="6"   r="1.5" fill="white" fillOpacity="0.22" />
        <circle cx="494" cy="250" r="1.5" fill="white" fillOpacity="0.22" />
        <circle cx="250" cy="494" r="1.5" fill="white" fillOpacity="0.22" />
        <circle cx="6"   cy="250" r="1.5" fill="white" fillOpacity="0.22" />
        {/* Crosshair */}
        <line x1="8"   y1="250" x2="492" y2="250" stroke="white" strokeOpacity="0.03" strokeWidth="0.5" strokeDasharray="3 9" />
        <line x1="250" y1="8"   x2="250" y2="492" stroke="white" strokeOpacity="0.03" strokeWidth="0.5" strokeDasharray="3 9" />
        {/* Scattered particles */}
        <circle cx="340" cy="125" r="1.2" fill="white" fillOpacity="0.25" />
        <circle cx="415" cy="198" r="0.8" fill="white" fillOpacity="0.16" />
        <circle cx="388" cy="374" r="1.2" fill="white" fillOpacity="0.20" />
        <circle cx="155" cy="398" r="0.8" fill="white" fillOpacity="0.16" />
        <circle cx="96"  cy="175" r="1.2" fill="white" fillOpacity="0.25" />
        <circle cx="166" cy="97"  r="0.8" fill="white" fillOpacity="0.18" />
        <circle cx="440" cy="318" r="0.8" fill="white" fillOpacity="0.14" />
        <circle cx="68"  cy="316" r="1.2" fill="white" fillOpacity="0.20" />
      </svg>

      {/* ── Expanding ripple rings (CSS animation) ────────────────── */}
      {mounted && !prefersReduced && Array.from({ length: RINGS }, (_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border border-white/18"
          style={{
            animationName:           "ks-ripple",
            animationDuration:       `${DURATION}s`,
            animationDelay:          `${i * DELAY_STEP}s`,
            animationTimingFunction: "cubic-bezier(0.1, 0, 0.7, 1)",
            animationIterationCount: "infinite",
            animationFillMode:       "both",
            willChange:              "transform, opacity",
          }}
        />
      ))}

      {/* ── Centre flower image ────────────────────────────────────── */}
      {/* mix-blend-mode:screen: black pixels vanish, petals/glows remain.
          clip-path crops the bottom ~36% which contains the wordmark text
          in Logo_Kansei.png — no overflow-hidden / no black box.          */}
      <div
        className="absolute"
        style={{ inset: "10%" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Logo_Kansei.png"
          alt=""
          loading="eager"
          className="w-full h-auto block"
          style={{
            mixBlendMode:       "screen",
            /* Soft gradient mask: fade to transparent starting at ~58% so
               the "KANSEI Studio" wordmark at the bottom of the PNG is
               invisible without leaving a hard rectangular clip edge       */
            WebkitMaskImage:    "linear-gradient(to bottom, black 55%, transparent 72%)",
            maskImage:          "linear-gradient(to bottom, black 55%, transparent 72%)",
          }}
        />
      </div>
    </div>
  )
}
