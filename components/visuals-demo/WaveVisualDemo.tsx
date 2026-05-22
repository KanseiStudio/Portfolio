"use client"

import { useRef, useMemo, useEffect } from "react"
import { motion, useReducedMotion, useAnimationFrame } from "motion/react"

function mulberry32(seed: number): () => number {
  let s = seed
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface WaveParam {
  amplitude: number
  frequency: number
  phase: number
  yOffset: number
  opacity: number
}

const WAVE_PARAMS: WaveParam[] = [
  { amplitude: 60, frequency: 2, phase: 0, yOffset: 200, opacity: 0.5 },
  { amplitude: 40, frequency: 3, phase: 1, yOffset: 300, opacity: 0.35 },
  { amplitude: 70, frequency: 1.5, phase: 2, yOffset: 350, opacity: 0.6 },
  { amplitude: 50, frequency: 2.5, phase: 0.5, yOffset: 400, opacity: 0.45 },
  { amplitude: 30, frequency: 4, phase: 3, yOffset: 280, opacity: 0.3 },
]

const CYCLE_S = 20

function buildWavePath(
  amplitude: number,
  frequency: number,
  phase: number,
  yOffset: number
): string {
  const steps = 120
  const width = 600
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width
    const y =
      yOffset + amplitude * Math.sin(((frequency * x) / width) * 2 * Math.PI + phase)
    d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

interface Particle {
  cx: number
  cy: number
  r: number
  pulseDuration: number
  pulseDelay: number
}

export function WaveVisualDemo() {
  const shouldReduceMotion = useReducedMotion()
  const pathRefs = useRef<(SVGPathElement | null)[]>([])

  const particles = useMemo<Particle[]>(() => {
    const rand = mulberry32(777)
    return Array.from({ length: 80 }, () => ({
      cx: rand() * 600,
      cy: rand() * 600,
      r: 1 + rand(),
      pulseDuration: 2 + rand() * 3,
      pulseDelay: rand() * 4,
    }))
  }, [])

  // Initialize path elements with static paths (no animation mode)
  useEffect(() => {
    if (shouldReduceMotion) {
      WAVE_PARAMS.forEach((w, i) => {
        const el = pathRefs.current[i]
        if (el) el.setAttribute("d", buildWavePath(w.amplitude, w.frequency, w.phase, w.yOffset))
      })
    }
  }, [shouldReduceMotion])

  // Animate wave phase via direct DOM mutation — zero React re-renders
  useAnimationFrame((t) => {
    if (shouldReduceMotion) return
    const elapsed = t / 1000
    const phaseShift = (elapsed / CYCLE_S) * 2 * Math.PI

    WAVE_PARAMS.forEach((w, i) => {
      const el = pathRefs.current[i]
      if (el) {
        el.setAttribute(
          "d",
          buildWavePath(w.amplitude, w.frequency, w.phase + phaseShift, w.yOffset)
        )
      }
    })
  })

  return (
    <svg
      viewBox="0 0 600 600"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Waves */}
      {WAVE_PARAMS.map((w, i) => (
        <path
          key={`wave-${i}`}
          ref={(el) => { pathRefs.current[i] = el }}
          d={buildWavePath(w.amplitude, w.frequency, w.phase, w.yOffset)}
          stroke="currentColor"
          strokeWidth={1.5}
          fill="none"
          opacity={w.opacity}
        />
      ))}

      {/* Particles */}
      {particles.map((p, i) => (
        <motion.circle
          key={`particle-${i}`}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="currentColor"
          animate={shouldReduceMotion ? undefined : { opacity: [0.1, 0.8, 0.1] }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: p.pulseDuration,
                  delay: p.pulseDelay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          style={{ opacity: 0.2 }}
        />
      ))}
    </svg>
  )
}
