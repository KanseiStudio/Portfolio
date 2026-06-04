"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"

export function HomeFlowerOrbit() {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <div
      className="relative w-full aspect-square max-w-[600px] mx-auto select-none"
      aria-hidden="true"
    >
      {/* ── Static orbital rings ─────────────────────────────────── */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer solid ring */}
        <circle cx="250" cy="250" r="242" stroke="white" strokeOpacity="0.14" strokeWidth="1" />

        {/* Mid ring — dashed */}
        <circle cx="250" cy="250" r="200" stroke="white" strokeOpacity="0.06" strokeWidth="0.6" strokeDasharray="4 10" />

        {/* Inner ring — solid */}
        <circle cx="250" cy="250" r="155" stroke="white" strokeOpacity="0.07" strokeWidth="0.6" />

        {/* Innermost subtle ring */}
        <circle cx="250" cy="250" r="110" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" strokeDasharray="2 8" />

        {/* Crosshair — horizontal */}
        <line x1="4" y1="250" x2="496" y2="250" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" strokeDasharray="3 8" />
        {/* Crosshair — vertical */}
        <line x1="250" y1="4" x2="250" y2="496" stroke="white" strokeOpacity="0.04" strokeWidth="0.5" strokeDasharray="3 8" />

        {/* Cardinal tick marks */}
        <line x1="250" y1="4"   x2="250" y2="22"  stroke="white" strokeOpacity="0.22" strokeWidth="1" />
        <line x1="496" y1="250" x2="478" y2="250" stroke="white" strokeOpacity="0.22" strokeWidth="1" />
        <line x1="250" y1="496" x2="250" y2="478" stroke="white" strokeOpacity="0.22" strokeWidth="1" />
        <line x1="4"   y1="250" x2="22"  y2="250" stroke="white" strokeOpacity="0.22" strokeWidth="1" />

        {/* Cardinal dots */}
        <circle cx="250"  cy="7"   r="2"   fill="white" fillOpacity="0.28" />
        <circle cx="493"  cy="250" r="2"   fill="white" fillOpacity="0.28" />
        <circle cx="250"  cy="493" r="2"   fill="white" fillOpacity="0.28" />
        <circle cx="7"    cy="250" r="2"   fill="white" fillOpacity="0.28" />

        {/* 45° diagonal ticks */}
        <line x1="421" y1="79"  x2="409" y2="91"  stroke="white" strokeOpacity="0.10" strokeWidth="0.6" />
        <line x1="421" y1="421" x2="409" y2="409" stroke="white" strokeOpacity="0.10" strokeWidth="0.6" />
        <line x1="79"  y1="421" x2="91"  y2="409" stroke="white" strokeOpacity="0.10" strokeWidth="0.6" />
        <line x1="79"  y1="79"  x2="91"  y2="91"  stroke="white" strokeOpacity="0.10" strokeWidth="0.6" />

        {/* Scattered particle dots */}
        <circle cx="340" cy="125" r="1.5" fill="white" fillOpacity="0.32" />
        <circle cx="415" cy="195" r="1"   fill="white" fillOpacity="0.20" />
        <circle cx="390" cy="375" r="1.5" fill="white" fillOpacity="0.26" />
        <circle cx="155" cy="400" r="1"   fill="white" fillOpacity="0.20" />
        <circle cx="95"  cy="175" r="1.5" fill="white" fillOpacity="0.32" />
        <circle cx="165" cy="95"  r="1"   fill="white" fillOpacity="0.22" />
        <circle cx="440" cy="320" r="1"   fill="white" fillOpacity="0.18" />
        <circle cx="68"  cy="315" r="1.5" fill="white" fillOpacity="0.26" />
        <circle cx="300" cy="55"  r="1"   fill="white" fillOpacity="0.18" />
        <circle cx="460" cy="145" r="1"   fill="white" fillOpacity="0.14" />
        <circle cx="45"  cy="140" r="1"   fill="white" fillOpacity="0.14" />
        <circle cx="200" cy="462" r="1"   fill="white" fillOpacity="0.16" />
      </svg>

      {/* ── Rotating dashed outer ring ────────────────────────────── */}
      {mounted && (
        <motion.div
          className="absolute inset-0"
          animate={reducedMotion ? {} : { rotate: 360 }}
          transition={reducedMotion ? {} : { duration: 80, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
            <circle
              cx="250" cy="250" r="236"
              stroke="white" strokeOpacity="0.06"
              strokeWidth="1"
              strokeDasharray="8 20"
            />
          </svg>
        </motion.div>
      )}

      {/* ── Flower — breathing + gentle sway ─────────────────────── */}
      <motion.div
        className="absolute"
        style={{
          /* Crop to show flower only, hiding the "KANSEI Studio" text
             by displaying only the top 64 % of the square image       */
          top: "13%", left: "13%", right: "13%",
          height: "74%",               /* container is wider than tall  */
          overflow: "hidden",
        }}
        animate={reducedMotion || !mounted ? {} : {
          scale: [1, 1.022, 1, 1.018, 1],
          rotate: [0, 0.6, 0, -0.6, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        {/* Inner div is taller than the container → bottom clips away */}
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "156%",   /* renders at 1:1.56 → shows top 64 % of square */
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Logo_Kansei.png"
            alt=""
            loading="eager"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
