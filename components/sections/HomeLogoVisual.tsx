"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "motion/react"

interface Particle {
  id: number
  spawnX: number
  spawnY: number
  t: number
  digitalChar: string | null
  driftSeed: number
}

const SPAWN_POSITIONS = [
  { x: 28, y: 22 },
  { x: 38, y: 17 },
  { x: 48, y: 14 },
  { x: 58, y: 14 },
  { x: 68, y: 17 },
  { x: 72, y: 24 },
  { x: 32, y: 30 },
  { x: 70, y: 30 },
  { x: 22, y: 35 },
  { x: 78, y: 35 },
  { x: 42, y: 26 },
  { x: 58, y: 26 },
]

const DIGITAL_CHARS = ["0", "1", "▓", "░", "█", "·", "+"]

const PARTICLE_LIFESPAN = 5
const SPAWN_INTERVAL = 400
const MAX_PARTICLES = 18
const FALL_DISTANCE = 35
const DRIFT_AMPLITUDE = 4

export function HomeLogoVisual() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [reducedMotion, setReducedMotion] = useState(false)
  const idCounter = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    const interval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= MAX_PARTICLES) return prev

        const spawn = SPAWN_POSITIONS[
          Math.floor(Math.random() * SPAWN_POSITIONS.length)
        ]

        const newParticle: Particle = {
          id: idCounter.current++,
          spawnX: spawn.x + (Math.random() - 0.5) * 4,
          spawnY: spawn.y + (Math.random() - 0.5) * 3,
          t: 0,
          digitalChar: null,
          driftSeed: Math.random() * Math.PI * 2,
        }

        return [...prev, newParticle]
      })
    }, SPAWN_INTERVAL)

    return () => clearInterval(interval)
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion) return

    let rafId: number
    let lastTime = performance.now()

    const update = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      setParticles((prev) =>
        prev
          .map((p) => {
            const newT = p.t + dt / PARTICLE_LIFESPAN

            let digitalChar = p.digitalChar
            if (newT >= 0.4 && digitalChar === null) {
              digitalChar = DIGITAL_CHARS[
                Math.floor(Math.random() * DIGITAL_CHARS.length)
              ]
            }

            return { ...p, t: newT, digitalChar }
          })
          .filter((p) => p.t < 1)
      )

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [reducedMotion])

  return (
    <div className="relative w-full aspect-square" aria-hidden="true">
      {/* Layer 0: Logo PNG with breathing + sway */}
      <motion.div
        className="absolute inset-0"
        animate={reducedMotion ? {} : {
          scale: [1, 1.02, 1, 1.015, 1],
          rotate: [0, 0.8, 0, -0.8, 0],
        }}
        transition={reducedMotion ? {} : {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      >
        <Image
          src="/Logo_Kansei.png"
          alt="Kansei Studio"
          fill
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Layer 1: SVG particle overlay */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        {particles.map((p) => {
          const t = p.t

          const y = p.spawnY + FALL_DISTANCE * t * (1 + t * 0.3)
          const x = p.spawnX + Math.sin(t * Math.PI * 2 + p.driftSeed) * DRIFT_AMPLITUDE

          let opacity = 1
          if (t < 0.08) opacity = t / 0.08
          else if (t < 0.55) opacity = 1
          else opacity = Math.max(0, 1 - (t - 0.55) / 0.45)

          const isDigital = p.digitalChar !== null
          const size = isDigital ? 3.5 : 2.2
          const content = isDigital ? p.digitalChar : "●"

          return (
            <text
              key={p.id}
              x={x}
              y={y}
              fontSize={size}
              fill="currentColor"
              opacity={opacity}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={isDigital ? 700 : 400}
            >
              {content}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
