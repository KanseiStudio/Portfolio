"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"

const WORDS = [
  "ANALYZING", "RENDERING", "PARSING", "STREAMING",
  "BUFFERING", "OPTIMIZING", "DECODING", "SYNCING",
  "THINKING", "LISTENING", "CREATING", "CRAFTING",
]
const GLITCH_CHARS = "█▓▒░01·-=+*<>{}[]"

export function HomeTelemetry() {
  const t = useTranslations("Home")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  // SEED — random ogni reload, formato K:0X[4 hex]
  const seed = useMemo(() => {
    if (typeof window === "undefined") return "K:0X0000"
    const hex = Math.floor(Math.random() * 65535)
      .toString(16).toUpperCase().padStart(4, "0")
    return `K:0X${hex}`
  }, [])

  const [cycles, setCycles] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [time, setTime] = useState("")
  const wordIndexRef = useRef(0)
  const [processDisplay, setProcessDisplay] = useState(WORDS[0])

  // Detect reduced motion + mark mounted
  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // CYCLES loop (incrementa ogni 30ms)
  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => {
      setCycles(prev => (prev + 1) % 100000)
    }, 30)
    return () => clearInterval(interval)
  }, [reducedMotion])

  // UPTIME counter (incrementa ogni secondo)
  useEffect(() => {
    if (reducedMotion) return
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [reducedMotion])

  // CLOCK live Roma (ogni secondo)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Rome",
    })
    const update = () => setTime(`[${fmt.format(new Date())} CET]`)
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  // PROCESS glitch cycle
  useEffect(() => {
    if (reducedMotion) return

    const cycleInterval = setInterval(() => {
      let glitchCount = 0
      const targetWord = WORDS[(wordIndexRef.current + 1) % WORDS.length]
      const targetLen = targetWord.length

      const glitchInterval = setInterval(() => {
        const randomStr = Array.from({ length: targetLen }, () =>
          GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        ).join("")
        setProcessDisplay(randomStr)
        glitchCount++

        if (glitchCount >= 12) {
          clearInterval(glitchInterval)
          wordIndexRef.current = (wordIndexRef.current + 1) % WORDS.length
          setProcessDisplay(targetWord)
        }
      }, 50)
    }, 6000)

    return () => clearInterval(cycleInterval)
  }, [reducedMotion])

  const cyclesDisplay = String(cycles).padStart(5, "0")
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0")
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  const uptimeDisplay = `${hh}:${mm}:${ss}`

  // Evita warning hydration — nessun output finché non è client-side
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30" aria-hidden="true">

      {/* SEED — top-left, sotto la TopNav */}
      <div className="absolute top-24 lg:top-28 left-4 sm:left-6 lg:left-8 xl:left-12 font-mono text-[10px] uppercase tracking-widest opacity-50">
        <div className="opacity-60">SEED</div>
        <div className="mt-1">{seed}</div>
      </div>

      {/* GPS — top-right, nascosto su mobile */}
      <div className="absolute top-24 lg:top-28 right-4 sm:right-6 lg:right-8 xl:right-12 font-mono text-[10px] uppercase tracking-widest opacity-50 text-right hidden md:block">
        <div>+ LAT&nbsp;&nbsp;41.0394°N</div>
        <div className="mt-1">+ LON&nbsp;&nbsp;16.8267°E</div>
        <div className="mt-1">+ UTC+1 ROMA</div>
      </div>

      {/* STATUS + PROCESS — bottom-left, sopra SCROLL TO EXPLORE */}
      <div className="absolute bottom-44 lg:bottom-48 left-4 sm:left-6 lg:left-8 xl:left-12 font-mono text-[10px] uppercase tracking-widest opacity-50 space-y-3 hidden lg:block">
        <div className="flex items-center gap-2">
          <motion.span
            className="block w-1 h-1 rounded-full bg-current"
            animate={reducedMotion ? {} : { opacity: [0.4, 1, 0.4] }}
            transition={reducedMotion ? {} : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <span>STATUS · ONLINE</span>
        </div>
        <div>PROCESS · {processDisplay}</div>
      </div>

      {/* CYCLES + UPTIME — bottom-right, nascosti su mobile */}
      <div className="absolute bottom-44 lg:bottom-48 right-4 sm:right-6 lg:right-8 xl:right-12 font-mono text-[10px] uppercase tracking-widest opacity-50 text-right space-y-3 hidden lg:block tabular-nums">
        <div>CYCLES {cyclesDisplay}/99999</div>
        <div>UPTIME {uptimeDisplay}</div>
      </div>

      {/* SCROLL TO EXPLORE — bottom-left verticale */}
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

      {/* CLOCK — bottom-center */}
      {time && (
        <div className="absolute bottom-12 lg:bottom-16 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest opacity-50 tabular-nums whitespace-nowrap">
          {time}
        </div>
      )}

    </div>
  )
}
