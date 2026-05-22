"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "motion/react"

interface ShellPoint {
  x: number
  y: number
  r: number
  opacity: number
}

export function ShellVisualDemo() {
  const shouldReduceMotion = useReducedMotion()

  const { points, lines } = useMemo(() => {
    const a = 5
    const b = 0.15
    const totalTheta = 8 * Math.PI
    const steps = 300
    const pts: ShellPoint[] = []

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * totalTheta
      const rSpiral = a * Math.exp(b * theta)
      const x = Math.round((300 + rSpiral * Math.cos(theta)) * 1e4) / 1e4
      const y = Math.round((300 + rSpiral * Math.sin(theta)) * 1e4) / 1e4
      const dotR = 1 + (i / steps) * 2
      // Opacity varies by angular position within each revolution
      const angularPhase = (theta % (2 * Math.PI)) / (2 * Math.PI)
      const opacity = 0.25 + 0.75 * angularPhase
      pts.push({ x, y, r: dotR, opacity })
    }

    const segs: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
    for (let i = 0; i < pts.length - 1; i++) {
      segs.push({ x1: pts[i].x, y1: pts[i].y, x2: pts[i + 1].x, y2: pts[i + 1].y })
    }

    return { points: pts, lines: segs }
  }, [])

  return (
    <svg
      viewBox="0 0 600 600"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Breathing outer wrapper */}
      <motion.g
        animate={shouldReduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {/* Rotating inner group */}
        <motion.g
          style={{ transformOrigin: "300px 300px" }}
          animate={shouldReduceMotion ? undefined : { rotate: 360 }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 120, repeat: Infinity, ease: "linear" }
          }
        >
          {lines.map((seg, i) => (
            <line
              key={`seg-${i}`}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke="currentColor"
              strokeWidth={0.5}
              opacity={0.3}
            />
          ))}

          {points.map((p, i) => (
            <circle
              key={`pt-${i}`}
              cx={p.x}
              cy={p.y}
              r={p.r}
              fill="currentColor"
              opacity={p.opacity}
            />
          ))}
        </motion.g>
      </motion.g>
    </svg>
  )
}
