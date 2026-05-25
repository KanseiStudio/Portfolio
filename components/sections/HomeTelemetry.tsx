"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"

export function HomeTelemetry() {
  const t = useTranslations("Home")
  const [seed, setSeed] = useState("")
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const hex = Math.floor(Math.random() * 65535)
      .toString(16).toUpperCase().padStart(4, "0")
    setSeed(`K:0X${hex}`)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

      {/* SEED — top-left */}
      <div className="absolute top-8 lg:top-12 left-4 sm:left-6 lg:left-8 xl:left-12 font-mono text-[10px] uppercase tracking-widest opacity-50">
        <div className="opacity-60">SEED</div>
        {seed && <div className="mt-1">{seed}</div>}
      </div>

      {/* GPS — top-right, hidden su mobile */}
      <div className="absolute top-8 lg:top-12 right-4 sm:right-6 lg:right-8 xl:right-12 font-mono text-[10px] uppercase tracking-widest opacity-50 text-right hidden md:block">
        <div>+ LAT&nbsp;&nbsp;41.0394°N</div>
        <div className="mt-1">+ LON&nbsp;&nbsp;16.8267°E</div>
        <div className="mt-1">+ UTC+1 ROMA</div>
      </div>

      {/* SCROLL TO EXPLORE — verticale, bottom-left, solo desktop */}
      <div className="absolute bottom-12 lg:bottom-16 left-4 sm:left-6 lg:left-8 xl:left-12 flex-col items-center gap-4 hidden lg:flex">
        <div
          className="font-mono text-[10px] uppercase tracking-widest opacity-60"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {t("scrollHint")}
        </div>
        <motion.span
          className="block w-1 h-1 rounded-full bg-current opacity-40"
          animate={reducedMotion ? {} : {
            y: [0, 8, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={reducedMotion ? {} : {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

    </div>
  )
}
