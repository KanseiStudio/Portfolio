"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"

const WORDS = [
  "ANALYZING", "RENDERING", "PARSING", "STREAMING",
  "BUFFERING", "OPTIMIZING", "DECODING", "SYNCING",
  "THINKING", "LISTENING", "CREATING", "CRAFTING",
]
const GLITCH_CHARS = "█▓▒░01·-=+*<>{}[]"

export function HomeTelemetry() {
  const [seed, setSeed] = useState("")
  const [cycles, setCycles] = useState(0)
  const [uptime, setUptime] = useState(0)
  const [clock, setClock] = useState("")
  const [processWord, setProcessWord] = useState(WORDS[0])
  const wordIndexRef = useRef(0)

  // Client-only: avoids SSR/client mismatch
  useEffect(() => {
    const hex = Math.floor(Math.random() * 65535)
      .toString(16).toUpperCase().padStart(4, "0")
    setSeed(`k:0x${hex}`)
  }, [])

  // CYCLES: 0–99999, resets, 30ms tick
  useEffect(() => {
    const id = setInterval(() => setCycles(p => (p + 1) % 100000), 30)
    return () => clearInterval(id)
  }, [])

  // UPTIME: seconds since mount
  useEffect(() => {
    const id = setInterval(() => setUptime(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // CLOCK: Europe/Rome timezone, 1s tick
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Rome",
    })
    const update = () => setClock(`${fmt.format(new Date())} CET`)
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // PROCESS: glitch transition between words every 6s
  useEffect(() => {
    let innerRef: ReturnType<typeof setInterval> | null = null

    const outer = setInterval(() => {
      let count = 0
      const nextIdx = (wordIndexRef.current + 1) % WORDS.length
      const len = WORDS[nextIdx].length

      innerRef = setInterval(() => {
        setProcessWord(
          Array.from({ length: len }, () =>
            GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          ).join("")
        )
        count++
        if (count >= 12) {
          if (innerRef) clearInterval(innerRef)
          innerRef = null
          wordIndexRef.current = nextIdx
          setProcessWord(WORDS[nextIdx])
        }
      }, 50)
    }, 6000)

    return () => {
      clearInterval(outer)
      if (innerRef) clearInterval(innerRef)
    }
  }, [])

  const cyclesDisplay = String(cycles).padStart(5, "0")
  const hh = String(Math.floor(uptime / 3600)).padStart(2, "0")
  const mm = String(Math.floor((uptime % 3600) / 60)).padStart(2, "0")
  const ss = String(uptime % 60).padStart(2, "0")
  const uptimeDisplay = `${hh}:${mm}:${ss}`

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

      {/* Top-left: SEED — always visible */}
      <div className="absolute top-12 left-6 sm:left-8 lg:left-12 xl:left-16 font-mono text-eyebrow uppercase opacity-50">
        <div className="opacity-60">SEED</div>
        {seed && <div className="mt-1">{seed}</div>}
      </div>

      {/* Top-right: GPS — hidden below md */}
      <div className="absolute top-12 right-6 sm:right-8 lg:right-12 xl:right-16 font-mono text-eyebrow uppercase opacity-50 text-right hidden md:block">
        <div className="whitespace-pre">{"+ LAT  41.0394°N"}</div>
        <div className="whitespace-pre mt-1">{"+ LON  16.8267°E"}</div>
        <div className="mt-1">+ UTC+1 ROMA</div>
      </div>

      {/* Mid-left: STATUS + PROCESS — hidden below lg */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-8 lg:left-12 xl:left-16 font-mono text-eyebrow uppercase opacity-50 space-y-3 hidden lg:block">
        <div className="flex items-center gap-2">
          <motion.span
            className="block w-1 h-1 rounded-full bg-current shrink-0"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>STATUS · ONLINE</span>
        </div>
        <div>PROCESS · {processWord}</div>
      </div>

      {/* Mid-right: CYCLES + UPTIME — hidden below lg */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 sm:right-8 lg:right-12 xl:right-16 font-mono text-eyebrow uppercase opacity-50 text-right tabular-nums space-y-3 hidden lg:block">
        <div>CYCLES {cyclesDisplay}/99999</div>
        <div>UPTIME {uptimeDisplay}</div>
      </div>

      {/* Bottom-center: CLOCK — always visible */}
      {clock && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-eyebrow uppercase opacity-50 tabular-nums whitespace-nowrap">
          [{clock}]
        </div>
      )}

    </div>
  )
}
